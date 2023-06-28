import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";
import Finances from "@/components/reportsPage/Finances";
import Spending from "@/components/reportsPage/Spending";
import React from "react";

const page = () => {
  return (
    <BasicLayoutAnimation
      Tag="div"
      style={"flex flex-col gap-2 max-w-7xl mx-auto w-full p-4"}
    >
      <h1>Reports</h1>
      <Finances />
      <Spending />
    </BasicLayoutAnimation>
  );
};

export default page;
