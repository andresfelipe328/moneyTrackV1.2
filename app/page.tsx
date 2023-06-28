import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

import Spending from "@/components/dashboardPage/Spending";
import Budgets from "@/components/dashboardPage/Budgets";
import Balances from "@/components/dashboardPage/Balances";
import Subscriptions from "@/components/dashboardPage/Subscriptions";
import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";

export default async function Home() {
  // const session = await getServerSession(authOptions)

  return (
    <BasicLayoutAnimation
      Tag="div"
      style={"flex flex-col gap-2 max-w-7xl mx-auto w-full p-4"}
    >
      <h1>Dashboard</h1>

      <Spending />
      <Budgets />
      <Balances />
      <Subscriptions />
    </BasicLayoutAnimation>
  );
}
