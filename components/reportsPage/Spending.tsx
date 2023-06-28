"use client";

import React, { useState } from "react";
import SpendingPieChart from "./spending/SpendingPieChart";
import SummaryTable from "./spending/SummaryTable";

const Spending = () => {
  const todayDate = new Date();
  const [date, setDate] = useState<string>(todayDate.toISOString().slice(0, 7));

  const fetchMonthData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

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
      <SpendingPieChart />
      <SummaryTable />
    </div>
  );
};

export default Spending;
