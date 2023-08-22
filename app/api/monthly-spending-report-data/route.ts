import { NextResponse } from "next/server";

import { client } from "@/config/plaid";
import { Account, AccountTransaction, Bill } from "@/utils/types";
import findUserLink from "@/utils/isLinked";
import { Transaction } from "plaid";

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
  const { firstDay, lastDay, accounts, user } = await request.json();
  const res = await findUserLink(user);

  const spending = await getSpending(
    accounts.filter((acc: Account) => acc.subtype === "checking"),
    res.access_token,
    firstDay,
    lastDay
  );

  return NextResponse.json({ spending });
}
