import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import { Account, AccountTransaction, Bill } from "@/utils/types";
import { client } from "@/config/plaid";

import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";
import Bills from "@/components/bills-transactions/Bills";
import Transactions from "@/components/bills-transactions/Transactions";
import BillCalendar from "@/components/bills-transactions/BillCalendar";
import findUserLink from "@/utils/isLinked";

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

// Get Grouped Transactions ===========================================================================================
const getGroupedTransactions = async (
  access_token: string,
  accounts: Account[],
  firstDay: string,
  lastDay: string
) => {
  let groupedTransactions: AccountTransaction[] = [];
  const monthlyTranscations = await client.transactionsGet({
    access_token,
    start_date: firstDay,
    end_date: lastDay,
    //   options: {
    //    count: 10
    //   }
  });

  let transactions = monthlyTranscations.data.transactions;
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

  transactions.forEach((transaction) => {
    const transactionsGroup = groupedTransactions.find(
      (group) => group.accountID === transaction.account_id
    );
    if (transactionsGroup) transactionsGroup.transactions.push(transaction);
    else {
      const accName = accounts.find(
        (acc) => acc.account_id === transaction.account_id
      );
      groupedTransactions.push({
        accountID: transaction.account_id,
        accountName: accName!.name,
        transactions: [transaction],
      });
    }
  });

  return groupedTransactions;
};

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const res = await findUserLink(session);

  let accounts: Account[] = [];
  let bills: Bill[] = [];
  let groupedTransactions: AccountTransaction[] = [];

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
      <Transactions groupedTransactions={groupedTransactions} />
    </BasicLayoutAnimation>
  );
};

export default page;
