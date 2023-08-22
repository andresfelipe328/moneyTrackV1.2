import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import findUserLink from "@/utils/isLinked";
import { Account, Bill } from "@/utils/types";
import { Transaction } from "plaid";
import { client } from "@/config/plaid";
import { Budget } from "@/models/models";

import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";
import Finances from "@/components/reportsPage/Finances";
import Spending from "@/components/reportsPage/Spending";
import Budgets from "@/components/reportsPage/Budgets";

// Get Balances
const getAccounts = async (access_token: string) => {
  // function call to requests accounts' balances
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/accounts`, {
    method: "POST",
    cache: "force-cache",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      access_token,
    }),
  });

  const { accounts } = await res.json();

  return accounts;
};

// Get Bills
const getBills = async (access_token: string, accounts: Account[]) => {
  // function call to get recurring transactions
  const recurringTransactions = await client.transactionsRecurringGet({
    access_token,
    account_ids: accounts.map((acc) => acc.account_id),
  });

  // Variables
  const outflowStreams = recurringTransactions.data.outflow_streams;
  const billCategories = ["Service", "Rent", "Healthcare Services"];
  let bills: Bill[] = [];

  /* 
  Iterating over outflow to find recurring bills that fall under a set of 
  categories. It also takes into account same bills that may have different 
  payment date. 
  */
  outflowStreams.forEach((transaction) => {
    const billIndex = bills.findIndex(
      (bill) => bill.name === transaction.merchant_name
    );

    if (
      (billCategories.some((r) => transaction.category!.indexOf(r) >= 0) ||
        transaction.description.includes("RECURRING")) &&
      !transaction.description.includes("HOLD") &&
      !transaction.description.includes("Zelle")
    ) {
      if (
        !bills.find((bill: Bill) => bill.name === transaction.merchant_name)
      ) {
        bills.push({
          name: transaction.merchant_name!,
          chargeDate: transaction.last_date.replace("-", " "),
          amount: transaction.last_amount.amount!,
          id: transaction.stream_id,
          recurring: transaction.description.includes("RECURRING")
            ? true
            : false,
        });
      } else {
        bills.splice(billIndex, 1, {
          name: transaction.merchant_name!,
          chargeDate: transaction.last_date.replace("-", " "),
          amount: transaction.last_amount.amount!,
          id: transaction.stream_id,
          recurring: transaction.description.includes("RECURRING")
            ? true
            : false,
        });
      }
    }
  });
  return bills;
};

// Get Earnings & Spending
const getEarningsSpending = async (
  accounts: Account[],
  access_token: string,
  firstDay: string,
  lastDay: string
) => {
  // Variables
  let earnings: Transaction[] = [];
  let spending: Transaction[] = [];
  const omitCategories = [
    "Transfer",
    "Credit Card",
    "Deposit",
    "Payment",
    "Service",
    "Bank Fees",
  ];

  // function call to get monthly transactions
  const monthlyTranscations = await client.transactionsGet({
    access_token,
    start_date: firstDay,
    end_date: lastDay,
    options: {
      account_ids: accounts.map((acc) => acc.account_id),
    },
  });

  let transactions = monthlyTranscations.data.transactions;

  // Getting the rest of monthly transactions
  while (transactions.length < monthlyTranscations.data.total_transactions) {
    const remainingTransactions = await client.transactionsGet({
      access_token,
      start_date: firstDay,
      end_date: lastDay,
      options: {
        offset: transactions.length,
        account_ids: accounts.map((acc) => acc.account_id),
      },
    });
    transactions = transactions.concat(remainingTransactions.data.transactions);
  }

  // Iterating over transactions to look for earnings and spending
  transactions.reverse().forEach((transaction) => {
    if (transaction.category!.includes("Payroll")) {
      earnings.push(transaction);
    }

    const validCategory =
      transaction.category!.some(
        (categ) => omitCategories.indexOf(categ) >= 0
      ) === false && !transaction.name.includes("RECURRING");
    const isOutflow = transaction.amount > 0;

    if (validCategory && isOutflow) spending.push(transaction);
  });

  return { earnings, spending };
};

// Get Budgets
const getBudgets = async (user: any) => {
  const budgets = await Budget.find({
    userid: user.id,
  });

  return budgets;
};

const page = async () => {
  // Checks for authentication
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Checks for bank account link(s)
  const res = await findUserLink(session);

  // Variables
  let accounts: Account[] = [];
  let bills: Bill[] = [];
  let earnings: Transaction[] = [];
  let spending: Transaction[] = [];
  let budgets: any = [];

  // If not linked to bank, redirect to link-to-bank page
  if (!res?.status) redirect("/link-to-bank");
  // Gets accounts, earnings, spending, and bills
  else {
    accounts = await getAccounts(res.access_token);
    bills = await getBills(
      res.access_token,
      accounts.filter((acc) => acc.subtype === "checking")
    );

    // Variables
    const todayDate: Date = new Date();
    const firstMonthDate = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      1
    );

    const result = await getEarningsSpending(
      accounts.filter((acc) => acc.subtype === "checking"),
      res.access_token,
      firstMonthDate.toISOString().slice(0, 10),
      todayDate.toISOString().slice(0, 10)
    );

    budgets = await getBudgets(session.user);

    earnings = result.earnings.reverse();
    spending = result.spending.reverse();
  }

  return (
    <BasicLayoutAnimation
      Tag="div"
      style={"flex flex-col gap-2 max-w-7xl mx-auto w-full p-4"}
    >
      <h1>Reports</h1>
      <Finances
        earnings={earnings}
        spending={spending}
        bills={bills}
        accounts={accounts}
      />
      <Spending spending={spending} accounts={accounts} />

      <Budgets spending={spending} budgets={JSON.stringify(budgets)} />
    </BasicLayoutAnimation>
  );
};

export default page;
