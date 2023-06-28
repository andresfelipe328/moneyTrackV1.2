import React from "react";

import { MdMoreHoriz } from "react-icons/md";

const Subscription = () => {
  return (
    <div className="flex items-center justify-between gap-1 bg-primary-dark/5 rounded-md p-2">
      <div className="flex flex-col gap-1">
        <h2>Netflix</h2>
        <small>since 06/27/2023</small>
      </div>

      <div className="flex items-center gap-2">
        <p>$15.99</p>
        <button className="group nav-link">
          <MdMoreHoriz className="icon" />
        </button>
      </div>
    </div>
  );
};

export default Subscription;
