import "./globals.css";

import { Oswald } from "next/font/google";
const oswald = Oswald({ subsets: ["latin"] });

import Navbar from "@/components/global/Navbar";
import RootAnimatedLayout from "@/components/animatedLayouts/RootLayoutAnimation";

export const metadata = {
  title: "moneyTrack",
  description: "Financial aid application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`noJS ${oswald.className}`}>
        <RootAnimatedLayout>
          <Navbar />
          {children}
        </RootAnimatedLayout>
      </body>
    </html>
  );
}
