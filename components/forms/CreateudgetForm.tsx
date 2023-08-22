"use client";

import React, { useState, useEffect } from "react";

import categories from "../../utils/categories.json";

import { AiFillFolderAdd } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreateudgetForm = () => {
  const { data: session } = useSession();
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [mCategory, setMcategory] = useState<string>("");
  const [sCategory, setScategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  useEffect(() => {
    setErr("");
  }, [amount]);

  const handleCreateBudget = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/create-budget", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        session: session,
        budget_name: name,
        budget_amount: amount,
        mCateg: mCategory,
        sCateg: sCategory,
      }),
    });

    const { message, code } = await res.json();

    if (code === 200) router.push("/");
  };

  const displaySubCategories = () => {
    const list = categories.categoryGroups.filter((group) => {
      return group.hierarchy[0] === mCategory;
    });

    return list
      .filter(
        (group, index, arr) =>
          arr.findIndex(
            (categ) => categ.hierarchy[1] === group.hierarchy[1]
          ) === index
      )
      .map(
        (categ, i) =>
          categ.hierarchy[1] && (
            <button
              key={i}
              onClick={() => setScategory(categ.hierarchy[1])}
              className="group rounded-md py-1 px-2 bg-primary-light hover:shadow-medium transition-all duration-200 ease-in-out"
            >
              <small className="group-hover:text-primary-dark">
                {categ.hierarchy[1]}
              </small>
            </button>
          )
      );
  };

  const handleAmount = (e: any) => {
    const budgetAmount = e.target.value;
    if (!isNaN(budgetAmount)) setAmount(budgetAmount);
    else setErr("amount value not valid");
  };

  return (
    <form
      onSubmit={handleCreateBudget}
      autoComplete="off"
      className="flex flex-col p-2 gap-4 w-full items-center"
    >
      <input
        id="new-budget-name"
        type="text"
        value={name}
        placeholder="budget name"
        className="w-[15rem] px-4 py-2 bg-primary-dark text-primary-light placeholder:text-primary-light/80 font-normal tracking-wide"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        name="new-budget-amount"
        type="text"
        value={amount}
        placeholder="budget amount"
        className="w-[15rem] px-4 py-2 bg-primary-dark text-primary-light placeholder:text-primary-light/80 font-normal tracking-wide"
        onChange={handleAmount}
      />

      <h2 className="text-secondary-light">Main Category:</h2>
      <div
        className={`rounded-md w-fit ${
          mCategory
            ? "flex justify-center"
            : "grid gap-4 grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {mCategory ? (
          <div className="w-fit flex items-center gap-1 p-2 bg-primary-light rounded-md hover:shadow-medium transition-all duration-200 ease-in-out">
            <small>{mCategory}</small>
            <button onClick={() => setMcategory("")} className="p-1 rounded-md">
              <FaTimes className="text-red-600" />
            </button>
          </div>
        ) : (
          categories.main.map((categ, i) => (
            <button
              key={i}
              onClick={() => setMcategory(categ.name)}
              className="group rounded-md py-1 hover:shadow-medium px-2 bg-primary-light transition-all duration-200 ease-in-out"
            >
              <small className="group-hover:text-primary-dark" id={categ.name}>
                {categ.name}
              </small>
            </button>
          ))
        )}
      </div>

      {mCategory && (
        <>
          <h3 className="text-secondary-light">Sub Category (optional):</h3>
          <div
            className={`rounded-md w-full ${
              sCategory
                ? "flex justify-center"
                : "grid gap-4 grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {sCategory ? (
              <div className="w-fit flex items-center gap-1 p-2 bg-primary-light rounded-md hover:shadow-medium transition-all duration-200 ease-in-out">
                <small>{sCategory}</small>
                <button
                  onClick={() => setScategory("")}
                  className="p-1 rounded-md"
                >
                  <FaTimes className="text-red-600" />
                </button>
              </div>
            ) : (
              displaySubCategories()
            )}
          </div>
        </>
      )}

      {err ? (
        <div className="w-full flex items-center justify-center mt-3 p-2 bg-red-600 rounded-md">
          <p className="text-primary-light">{err}</p>
        </div>
      ) : (
        <button
          className="group btn py-2 px-4 flex items-center gap-10 rounded-md disabled:opacity-50 bg-secondary-light hover:bg-extra-light w-fit mx-auto"
          disabled={!(name && amount && mCategory) ? true : false}
        >
          <p className="text-primary-light">Create</p>
          <AiFillFolderAdd className="text-lg text-primary-light" />
        </button>
      )}
    </form>
  );
};

export default CreateudgetForm;
