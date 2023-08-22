import { Budget } from "@/models/models";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { session, budget_name, budget_amount, mCateg, sCateg } =
    await request.json();

  const isBudget = await Budget.findOne({
    budget_name,
  });

  if (!isBudget) {
    try {
      await Budget.create({
        userid: session.user.id,
        budget_name,
        budget_amount,
        mCategory: mCateg,
        sCategory: sCateg,
      });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ message: "success", code: 400 });
    }
  }

  return NextResponse.json({ message: "success", code: 200 });
}
