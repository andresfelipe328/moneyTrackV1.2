import React from "react";
import Link from "next/link";

import { ChartContent } from "@/utils/types";
import { roundValue } from "@/utils/roundValue";

import { RiArrowRightSLine } from "react-icons/ri";

type Props = {
  spending: ChartContent[];
};

const SUMMARYITEMS = [
  {
    text: "Current Earnings",
  },
  {
    text: "Bills Paid",
  },
  {
    text: "Current Spending",
  },
];

const SummaryTable = ({ spending }: Props) => {
  return (
    <ul className="flex flex-col gap-4 ">
      {spending.map((item, index) => (
        <li
          key={index}
          className="flex items-center justify-between p-2 rounded-md bg-primary-dark/5"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: item.color.color }}
            >
              <small
                className={`uppercase ${
                  item.color.isLight
                    ? "text-primary-dark"
                    : `text-primary-light`
                }`}
              >
                {item.label[0]}
              </small>
            </div>
            <h3>{item.label}</h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">${roundValue(item.amount)}</p>
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
