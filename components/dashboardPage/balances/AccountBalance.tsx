import React from "react";

import { roundValue } from "@/utils/roundValue";
import { Account } from "@/utils/types";

type Props = {
  account: Account;
};

const AccountBalance = ({ account }: Props) => {
  return (
    <div className="flex flex-col gap-1 bg-primary-dark/5 rounded-md p-2">
      <div className="flex items-center justify-between">
        <h3>
          {account.name} -
          <small className="text-primary-dark/80">{account.mask}</small>
        </h3>
        <p className="text-primary-dark font-semibold">
          ${roundValue(account.balances.current!)}
        </p>
      </div>

      {account.type === "credit" && (
        <>
          <div className="flex items-center justify-between">
            <small>Total Credit Available: ${account.balances.limit}</small>
            <small>${roundValue(account.balances.available!)} available</small>
          </div>
          <div className="bg-primary-dark rounded-lg w-full h-3 p-1">
            <div className="bg-primary-light rounded-lg w-1/2 h-1"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountBalance;
