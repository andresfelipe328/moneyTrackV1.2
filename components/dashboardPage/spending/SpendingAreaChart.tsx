"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const SpendingChart = () => {
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        border: {
          display: true,
          width: 2,
          color: "rgba(232, 237, 223, .25)",
        },
        ticks: {
          callback: (value: any) => "$" + value,
          color: "rgba(232, 237, 223, .55)",
          font: {
            size: 12,
          },
        },
      },
      x: {
        display: false,
        border: {
          display: true,
          width: 2,
          color: "rgba(232, 237, 223, .25)",
        },
        ticks: {
          color: "rgba(232, 237, 223, .55)",
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        padding: 8,
        boxPadding: 3,
        // callbacks: {
        //    label: (ctx: any) => {
        //       let label = ctx.raw;
        //       return [`${spending[ctx.dataIndex].name}: `, `$${label}`]
        //    }
        // }
      },
    },
  };

  const data: any = {
    labels: ["Jan", "Feb", "March", "April", "May", "June", "July"],
    datasets: [
      {
        fill: true,
        tension: 0.3,
        data: [120, 270, 300],
        pointBackgroundColor: "#333533",
        pointBorderColor: "rgba(245, 203, 92, .5)",
        pointBorderWidth: 2,
        pointRadius: 5,
        borderColor: "rgba(117, 101, 76, .85)",
        backgroundColor: "rgba(141, 155, 106, .85)",
      },
      {
        labels: ["Jan", "Feb", "March", "April", "May", "June", "July"],
        fill: true,
        tension: 0.3,
        data: [100, 20, 380, 610, 900, 547, 234],
        pointRadius: 0,
        borderColor: "rgba(117, 101, 76, .45)",
        backgroundColor: "rgba(138, 158, 167, .45)",
      },
    ],
  };

  return (
    <div className="h-[10rem]">
      <Line options={options} data={data} />
    </div>
  );
};

export default SpendingChart;
