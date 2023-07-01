import React from "react";
import AccountBalance from "./balances/AccountBalance";
import { Account } from "@/utils/types";

type Props = {
  accounts: Account[];
};

const Balances = ({ accounts }: Props) => {
  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <h2>Balances</h2>

      <ul className="flex flex-col gap-4">
        {accounts.map((account, index) => (
          <AccountBalance account={account} key={index} />
        ))}
      </ul>
    </div>
  );
};

export default Balances;
