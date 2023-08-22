"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Transaction } from "plaid";
import { Budget } from "@/utils/types";

import { BiPlus } from "react-icons/bi";
import BudgetChartOverview from "./budgets/BudgetChartOverview";
import mainCategoryIcons from "@/utils/categoryIcons";

type Props = {
  spending: Transaction[];
  budgets: string;
};

// changes

// Get total remaining of all budgets
const getTotalRemaining = (budgets: Budget[]) => {
  let totalRemaining = 0;

  budgets.map((item) => {
    totalRemaining += Number(item.amount);
  });

  return totalRemaining.toString();
};

// Get total limit of all budgets
const getTotalLimit = (budgets: Budget[]) => {
  let totalLimit = 0;

  budgets.map((item) => {
    totalLimit += Number(item.limit);
  });

  return totalLimit.toString();
};

// Get Pie Chart Contents
const getPieChartContents = (spending: Transaction[], budgets: any[]) => {
  // Variables
  let currBudgets: Budget[] = [];
  // If there are budgets
  if (budgets.length > 0) {
    // Iterate through transactions to see if there are budget transactions
    spending.forEach((transaction) => {
      const budget = budgets.find((budget) => {
        const budgetCateg = budget.sCategory
          ? budget.sCategory
          : budget.mCategory;
        return transaction.category?.includes(budgetCateg);
      });
      // If there is a budget with the category of a transaction, create index
      if (budget) {
        // Find if budget is already an index in currBudgets
        const budgetIndex = currBudgets.findIndex((prev) => {
          if (prev.sCategory) return prev.sCategory === budget.sCategory;
          else return prev.mCategory === budget.mCategory;
        });
        // If yes, find the index and decrement the amount
        if (budgetIndex > -1) {
          currBudgets[budgetIndex].amount = (
            Number(currBudgets[budgetIndex].amount) + Number(transaction.amount)
          ).toString();
        }
        // else, create a remaining and push it to currBudgets
        else {
          currBudgets.push({
            name: budget.budget_name,
            mCategory: budget.mCategory,
            sCategory: budget.sCategory,
            amount: transaction.amount.toString(),
            limit: budget.budget_amount,
          });
        }
      }
    });

    budgets.forEach((budget) => {
      const isPresent = currBudgets.find(
        (item) => item.name === budget.budget_name
      );
      if (!isPresent) {
        currBudgets.push({
          name: budget.budget_name,
          mCategory: budget.mCategory,
          sCategory: budget.sCategory,
          amount: "0",
          limit: budget.budget_amount,
        });
      }
    });

    currBudgets.push({
      name: "all",
      mCategory: "all",
      sCategory: null,
      amount: getTotalRemaining(currBudgets),
      limit: getTotalLimit(currBudgets),
    });
  }

  return currBudgets;
};

const Budgets = ({ spending, budgets }: Props) => {
  // Avoid Warning of passing complex objects from server to client component
  const currBudgets = JSON.parse(budgets);
  const pieChartContents = getPieChartContents(spending, currBudgets);

  const [budget, setBudget] = useState("all");
  const [budgetPieChart, setBudgetPieChart] = useState(() => {
    return pieChartContents.find((budget) => budget.name === "all") || null;
  });

  // Find budget icon
  const findBudgetIcon = (budget: Budget) => {
    const icon = mainCategoryIcons.find(
      (item) => item.name === budget.mCategory
    );

    if (icon) return <icon.icon className="text-primary-light text-lg" />;
    else if (budget.name === "all")
      return (
        <small className="text-primary-light uppercase"> {budget.name}</small>
      );
    else
      return (
        <small className="text-primary-light uppercase">
          {" "}
          {budget.name[0]}
        </small>
      );
  };

  // Change budget data
  const handleChangeBudget = (budget: Budget) => {
    const newBudgetPieChart = pieChartContents.find(
      (item) => item.name === budget.name
    );
    setBudget(budget.name);
    setBudgetPieChart(newBudgetPieChart!);
  };

  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <h2>Budgets</h2>

      <div className="flex flex-col gap-2 items-center justify-center">
        <BudgetChartOverview
          pieChartContents={budgetPieChart}
          budget={budget}
        />

        <div className="flex items-center gap-2">
          {pieChartContents.reverse().map((item, index) => (
            <button
              key={index}
              onClick={() => handleChangeBudget(item)}
              className={`budget-btn ${
                budget === item.name ? "bg-secondary-light" : ""
              }`}
            >
              {findBudgetIcon(item)}
            </button>
          ))}

          <Link href="/create-budget" className="budget-btn">
            <BiPlus className="icon text-primary-light" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
