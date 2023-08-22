"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";

import { Transaction } from "plaid";
import { Account, ChartContent } from "@/utils/types";
import uniqolor from "uniqolor";

import SpendingPieChart from "./spending/SpendingPieChart";
import SummaryTable from "./spending/SummaryTable";

type Props = {
  spending: Transaction[];
  accounts: Account[];
};

const Spending = ({ spending, accounts }: Props) => {
  // Variables
  const todayDate = new Date();
  const { data } = useSession();
  const [currSpending, setCurrSpending] = useState(
    createSpendingContent(spending)
  );
  const [date, setDate] = useState<string>(todayDate.toISOString().slice(0, 7));

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

    // Api call to fetch spending data
    const res = await fetch(
      "http://localhost:3000/api/monthly-spending-report-data",
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
    const { spending } = await res.json();

    // Update state
    setCurrSpending(createSpendingContent(spending));
  };

  // Creates styled data for the charts
  function createSpendingContent(spending: Transaction[]) {
    let content: ChartContent[] = [];
    spending.forEach((item) => {
      if (!content.find((data) => data.label === item.category![0])) {
        const color = uniqolor.random();
        content.push({
          label: item.category![0],
          amount: Math.abs(item.amount),
          color: color,
        });
      } else {
        const spendCateg = content.find(
          (data) => data.label === item.category![0]
        )!;
        spendCateg.amount += Math.abs(item.amount);
      }
    });
    return content;
  }

  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <div className="flex items-center justify-between">
        <h2>Spending</h2>
        <input
          id="report-spending-input"
          type="month"
          value={date}
          max={todayDate.toISOString().slice(0, 7)}
          onChange={fetchMonthData}
          className="cursor-pointer"
        />
      </div>

      <SpendingPieChart spending={currSpending} />
      <SummaryTable spending={currSpending} />
    </div>
  );
};

export default Spending;
