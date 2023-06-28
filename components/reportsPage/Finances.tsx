"use client";

import React, { useState } from "react";
import FinanceBarChart from "./finances/FinanceBarChart";
import SummaryTable from "./finances/SummaryTable";

const Finances = () => {
  const todayDate = new Date();
  const [date, setDate] = useState<string>(todayDate.toISOString().slice(0, 7));

  const fetchMonthData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <div className="flex items-center justify-between">
        <h2>Finances</h2>
        <input
          id="finance-report-date-input"
          type="month"
          value={date}
          max={todayDate.toISOString().slice(0, 7)}
          onChange={fetchMonthData}
          className="cursor-pointer"
        />
      </div>
      <FinanceBarChart />
      <SummaryTable />
    </div>
  );
};

export default Finances;
