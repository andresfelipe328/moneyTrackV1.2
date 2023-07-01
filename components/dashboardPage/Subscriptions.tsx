import React from "react";
import Subscription from "./subscriptions/Subscription";
import { Subscription as SubType } from "@/utils/types";

type Props = {
  subscriptions: SubType[];
};

const Subscriptions = ({ subscriptions }: Props) => {
  return (
    <div className="p-2 flex flex-col gap-2 rounded-md bg-primary-light/50 shadow-small">
      <h2>Subscriptions</h2>

      <ul className="flex flex-col gap-4">
        <div className="mx-auto w-10 h-10 rounded-3xl flex items-center justify-center border-2 border-primary-dark">
          <h3>{subscriptions.length}</h3>
        </div>
        {subscriptions.length > 0 ? (
          subscriptions.map((sub, index) => (
            <Subscription subscription={sub} key={index} />
          ))
        ) : (
          <small className="mx-auto mt-2">You have no subscriptions</small>
        )}
      </ul>
    </div>
  );
};

export default Subscriptions;
