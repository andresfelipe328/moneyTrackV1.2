import React from "react";
import Link from "next/link";

import { Transaction } from "plaid";
import { Bill, OverviewTransaction } from "@/utils/types";
import { roundValue } from "@/utils/roundValue";

import { FaMoneyCheckAlt } from "react-icons/fa";
import { BsCreditCard2BackFill } from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiArrowRightSLine } from "react-icons/ri";

const SUMMARYITEMS = [
  {
    icon: FaMoneyCheckAlt,
    text: "Current Earnings",
    color: "#5BB450",
    code: "earnings",
  },
  {
    icon: IoDocumentTextOutline,
    text: "Bills Paid",
    color: "#F87171",
    code: "bills",
  },
  {
    icon: BsCreditCard2BackFill,
    text: "Current Spending",
    color: "#8A9EA7",
    code: "spending",
  },
];

type Props = {
  earnings: Transaction[];
  spending: OverviewTransaction[];
  bills: Bill[];
};

const SummaryTable = ({ earnings, spending, bills }: Props) => {
  const getTotals = (code: string) => {
    let total = 0;

    if (code === "spending")
      spending.map((item) => {
        total += item.amount;
      });
    else if (code === "earnings")
      earnings.map((item) => {
        total += item.amount;
      });
    else
      bills.map((item) => {
        total += item.amount;
      });
    return roundValue(total);
  };

  return (
    <ul className="flex flex-col gap-4 ">
      {SUMMARYITEMS.map((item, index) => (
        <li
          key={index}
          className="flex items-center justify-between p-2 rounded-md bg-primary-dark/5"
        >
          <div className="flex items-center gap-2">
            <div
              className="rounded-md p-2"
              style={{ backgroundColor: item.color }}
            >
              <item.icon className="icon text-4xl text-primary-light" />
            </div>
            <h3>{item.text}</h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">${getTotals(item.code)}</p>
            <Link href="/#">
              <RiArrowRightSLine className="icon" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SummaryTable;
