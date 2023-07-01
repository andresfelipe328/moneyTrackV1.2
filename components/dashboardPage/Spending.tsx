import React from "react";

import { OverviewTransaction } from "@/utils/types";
import { roundValue } from "@/utils/roundValue";

import SpendingAreaChart from "./spending/SpendingAreaChart";

type Props = {
  currSpending: OverviewTransaction[];
  prevSpending?: OverviewTransaction[];
};

const Spending = ({ currSpending }: Props) => {
  const getTotalSpending = () => {
    let totalSpending: number = 0;
    currSpending.map((item) => {
      totalSpending += item.amount;
    });

    return roundValue(totalSpending);
  };

  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <h2>Current Spending:</h2>
      <p className="text-lg font-semibold">${getTotalSpending()}</p>
      <SpendingAreaChart currSpending={currSpending} />
    </div>
  );
};

export default Spending;
