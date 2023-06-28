"use client";

import React from "react";

import { FcGoogle } from "react-icons/fc";

import { signIn } from "next-auth/react";

const SignInGoogle = () => {
  const handleLogin = () => {
    signIn("google", {
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-primary-light rounded-md shadow-small w-fit px-5 py-2 flex items-center gap-4 hover:shadow-medium transition-all duration-300 ease-in-out"
    >
      <small>Login with Google</small>
      <FcGoogle className="text-3xl" />
    </button>
  );
};

export default SignInGoogle;
