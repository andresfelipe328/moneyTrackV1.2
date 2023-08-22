import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { client } from "@/config/plaid";

export async function POST(req: Request) {
  const { access_token } = await req.json();

  // function call to requests accounts' balances
  const response = await client.accountsBalanceGet({
    access_token,
  });

  return NextResponse.json({ accounts: response.data.accounts });
}
