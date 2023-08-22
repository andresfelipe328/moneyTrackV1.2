"use client";

import React, { useState } from "react";

import { Account, Bill, OverviewTransaction } from "@/utils/types";
import { Transaction } from "plaid";

import FinanceBarChart from "./finances/FinanceBarChart";
import SummaryTable from "./finances/SummaryTable";
import { useSession } from "next-auth/react";

type Props = {
  earnings: Transaction[];
  spending: Transaction[];
  bills: Bill[];
  accounts: Account[];
};

const Finances = ({ earnings, spending, bills, accounts }: Props) => {
  // Variables
  const todayDate = new Date();
  const { data } = useSession();
  const [date, setDate] = useState<string>(todayDate.toISOString().slice(0, 7));
  const [currEarnings, setCurrEarnings] = useState(earnings);
  const [currSpending, setCurrSpending] = useState(spending);
  const [currBills, setCurrBills] = useState(bills);

  // Fetch data according to month input
  const fetchMonthData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);

    // Variables
    const stringDate = e.target.value.split("-");
    const firstDay = new Date(Number(stringDate[0]), Number(stringDate[1]) - 1);
    const lastDay =
      todayDate.getMonth() === firstDay.getMonth()
        ? todayDate
        : new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

    // Api call to fetch earnings, spending, and bills
    const res = await fetch(
      "http://localhost:3000/api/monthly-finance-report-data",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          firstDay: firstDay.toISOString().slice(0, 10),
          lastDay: lastDay.toISOString().slice(0, 10),
          accounts,
          user: data,
        }),
      }
    );
    const { earnings, spending, bills } = await res.json();

    // Update state
    setCurrEarnings(earnings);
    setCurrSpending(spending);
    setCurrBills(bills);
  };

  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <div className="flex items-center justify-between">
        <h2>Finances</h2>
        <input
          id="report-finance-input"
          type="month"
          value={date}
          max={todayDate.toISOString().slice(0, 7)}
          onChange={fetchMonthData}
          className="cursor-pointer"
        />
      </div>
      <FinanceBarChart
        earnings={currEarnings}
        spending={currSpending}
        date={date}
      />
      <SummaryTable
        earnings={currEarnings}
        spending={currSpending}
        bills={currBills}
      />
    </div>
  );
};

export default Finances;
