import { Transaction as PlaidTransaction } from "plaid";

export type Account = {
  account_id: string;
  balances: Balance;
  mask: string | null;
  name: string;
  official_name: string | null;
  type: string;
  subtype: string | null;
};

export type Balance = {
  available: number | null;
  current: number | null;
  iso_currency_code: string | null;
  limit: number | null;
  unofficial_currency_code: string | null;
};

export type Subscription = {
  name: string;
  firstDate: string;
  amount: number;
  id: string;
};

export type OverviewTransaction = {
  name: string;
  amount: number;
  date: string;
};

export type Bill = {
  name: string;
  chargeDate: string;
  amount: number;
  id: string;
  recurring: boolean;
};

export type AccountTransaction = {
  accountID: string;
  accountName: string;
  mask: string;
  transactions: PlaidTransaction[];
};

export type ChartContent = {
  label: string;
  amount: number;
  color: {
    color: string;
    isLight: boolean;
  };
};

export type Budget = {
  name: string;
  mCategory: string;
  sCategory: string | null;
  amount: string;
  limit: string;
};
