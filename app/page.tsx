import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

import findUserLink from "@/utils/isLinked";
import { client } from "@/config/plaid";
import { Account, OverviewTransaction, Subscription } from "@/utils/types";

import Spending from "@/components/dashboardPage/Spending";
import Budgets from "@/components/dashboardPage/Budgets";
import Balances from "@/components/dashboardPage/Balances";
import Subscriptions from "@/components/dashboardPage/Subscriptions";
import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";

// Get Balances =======================================================================================================
const getAccounts = async (access_token: string) => {
  const response = await client.accountsBalanceGet({
    access_token,
  });

  return response.data.accounts;
};

// Get Subscriptions ==================================================================================================
const getSubscriptions = async (accounts: Account[], access_token: string) => {
  const subscriptionList: Subscription[] = [];

  const recurringTransactions = await client.transactionsRecurringGet({
    access_token,
    account_ids: accounts.map((acc) => acc.account_id),
  });

  let outflowStreams = recurringTransactions.data.outflow_streams;
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

// Get Spending =======================================================================================================
const getSpending = async (
  accounts: Account[],
  access_token: string,
  firstDay: string,
  lastDay: string
) => {
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

  const spending = transactions
    .filter((transaction) => {
      const validCategory =
        transaction.category!.some(
          (categ) => omitCategories.indexOf(categ) >= 0
        ) === false;
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

  return spending;
};

export default async function Home() {
  // Checks for authentication
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Checks for bank account link(s)
  const res = await findUserLink(session);

  let accounts: Account[] = [];
  let subscriptions: Subscription[] = [];
  let currSpending: OverviewTransaction[] = [];
  let prevSpending: OverviewTransaction[] = [];

  if (!res?.status) redirect("/link-to-bank");
  // Gets spending, budgets, balances, and subscriptions
  else {
    accounts = await getAccounts(res.access_token);
    subscriptions = await getSubscriptions(
      accounts.filter((acc) => acc.subtype === "checking"),
      res.access_token
    );

    const todayDate: Date = new Date();
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
  }

  return (
    <BasicLayoutAnimation
      Tag="div"
      style={"flex flex-col gap-2 max-w-7xl mx-auto w-full p-4"}
    >
      <h1>Dashboard</h1>

      <Spending currSpending={currSpending} /*prevSpending={prevSpending}*/ />
      <Budgets />
      <Balances accounts={accounts} />
      <Subscriptions subscriptions={subscriptions} />
    </BasicLayoutAnimation>
  );
}
