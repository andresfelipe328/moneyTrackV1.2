"use client";

import React from "react";

import { Budget } from "@/utils/types";
import BudgetPieChart from "./BudgetPieChart";
import { roundValue } from "@/utils/roundValue";

type Props = {
  pieChartContents: Budget | null;
  budget: string;
};

const BudgetChartOverview = ({ pieChartContents, budget }: Props) => {
  if (pieChartContents) {
    return (
      <div className="flex items-center gap-2">
        <BudgetPieChart pieChartContents={pieChartContents} />

        <div className="flex flex-col gap-1">
          <h3>Left for Spending:</h3>
          <p className="font-semibold">
            $
            {roundValue(
              Number(pieChartContents.limit) - Number(pieChartContents.amount)
            )}
          </p>
          <small className="opacity-80">on {pieChartContents.name}</small>
        </div>
      </div>
    );
  } else return <small>You have no budgets</small>;
};

export default BudgetChartOverview;
