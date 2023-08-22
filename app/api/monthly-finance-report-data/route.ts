import { NextResponse } from "next/server";

import { client } from "@/config/plaid";
import { Account, AccountTransaction, Bill } from "@/utils/types";
import findUserLink from "@/utils/isLinked";
import { Transaction } from "plaid";

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

export async function POST(request: Request) {
  const { firstDay, lastDay, accounts, user } = await request.json();
  const res = await findUserLink(user);

  const { earnings, spending } = await getEarningsSpending(
    accounts.filter((acc: Account) => acc.subtype === "checking"),
    res.access_token,
    firstDay,
    lastDay
  );
  const bills = await getBills(
    res.access_token,
    accounts.filter((acc: Account) => acc.subtype === "checking")
  );

  return NextResponse.json({ earnings, spending, bills });
}
