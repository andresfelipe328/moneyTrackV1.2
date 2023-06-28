import React from "react";
import SpendingAreaChart from "./spending/SpendingAreaChart";

const Spending = () => {
  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <h2>Current Spending:</h2>
      <p className="text-lg font-semibold">$50.99</p>
      <SpendingAreaChart />
    </div>
  );
};

export default Spending;
