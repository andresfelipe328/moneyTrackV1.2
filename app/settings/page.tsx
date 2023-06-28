import React from "react";

import { HiUser } from "react-icons/hi";
import { BsBank2 } from "react-icons/bs";

import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";

const SETTINGS = [
  {
    icon: HiUser,
    text: "user",
    href: "/#",
  },
  {
    icon: BsBank2,
    text: "bank connections",
    href: "/#",
  },
];

const page = () => {
  return (
    <BasicLayoutAnimation
      Tag="div"
      style={"flex h-full flex-col gap-2 max-w-7xl mx-auto w-full p-4"}
    >
      <h1>Settings</h1>
      <ul className="flex flex-col flex-1 items-center justify-center gap-5">
        {SETTINGS.map((setting, index) => (
          <button
            key={index}
            className="flex items-center justify-center gap-2 bg-primary-light py-2 px-6 rounded-md shadow-small"
          >
            <setting.icon className="icon" />
            <p>{setting.text}</p>
          </button>
        ))}
      </ul>
    </BasicLayoutAnimation>
  );
};

export default page;
