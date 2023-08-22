import { NextResponse } from "next/server";

import { client } from "@/config/plaid";
import { Account, AccountTransaction } from "@/utils/types";
import findUserLink from "@/utils/isLinked";

export async function POST(request: Request) {
  const { firstDay, lastDay, accounts, user } = await request.json();
  const res = await findUserLink(user);

  let groupedTransactions: AccountTransaction[] = [];
  const monthlyTranscations = await client.transactionsGet({
    access_token: res.access_token,
    start_date: firstDay,
    end_date: lastDay,
    //   options: {
    //    count: 10
    //   }
  });

  let transactions = monthlyTranscations.data.transactions;
  while (transactions.length < monthlyTranscations.data.total_transactions) {
    const remainingTransactions = await client.transactionsGet({
      access_token: res.access_token,
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
        (acc: Account) => acc.account_id === transaction.account_id
      );
      groupedTransactions.push({
        accountID: transaction.account_id,
        accountName: accName!.name,
        transactions: [transaction],
        mask: accounts.find(
          (acc: Account) => acc.account_id === transaction.account_id
        ),
      });
    }
  });

  return NextResponse.json({ groupedTransactions });
}
