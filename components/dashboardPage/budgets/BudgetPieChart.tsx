"use client";

import React from "react";

import { Budget } from "@/utils/types";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  pieChartContents: Budget;
};

const BudgetPieChart = ({ pieChartContents }: Props) => {
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    datasets: {
      doughnut: {
        borderWidth: 2,
        borderColor: "#8D9B6A",
      },
    },
    elements: {
      arc: {
        borderRadius: 50,
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const percentage =
              ((Number(pieChartContents.limit) -
                Number(pieChartContents.amount)) /
                Number(pieChartContents.limit)) *
              100;
            return "$" + ctx.dataset.data[0].toFixed(2);
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  const data: any = {
    datasets: [
      {
        data: [Number(pieChartContents.limit)],
        circumference: 360,
        backgroundColor: ["#ffffff"],
      },
      {
        data: [Number(pieChartContents.amount)],
        circumference:
          (Number(pieChartContents.amount) / Number(pieChartContents.limit)) *
          360,
        backgroundColor: ["#75654C"],
      },
    ],
  };

  return (
    <div className="relative h-[8rem] w-[8rem]">
      <Doughnut
        data={data}
        options={options}
        // plugins={[bgCircle]}
      />
    </div>
  );
};

export default BudgetPieChart;
