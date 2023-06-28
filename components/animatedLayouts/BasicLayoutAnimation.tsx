"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

type Props = {
  Tag: any;
  style: string;
  children: React.ReactNode;
};

const BasicLayoutAnimation = ({ Tag, style, children }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current!.childNodes,
        { y: -10, opacity: 0 },
        {
          duration: 0.25,
          y: 0,
          opacity: 1,
          stagger: 0.2,
          delay: 0.25,
          ease: "power1.out",
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <Tag className={style} ref={rootRef}>
      {children}
    </Tag>
  );
};

export default BasicLayoutAnimation;
