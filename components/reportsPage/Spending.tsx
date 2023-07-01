"use client";

import React, { useState } from "react";

import { Transaction } from "plaid";
import { ChartContent } from "@/utils/types";
import uniqolor from "uniqolor";

import SpendingPieChart from "./spending/SpendingPieChart";
import SummaryTable from "./spending/SummaryTable";

type Props = {
  spending: Transaction[];
};

const Spending = ({ spending }: Props) => {
  const todayDate = new Date();
  const [date, setDate] = useState<string>(todayDate.toISOString().slice(0, 7));

  const fetchMonthData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const createSpendingContent = () => {
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
  };

  const dataset = createSpendingContent();

  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <div className="flex items-center justify-between">
        <h2>Spending</h2>
        <input
          id="spending-report-date-input"
          type="month"
          value={date}
          max={todayDate.toISOString().slice(0, 7)}
          onChange={fetchMonthData}
          className="cursor-pointer"
        />
      </div>
      <SpendingPieChart spending={dataset} />
      <SummaryTable spending={dataset} />
    </div>
  );
};

export default Spending;
