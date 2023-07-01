"use client";

import React from "react";

import { Transaction } from "plaid";
import { OverviewTransaction } from "@/utils/types";
import { roundValue } from "@/utils/roundValue";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  earnings: Transaction[];
  spending: OverviewTransaction[];
  date: string;
};

const FinanceBarChart = ({ earnings, spending, date }: Props) => {
  const addAmounts = (type: string) => {
    let totalSpending: number = 0;
    if (type === "earnings")
      earnings.map((item) => {
        totalSpending += Math.abs(item.amount);
      });
    else
      spending.map((item) => {
        totalSpending += Math.abs(item.amount);
      });

    return roundValue(totalSpending);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        border: {
          display: true,
          width: 2,
          color: "rgba(117, 101, 76, .75)",
        },
        ticks: {
          callback: (value: any) => "$" + value,
          color: "rgba(141, 155, 106, 1)",
          font: {
            size: 12,
          },
        },
      },
      x: {
        border: {
          display: true,
          width: 2,
          color: "rgba(117, 101, 76, .75)",
        },
        ticks: {
          color: "rgba(141, 155, 106, 1)",
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          color: "rgba(141, 155, 106, 1)",
        },
      },
    },
  };

  const data = {
    labels: [date],
    datasets: [
      {
        label: "Earned",
        data: [addAmounts("earnings")],
        backgroundColor: "#8A9EA7",
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 12,
      },
      {
        label: "Spent",
        data: [addAmounts("spending")],
        backgroundColor: "#75654C",
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 12,
      },
    ],
  };

  return (
    <div className="w-[85%] mx-auto">
      <Bar options={options} data={data} />
    </div>
  );
};

export default FinanceBarChart;
