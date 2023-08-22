export const revalidate = 60;

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

import findUserLink from "@/utils/isLinked";
import { client } from "@/config/plaid";
import { Account, OverviewTransaction, Subscription } from "@/utils/types";
import { Budget } from "@/models/models";
import { ObjectId } from "mongodb";

import Spending from "@/components/dashboardPage/Spending";
import Budgets from "@/components/dashboardPage/Budgets";
import Balances from "@/components/dashboardPage/Balances";
import Subscriptions from "@/components/dashboardPage/Subscriptions";
import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";
import { Transaction } from "plaid";

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

// Get Subscriptions
const getSubscriptions = async (accounts: Account[], access_token: string) => {
  // Variables
  const subscriptionList: Subscription[] = [];

  // function call to request recurring transactions
  const recurringTransactions = await client.transactionsRecurringGet({
    access_token,
    account_ids: accounts.map((acc) => acc.account_id),
  });

  // Focusing on outflow stream only
  let outflowStreams = recurringTransactions.data.outflow_streams;

  // Iterating over outflow to look at transactions with a "Subscription" category
  outflowStreams.forEach((transaction) => {
    if (transaction.category.includes("Subscription"))
      subscriptionList.push({
        name: transaction.merchant_name!,
        firstDate: transaction.first_date,
        amount: transaction.average_amount.amount!,
        id: transaction.stream_id,
      });
  });

  return [];
};

// Get Spending
const getSpending = async (
  accounts: Account[],
  access_token: string,
  firstDay: string,
  lastDay: string
) => {
  // Variables
  const omitCategories = [
    "Transfer",
    "Credit Card",
    "Deposit",
    "Payment",
    "Service",
    "Bank Fees",
  ];

  // function call to request monthly transactions
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
  /* 
  Iterating over transactions to find spending, transactions that don't have certain categories 
  and that are going out the account
  */
  const spending: OverviewTransaction[] = transactions
    .filter((transaction) => {
      const validCategory =
        transaction.category!.some(
          (categ) => omitCategories.indexOf(categ) >= 0
        ) === false && !transaction.name.includes("RECURRING");
      const isOutflow = transaction.amount > 0;

      if (validCategory && isOutflow)
        return {
          name: transaction.merchant_name,
          amount: transaction.amount,
          date: transaction.date,
        };
      else return null;
    })
    .reverse();

  console.log(spending);

  return { spending, transactions };
};

// Get Budgets ========================================================================================================
const getBudgets = async (user: any) => {
  const budgets = await Budget.find({
    userid: user.id,
  });

  return budgets;
};

export default async function Home() {
  // Checks for authentication
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Checks for bank account link(s)
  const res = await findUserLink(session);

  // Variables
  let accounts: Account[] = [];
  let subscriptions: Subscription[] = [];
  let currSpending: {
    spending: OverviewTransaction[];
    transactions: Transaction[];
  };
  let prevSpending: OverviewTransaction[] = [];
  let budgets: any = [];

  // If not linked to bank, redirect to link-to-bank page
  if (!res?.status) redirect("/link-to-bank");
  // Gets spending, budgets, balances, and subscriptions
  else {
    accounts = await getAccounts(res.access_token);
    subscriptions = await getSubscriptions(
      accounts.filter((acc) => acc.subtype === "checking"),
      res.access_token
    );

    // Variables
    const todayDate = new Date();
    const firstMonthDate = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      1
    );

    currSpending = await getSpending(
      accounts.filter((acc) => acc.subtype === "checking"),
      res.access_token,
      firstMonthDate.toISOString().slice(0, 10),
      todayDate.toISOString().slice(0, 10)
    );
    // const prevFirstDay = new Date(
    //   todayDate.getFullYear(),
    //   todayDate.getMonth() - 1,
    //   1
    // );
    // const prevLastDay = new Date(
    //   todayDate.getFullYear(),
    //   todayDate.getMonth(),
    //   0
    // );
    // prevSpending = await getSpending(
    //   accounts.filter((acc) => acc.subtype === "checking"),
    //   res.access_token,
    //   prevFirstDay.toISOString().slice(0, 10),
    //   prevLastDay.toISOString().slice(0, 10)
    // );
    budgets = await getBudgets(session.user);
  }

  return (
    <BasicLayoutAnimation
      Tag="div"
      style={"relative flex flex-col gap-2 max-w-7xl mx-auto w-full p-4"}
    >
      <h1>Dashboard</h1>
      <Spending
        currSpending={currSpending.spending} /*prevSpending={prevSpending}*/
      />
      <Budgets
        spending={currSpending.transactions}
        budgets={JSON.stringify(budgets)}
      />
      <Balances accounts={accounts} />
      <Subscriptions subscriptions={subscriptions} />
    </BasicLayoutAnimation>
  );
}
