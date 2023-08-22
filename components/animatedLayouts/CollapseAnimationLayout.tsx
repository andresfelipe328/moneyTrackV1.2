"use client";

import React, { useEffect, useRef, useCallback } from "react";

import { gsap } from "gsap";

type Props = {
  children: React.ReactNode;
  show: boolean;
  setShow: Function;
  style: string;
};
const CollapseAnimationLayout = ({ children, show, setShow, style }: Props) => {
  // Variables
  const rootRef = useRef<HTMLDivElement>(null);

  // Animation
  useEffect(() => {
    if (show)
      gsap.to(rootRef.current, {
        duration: 0.25,
        y: 0,
        opacity: 1,
        pointerEvents: "all",
        ease: "power2.out",
      });
    else
      gsap.to(rootRef.current, {
        duration: 0.25,
        y: -5,
        opacity: 0,
        pointerEvents: "none",
        ease: "power2.out",
      });
  }, [show]);

  // Control display of modal according to click event (close)
  const toggleShow = useCallback(() => {
    setShow(!show);
    if (show) {
      rootRef.current!.blur();
    }
  }, [show, setShow]);

  // Controls display of modal accoring to click outside element
  useEffect(() => {
    const handleClick = (event: any) => {
      if (show) if (!rootRef.current!.contains(event.target)) toggleShow();
    };

    document.addEventListener("click", handleClick, true);

    return () => document.removeEventListener("click", handleClick, true);
  }, [rootRef, show, toggleShow]);
  // ==================================================================================================================

  return (
    <div className={style} ref={rootRef}>
      {children}
    </div>
  );
};

export default CollapseAnimationLayout;
