"use client";

import React from "react";
import { Transaction } from "plaid";

import { MdMoreHoriz } from "react-icons/md";

type Props = {
  transaction: Transaction;
};

const Transaction = ({ transaction }: Props) => {
  return (
    <div className="flex items-center justify-between gap-1 bg-primary-dark/5 rounded-md p-2">
      <div className="flex flex-col gap-1">
        <h2>{transaction.merchant_name || transaction.name}</h2>
        <small>{transaction.date}</small>
      </div>

      <div className="flex items-center gap-2">
        <p className="font-semibold">${transaction.amount}</p>
        <button className="group nav-link">
          <MdMoreHoriz className="icon" />
        </button>
      </div>
    </div>
  );
};

export default Transaction;
