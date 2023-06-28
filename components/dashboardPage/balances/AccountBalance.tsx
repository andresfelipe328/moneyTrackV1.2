import React from "react";

const AccountBalance = () => {
  return (
    <div className="flex flex-col gap-1 bg-primary-dark/5 rounded-md p-2">
      <div className="flex items-center justify-between">
        <h3>NAME OF ACCOUNT</h3>
        <p className="text-primary-dark">$700.00</p>
      </div>

      <div className="flex items-center justify-between">
        <small>Total Credit Available: $500.00</small>
        <small>$250.00 available</small>
      </div>

      <div className="bg-primary-dark rounded-lg w-full h-3 p-1">
        <div className="bg-primary-light rounded-lg w-1/2 h-1"></div>
      </div>
    </div>
  );
};

export default AccountBalance;
