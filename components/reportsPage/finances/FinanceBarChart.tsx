"use client";

import React from "react";
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

const FinanceBarChart = () => {
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
    labels: ["Jan", "Feb", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Earned",
        data: [100, 20, 380, 610, 900, 547, 234],
        backgroundColor: "#8A9EA7",
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 12,
      },
      {
        label: "Spent",
        data: [200, 120, 80, 310, 400, 747, 434],
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
