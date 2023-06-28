import React from "react";
import Subscription from "./subscriptions/Subscription";

const Subscriptions = () => {
  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <h2>Subscriptions</h2>

      <ul className="flex flex-col gap-4">
        <Subscription />
        <Subscription />
      </ul>
    </div>
  );
};

export default Subscriptions;
