import React from "react";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import { Account, AccountTransaction, Bill } from "@/utils/types";
import { client } from "@/config/plaid";

import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";
import Bills from "@/components/bills-transactions/Bills";
import Transactions from "@/components/bills-transactions/Transactions";
import BillCalendar from "@/components/bills-transactions/BillCalendar";
import findUserLink from "@/utils/isLinked";

// Get Balances =======================================================================================================
const getAccounts = async (access_token: string) => {
  // function call to requests accounts' balances
  const res = await fetch("http://localhost:3000/api/accounts", {
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

// Get Bills ==========================================================================================================
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

// Get Grouped Transactions ===========================================================================================
const getGroupedTransactions = async (
  access_token: string,
  accounts: Account[],
  firstDay: string,
  lastDay: string
) => {
  // Variables
  let groupedTransactions: AccountTransaction[] = [];

  // Get monthly transactions
  const monthlyTranscations = await client.transactionsGet({
    access_token,
    start_date: firstDay,
    end_date: lastDay,
    //   options: {
    //    count: 10
    //   }
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
      },
    });
    transactions = transactions.concat(remainingTransactions.data.transactions);
  }

  // Iterating over transactions to grouped transactions based on account
  transactions.forEach((transaction) => {
    const transactionsGroup = groupedTransactions.find(
      (group) => group.accountID === transaction.account_id
    );
    if (transactionsGroup) transactionsGroup.transactions.push(transaction);
    else {
      const account = accounts.find(
        (acc) => acc.account_id === transaction.account_id
      );
      groupedTransactions.push({
        accountID: transaction.account_id,
        accountName: account!.name,
        mask: account!.mask!,
        transactions: [transaction],
      });
    }
  });

  return groupedTransactions;
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
  let groupedTransactions: AccountTransaction[] = [];

  // If not linked to bank, redirect to link-to-bank page
  if (!res?.status) redirect("/link-to-bank");
  // Gets accounts, bills, and grouped transactions
  else {
    accounts = await getAccounts(res.access_token);
    bills = await getBills(
      res.access_token,
      accounts.filter((acc) => acc.subtype === "checking")
    );

    // Variables
    const todayDate = new Date();
    const firstMonthDate = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      1
    );
    groupedTransactions = await getGroupedTransactions(
      res.access_token,
      accounts,
      firstMonthDate.toISOString().slice(0, 10),
      todayDate.toISOString().slice(0, 10)
    );
  }

  return (
    <BasicLayoutAnimation
      Tag="div"
      style={"flex flex-col gap-2 max-w-7xl mx-auto w-full p-4"}
    >
      <h1>Bills & Transactions</h1>
      <BillCalendar />
      <Bills bills={bills} />
      <Transactions
        groupedTransactions={groupedTransactions}
        accountList={accounts}
      />
    </BasicLayoutAnimation>
  );
};

export default page;
