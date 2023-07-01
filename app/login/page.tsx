import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";
import SignInGoogle from "@/components/auth/SignInGoogle";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <BasicLayoutAnimation
      Tag="div"
      style={
        "flex flex-col items-center justify-center gap-2 max-w-7xl mx-auto w-full h-full p-4"
      }
    >
      <h1>Signup/Login</h1>

      <div>
        <SignInGoogle />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p>
          {`Hello, this is a work in progress application. Currently, it is only possible to
          connect to plaid's dummy account. Please follow these
          steps:`}
        </p>
        <small className="mt-5">
          {`1. After login, click the "link to your bank" button and select any bank`}{" "}
        </small>
        <small>
          2.After selecting a bank, type user_good for username and password
        </small>
        <small>3.select mobile verification and type 1234</small>
        <small>{`4.Now you can see plaid's dummy account`} </small>

        <p className="text-red-600 mt-5">
          {`Note: Plaid dummy's account is not accurate, doesn't provide much information, and has a lot of repeated data. Please, do not pay too much attention in the data`}{" "}
        </p>
      </div>
    </BasicLayoutAnimation>
  );
};

export default page;
