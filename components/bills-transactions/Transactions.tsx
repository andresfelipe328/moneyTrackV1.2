"use client";

import React, { SyntheticEvent, useState } from "react";
import Transaction from "./transactions/Transaction";

import { AiFillCaretDown } from "react-icons/ai";

const Transactions = () => {
  const todayDate = new Date();
  const [date, setDate] = useState<string>(todayDate.toISOString().slice(0, 7));

  const fetchMonthData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
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

      <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-primary-dark/5 w-full sm:w-1/2 mx-auto">
        <p className="font-semibold">Account Name</p>
        <button className="group nav-link">
          <AiFillCaretDown className="icon" />
        </button>
      </div>

      <ul className="flex flex-col gap-4">
        <Transaction />
      </ul>
    </div>
  );
};

export default Transactions;
