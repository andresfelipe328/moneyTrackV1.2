import React from "react";

const BudgetChart = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-36 h-36 rounded-full border-8 border-primary-dark"></div>

      <div className="flex flex-col gap-1">
        <h3>Left for Spending:</h3>
        <p className="font-semibold">$20.45</p>
        <small className="opacity-80">on CATEGORY</small>
      </div>
    </div>
  );
};

export default BudgetChart;
