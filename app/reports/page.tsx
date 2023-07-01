import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import findUserLink from "@/utils/isLinked";
import { Account, Bill, OverviewTransaction } from "@/utils/types";
import { Transaction } from "plaid";
import { client } from "@/config/plaid";

import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";
import Finances from "@/components/reportsPage/Finances";
import Spending from "@/components/reportsPage/Spending";

// Get Accounts =======================================================================================================
const getAccounts = async (access_token: string) => {
  const response = await client.accountsBalanceGet({
    access_token,
  });

  return response.data.accounts;
};

// Get Bills ==========================================================================================================
const getBills = async (access_token: string, accounts: Account[]) => {
  const recurringTransactions = await client.transactionsRecurringGet({
    access_token,
    account_ids: accounts.map((acc) => acc.account_id),
  });
  const outflowStreams = recurringTransactions.data.outflow_streams;
  const billCategories = ["Service", "Rent", "Healthcare Services"];
  let bills: Bill[] = [];

  outflowStreams.forEach((transaction) => {
    const billIndex = bills.findIndex(
      (bill) => bill.name === transaction.merchant_name
    );

    if (
      (billCategories.some((r) => transaction.category!.indexOf(r) >= 0) ||
        transaction.description.includes("RECURRING")) &&
      !transaction.description.includes("HOLD")
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

// Get Earnings & Spending ============================================================================================
const getEarningsSpending = async (
  accounts: Account[],
  access_token: string,
  firstDay: string,
  lastDay: string
) => {
  let earnings: Transaction[] = [];
  let spending: Transaction[] = [];
  const omitCategories = [
    "Transfer",
    "Credit Card",
    "Deposit",
    "Payment",
    "Service",
  ];

  const monthlyTranscations = await client.transactionsGet({
    access_token,
    start_date: firstDay,
    end_date: lastDay,
    options: {
      account_ids: accounts.map((acc) => acc.account_id),
    },
  });
  let transactions = monthlyTranscations.data.transactions;

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

  transactions.reverse().forEach((transaction) => {
    if (transaction.category!.includes("Payroll")) {
      earnings.push(transaction);
    }

    const validCategory =
      transaction.category!.some(
        (categ) => omitCategories.indexOf(categ) >= 0
      ) === false;
    const isOutflow = transaction.amount > 0;

    if (validCategory && isOutflow) spending.push(transaction);
  });

  return { earnings, spending };
};

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const res = await findUserLink(session);
  let accounts: Account[] = [];
  let bills: Bill[] = [];
  let earnings: Transaction[] = [];
  let spending: Transaction[] = [];

  if (!res?.status) redirect("/link-to-bank");
  else {
    accounts = await getAccounts(res.access_token);
    bills = await getBills(
      res.access_token,
      accounts.filter((acc) => acc.subtype === "checking")
    );

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

    earnings = result.earnings.reverse();
    spending = result.spending.reverse();
  }

  return (
    <BasicLayoutAnimation
      Tag="div"
      style={"flex flex-col gap-2 max-w-7xl mx-auto w-full p-4"}
    >
      <h1>Reports</h1>
      <Finances earnings={earnings} spending={spending} bills={bills} />
      <Spending spending={spending} />
    </BasicLayoutAnimation>
  );
};

export default page;
