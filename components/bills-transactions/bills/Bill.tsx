import React from "react";

import { Bill } from "@/utils/types";

import { MdMoreHoriz } from "react-icons/md";

type Props = {
  bill: Bill;
};

const Bill = ({ bill }: Props) => {
  return (
    <div className="flex items-center justify-between gap-1 bg-primary-dark/5 rounded-md p-2">
      <div className="flex flex-col gap-1">
        <h2>{bill.name}</h2>
        <small>{bill.chargeDate}</small>
      </div>

      <div className="flex items-center gap-2">
        <p>${bill.amount}</p>
        <button className="group nav-link">
          <MdMoreHoriz className="icon" />
        </button>
      </div>
    </div>
  );
};

export default Bill;
