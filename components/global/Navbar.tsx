import Image from "next/image";
import React from "react";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { FaChartPie } from "react-icons/fa";
import { RiSettings3Fill } from "react-icons/ri";
import { MdDashboard, MdCalendarMonth } from "react-icons/md";

import BasicLayoutAnimation from "../animatedLayouts/BasicLayoutAnimation";
import LogoutBtn from "../auth/LogoutBtn";

const NAVLINKS = [
  {
    icon: MdDashboard,
    href: "/",
  },
  {
    icon: MdCalendarMonth,
    href: "/bills-transactions",
  },
  {
    icon: FaChartPie,
    href: "/reports",
  },
  {
    icon: RiSettings3Fill,
    href: "/settings",
  },
];

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <BasicLayoutAnimation
      Tag="header"
      style={
        "sticky top-0 flex items-center justify-between p-4 backdrop-blur-[2px] shadow-sm z-10"
      }
    >
      <div className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          width={65}
          height={65}
          alt="application logo"
          className="drop-shadow-md"
        />
        <h1>moneyTrack</h1>
      </div>

      <ul className="flex items-center">
        {session && <LogoutBtn />}
        {NAVLINKS.map((link, index) => (
          <Link key={index} href={link.href} className="group nav-link">
            <link.icon className="icon" />
          </Link>
        ))}
      </ul>
    </BasicLayoutAnimation>
  );
};

export default Navbar;
