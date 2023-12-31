"use client";

import React, { useState } from "react";
import { Account, AccountTransaction } from "@/utils/types";

import { AiFillCaretDown } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";

import CollapseAnimationLayout from "../animatedLayouts/CollapseAnimationLayout";
import Transaction from "./transactions/Transaction";
import { useSession } from "next-auth/react";

type Props = {
  groupedTransactions: AccountTransaction[];
  accountList: Account[];
};

const Transactions = ({ groupedTransactions, accountList }: Props) => {
  // Variables
  const todayDate = new Date();
  const { data } = useSession();
  const [showAccounts, setShowAccounts] = useState(false);
  const [date, setDate] = useState<string>(todayDate.toISOString().slice(0, 7));
  const [accounts, setAccounts] = useState(groupedTransactions);
  const [currAccount, setCurrAccount] = useState(
    groupedTransactions[0].accountName + "-" + groupedTransactions[0].mask
  );
  const [transactions, setTransactions] = useState(
    groupedTransactions[0].transactions
  );

  // Fetch data according to input month
  const fetchMonthData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);

    // Variables
    const stringDate = e.target.value.split("-");
    const firstDay = new Date(Number(stringDate[0]), Number(stringDate[1]) - 1);
    const lastDay =
      todayDate.getMonth() === firstDay.getMonth()
        ? todayDate
        : new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

    // Api call to fetch data (grouped transactions)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/monthly-transaction-data`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          firstDay: firstDay.toISOString().slice(0, 10),
          lastDay: lastDay.toISOString().slice(0, 10),
          accounts: accountList,
          user: data,
        }),
      }
    );
    const { groupedTransactions } = await res.json();

    // Update state
    setAccounts(groupedTransactions);
    setCurrAccount(groupedTransactions[0].accountName);
    setTransactions(groupedTransactions[0].transactions);
  };

  // Changes transactions display according to account selected
  const handleChangeAcc = (account: AccountTransaction) => {
    setCurrAccount(account.accountName + " - " + account.mask);
    setTransactions(account.transactions);
    setShowAccounts(!showAccounts);
  };

  return (
    <div className="relative p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <div className="flex items-end justify-between">
        <h2>Transactions</h2>
        <input
          id="transactions-date-input"
          type="month"
          value={date}
          max={todayDate.toISOString().slice(0, 7)}
          onChange={fetchMonthData}
          className="cursor-pointer"
        />
      </div>

      <div className=" flex items-center justify-between gap-2 p-2 rounded-md bg-primary-dark/5 w-full sm:w-1/2 mx-auto">
        <p className="font-semibold">{currAccount}</p>
        <button
          className="group nav-link"
          onClick={() => setShowAccounts(!showAccounts)}
        >
          <AiFillCaretDown className="icon" />
        </button>

        <CollapseAnimationLayout
          style="w-full h-fit flex flex-col gap-2 absolute top-0 left-0 bg-primary-light/90 backdrop-blur-[2px] rounded-md shadow-small p-2 overflow-y-auto"
          show={showAccounts}
          setShow={setShowAccounts}
        >
          <button
            className="absolute top-2 right-2"
            onClick={() => setShowAccounts(!showAccounts)}
          >
            <FaTimes className="icon" />
          </button>
          <h3>Your Accounts:</h3>
          <ul className="flex-1 flex flex-col items-center justify-center">
            {accounts.map((account) => (
              <button
                onClick={() => handleChangeAcc(account)}
                key={account.accountID}
                className="w-fit hover:bg-primary-dark/10 rounded-md p-2 hover:shadow-small transition-all duration-300 ease-in-out"
              >
                <p>
                  {account.accountName} - <small>{account.mask}</small>
                </p>
              </button>
            ))}
          </ul>
        </CollapseAnimationLayout>
      </div>

      <ul className="flex flex-col gap-4">
        {transactions.map((transaction, index) => (
          <Transaction transaction={transaction} key={index} />
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
