"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { Transaction } from "plaid";
import { Budget } from "@/utils/types";
import mainCategoryIcons from "@/utils/categoryIcons";
import { ThreeCircles } from "react-loader-spinner";

import { BiPlus } from "react-icons/bi";

import BudgetChartOverview from "../dashboardPage/budgets/BudgetChartOverview";
import BudgetTransaction from "./budgets/BudgetTransaction";

type Props = {
  spending: Transaction[];
  budgets: string;
};

// Get the total remaining of all budgets
const getTotalRemaining = (budgets: Budget[]) => {
  let totalRemaining = 0;

  budgets.map((item) => {
    totalRemaining += Number(item.amount);
  });

  return totalRemaining.toString();
};

// Get the total limit of all budgets
const getTotalLimit = (budgets: Budget[]) => {
  let totalLimit = 0;

  budgets.map((item) => {
    totalLimit += Number(item.limit);
  });

  return totalLimit.toString();
};

// Gets transactions for all budgets
const getAllBudgetTransactions = (budgets: string, spending: Transaction[]) => {
  const budgetCategories: string[] = [];
  const currBudgets: any[] = JSON.parse(budgets);

  currBudgets.forEach((budget) => {
    budget.sCategory
      ? budgetCategories.push(budget.sCategory)
      : budgetCategories.push(budget.mCategory);
  });

  return spending.filter((transaction) =>
    transaction.category!.some((categ) => budgetCategories.indexOf(categ) >= 0)
  );
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
  // Variables
  const todayDate = new Date();
  const currBudgets = JSON.parse(budgets);
  const [pieChartContents, setPieChartContents] = useState(
    getPieChartContents(spending, currBudgets)
  );
  const { data } = useSession();

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string>(todayDate.toISOString().slice(0, 7));
  const [budgetName, setBudgetName] = useState("all");
  const [currSpending, setCurrSpending] = useState(spending);
  const [budgetPieChart, setBudgetPieChart] = useState(() => {
    return pieChartContents.find((budget) => budget.name === "all") || null;
  });

  const [budgetTransactions, setBudgetTransactions] = useState(
    getAllBudgetTransactions(budgets, spending)
  );

  // Find icon for a budget
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
    setBudgetTransactions(() => {
      if (budget.mCategory === "all")
        return getAllBudgetTransactions(budgets, currSpending);
      else {
        const budgetCateg = budget.sCategory
          ? budget.sCategory
          : budget.mCategory;
        return currSpending.filter((transaction) =>
          transaction.category?.includes(budgetCateg)
        );
      }
    });

    setBudgetName(budget.name);
    setBudgetPieChart(newBudgetPieChart!);
  };

  // Fetch data according to month input
  const fetchMonthData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    setLoading(true);

    // Variables
    const stringDate = e.target.value.split("-");
    const firstDay = new Date(Number(stringDate[0]), Number(stringDate[1]) - 1);
    const lastDay =
      todayDate.getMonth() === firstDay.getMonth()
        ? todayDate
        : new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/monthly-budget-report-data`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          firstDay: firstDay.toISOString().slice(0, 10),
          lastDay: lastDay.toISOString().slice(0, 10),
          budgets: JSON.parse(budgets),
          user: data,
        }),
      }
    );

    res.json().then(({ spending }) => {
      setLoading(false);
      const pieChartContents = getPieChartContents(spending, currBudgets);
      setPieChartContents(pieChartContents);
      setBudgetName("all");
      setCurrSpending(spending);
      setBudgetPieChart(
        pieChartContents.find((budget) => budget.name === "all") || null
      );
      setBudgetTransactions(getAllBudgetTransactions(budgets, spending));
    });
  };

  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <div className="flex items-center justify-between">
        <h2>Budgets</h2>
        <input
          id="report-budget-input"
          type="month"
          value={date}
          max={todayDate.toISOString().slice(0, 7)}
          onChange={fetchMonthData}
          className="cursor-pointer"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-5">
          <ThreeCircles
            height="80"
            width="80"
            outerCircleColor="#F5CB5C"
            innerCircleColor="#5b827a"
            middleCircleColor="#c25451"
            ariaLabel="tail-spin-loading"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 items-center justify-center">
            <BudgetChartOverview
              pieChartContents={budgetPieChart}
              budget={budgetName}
            />

            <div className="flex items-center gap-2">
              {pieChartContents.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleChangeBudget(item)}
                  className={`budget-btn ${
                    budgetName === item.name ? "bg-secondary-light" : ""
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

          <ul className="flex flex-col gap-4 mt-2">
            {budgetTransactions.map((transaction, index) => (
              <BudgetTransaction key={index} transaction={transaction} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Budgets;
