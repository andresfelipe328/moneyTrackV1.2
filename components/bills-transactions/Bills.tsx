"use client";

import React, { useState } from "react";
import Bill from "./bills/Bill";

const Bills = () => {
  const todayDate = new Date();
  const [date, setDate] = useState<string>(todayDate.toISOString().slice(0, 7));

  const fetchMonthData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <div className="flex items-end justify-between">
        <h2>Bills</h2>
        <input
          id="bills-date-input"
          type="month"
          value={date}
          max={todayDate.toISOString().slice(0, 7)}
          onChange={fetchMonthData}
          className="cursor-pointer"
        />
      </div>
      <ul className="flex flex-col gap-4">
        <Bill />
      </ul>
    </div>
  );
};

export default Bills;
