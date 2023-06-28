import React from "react";

import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";
import Bills from "@/components/bills-transactions/Bills";
import Transactions from "@/components/bills-transactions/Transactions";
import BillCalendar from "@/components/bills-transactions/BillCalendar";

const page = () => {
  return (
    <BasicLayoutAnimation
      Tag="div"
      style={"flex flex-col gap-2 max-w-7xl mx-auto w-full p-4"}
    >
      <h1>Bills & Transactions</h1>
      <BillCalendar />
      <Bills />
      <Transactions />
    </BasicLayoutAnimation>
  );
};

export default page;
