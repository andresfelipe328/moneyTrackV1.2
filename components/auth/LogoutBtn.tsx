"use client";

import React from "react";
import { signOut } from "next-auth/react";

import { BiLogOut } from "react-icons/bi";

const LogoutBtn = () => {
  // Logout user
  const handleLogout = async () => {
    signOut();
  };

  return (
    <button
      onClick={handleLogout}
      className="mr-4 flex items-center p-2 gap-1 bg-primary-light rounded-md shadow-small hover:shadow-medium transition-all duration-300 ease-in-out"
    >
      <p>Logout</p>
      <BiLogOut className="icon" />
    </button>
  );
};

export default LogoutBtn;
