import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import findUserLink from "@/utils/isLinked";

import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";
import LinkToBank from "@/components/linkToBankPage/LinkToBank";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const res = await findUserLink(session);
  if (res?.status) redirect("/");

  return (
    <BasicLayoutAnimation
      Tag="div"
      style={
        "flex flex-col items-center justify-center gap-2 max-w-7xl mx-auto w-full h-full p-4"
      }
    >
      <h1>Link to Bank</h1>
      <div>
        <LinkToBank session={session} />
      </div>
    </BasicLayoutAnimation>
  );
};

export default page;
