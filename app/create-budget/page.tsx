import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";
import CreateudgetForm from "@/components/forms/CreateudgetForm";
import findUserLink from "@/utils/isLinked";

const page = async () => {
  // Checks for authentication
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Checks for bank account link(s)
  const res = await findUserLink(session);

  // If not linked to bank, redirect to link-to-bank page
  if (!res?.status) redirect("/link-to-bank");

  return (
    <BasicLayoutAnimation
      Tag="div"
      style={"relative flex flex-col gap-2 max-w-7xl mx-auto w-full h-full p-4"}
    >
      <h1>Create a Budget</h1>
      <CreateudgetForm />
    </BasicLayoutAnimation>
  );
};

export default page;
