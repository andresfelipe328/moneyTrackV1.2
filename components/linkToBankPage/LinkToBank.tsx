"use client";

import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation";

import { usePlaidLink } from "react-plaid-link";

import { BsBank2 } from "react-icons/bs";

const LinkToBank = ({ session }: { session: any }) => {
  const [linkToken, setLinkToken] = useState(null);
  const userID: string = session.user.id;

  const generateToken = async () => {
    const response = await fetch("/api/create-link-token", {
      method: "POST",
      body: JSON.stringify(userID),
    });
    const data = await response.json();
    setLinkToken(data.link_token);
  };

  useEffect(() => {
    try {
      generateToken();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const onSuccess = React.useCallback(
    async (public_token: string, metadata: any) => {
      await fetch("/api/set-access-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_token, userID }),
      });

      redirect("/");
    },
    [userID]
  );

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);

  return (
    <button
      onClick={() => open()}
      className="bg-primary-light rounded-md shadow-small w-fit px-5 py-2 flex items-center gap-4 hover:shadow-medium transition-all duration-300 ease-in-out"
    >
      <small>Link to your Bank</small>
      <BsBank2 className="text-3xl text-primary-dark" />
    </button>
  );
};

export default LinkToBank;
