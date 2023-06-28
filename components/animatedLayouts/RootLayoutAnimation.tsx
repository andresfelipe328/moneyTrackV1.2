"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const RootAnimatedLayout = ({ children }: { children: React.ReactNode }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(rootRef.current, {
        opacity: 1,
        duration: 0.25,
      });

      return () => ctx.revert();
    }, rootRef);
  }, []);

  return (
    <main
      className="root relative bg-main-bg flex flex-col h-screen overflow-y-auto"
      style={{ opacity: 0 }}
      ref={rootRef}
    >
      {children}
    </main>
  );
};

export default RootAnimatedLayout;
