import React from "react";

import { MdMoreHoriz } from "react-icons/md";
import { Subscription } from "@/utils/types";

type Props = {
  subscription: Subscription;
};

const Subscription = ({ subscription }: Props) => {
  return (
    <div className="flex items-center justify-between gap-1 bg-primary-dark/5 rounded-md p-2">
      <div className="flex flex-col gap-1">
        <h2>{subscription.name}</h2>
        <small>{subscription.firstDate}</small>
      </div>

      <div className="flex items-center gap-2">
        <p>${subscription.amount}</p>
        <button className="group nav-link">
          <MdMoreHoriz className="icon" />
        </button>
      </div>
    </div>
  );
};

export default Subscription;
