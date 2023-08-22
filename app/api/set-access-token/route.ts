import { client } from "@/config/plaid";
import { UserLink } from "@/models/models";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { public_token, userID } = await request.json();

  const response = await client.itemPublicTokenExchange({
    public_token: public_token,
  });

  const accessToken = response.data.access_token;
  const itemID = response.data.item_id;

  await UserLink.create({
    _id: userID,
    is_linked: true,
    access_token: accessToken,
    item_id: itemID,
  });

  return NextResponse.json({ message: "success" });
}
