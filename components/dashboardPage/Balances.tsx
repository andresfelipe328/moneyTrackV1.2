import React from "react";
import AccountBalance from "./balances/AccountBalance";

const Balances = () => {
  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <h2>Balances</h2>

      <ul className="flex flex-col gap-4">
        <AccountBalance />
        <AccountBalance />
      </ul>
    </div>
  );
};

export default Balances;
