import { client } from "@/config/plaid";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const userID = await request.json();
  const configs: any = {
    user: {
      client_user_id: userID,
    },
    client_name: "moneytrack",
    products: ["transactions"],
    country_codes: ["US"],
    language: "en",
  };
  const createTokenResponse = await client.linkTokenCreate(configs);
  return NextResponse.json(createTokenResponse.data);
}
