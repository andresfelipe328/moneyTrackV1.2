import React from "react";
import Link from "next/link";

import { RiArrowRightSLine } from "react-icons/ri";

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

const SummaryTable = () => {
  return (
    <ul className="flex flex-col gap-4 ">
      {SUMMARYITEMS.map((item, index) => (
        <li
          key={index}
          className="flex items-center justify-between p-2 rounded-md bg-primary-dark/5"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-3xl bg-secondary-light flex items-center justify-center">
              <small className="uppercase text-primary-light">
                {item.text[0]}
              </small>
            </div>
            <h3>{item.text}</h3>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">$400.00</p>
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
