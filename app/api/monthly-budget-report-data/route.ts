import { client } from "@/config/plaid";
import { Account, AccountTransaction } from "@/utils/types";
import findUserLink from "@/utils/isLinked";
import { NextResponse } from "next/server";
import { Transaction } from "plaid";

// Get Balances
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

const getSpending = async (
  accounts: Account[],
  access_token: string,
  firstDay: string,
  lastDay: string
) => {
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
    const validCategory =
      transaction.category!.some(
        (categ) => omitCategories.indexOf(categ) >= 0
      ) === false && !transaction.name.includes("RECURRING");
    const isOutflow = transaction.amount > 0;

    if (validCategory && isOutflow) spending.push(transaction);
  });

  return spending;
};

export async function POST(request: Request) {
  const { firstDay, lastDay, user } = await request.json();
  let spending: Transaction[] = [];
  const res = await findUserLink(user);

  if (res.access_token) {
    const accounts = await getAccounts(res.access_token);

    // Get Spending
    spending = await getSpending(
      accounts.filter((acc: Account) => acc.subtype === "checking"),
      res.access_token,
      firstDay,
      lastDay
    );
  }
  console.log(spending);

  return NextResponse.json({ spending });
}
