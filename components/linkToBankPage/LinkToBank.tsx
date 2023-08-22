"use client";

import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation";

import { usePlaidLink } from "react-plaid-link";

import { BsBank2 } from "react-icons/bs";

const LinkToBank = ({ session }: { session: any }) => {
  const [linkToken, setLinkToken] = useState(null);
  const userID: string = session.user.id;

  // Generates the first token that's required to create access token
  const generateToken = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/create-link-token`,
      {
        method: "POST",
        body: JSON.stringify(userID),
      }
    );
    const data = await response.json();
    setLinkToken(data.link_token);
  };

  // On page render, generate link token
  useEffect(() => {
    try {
      generateToken();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // on success of usePlaidLink, create the access token and create a record in the DB
  const onSuccess = React.useCallback(
    async (public_token: string, metadata: any) => {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/set-access-token`, {
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

  // usePlaidLink cofiguration
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
