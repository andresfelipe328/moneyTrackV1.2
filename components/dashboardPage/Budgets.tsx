import React from "react";

import { BiPlus } from "react-icons/bi";
import BudgetChart from "./budgets/BudgetChart";

const Budgets = () => {
  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <h2>Budgets</h2>

      <div className="flex flex-col gap-2 items-center justify-center">
        <BudgetChart />

        <div className="flex items-center gap-2">
          <button className="budget-btn">
            <small className="text-primary-light">All</small>
          </button>

          <button className="budget-btn">
            <BiPlus className="icon text-primary-light" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
