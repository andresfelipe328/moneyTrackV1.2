import React from "react";

import BasicLayoutAnimation from "@/components/animatedLayouts/BasicLayoutAnimation";
import SignInGoogle from "@/components/auth/SignInGoogle";

const page = () => {
  return (
    <BasicLayoutAnimation
      Tag="div"
      style={
        "flex flex-col items-center justify-center gap-2 max-w-7xl mx-auto w-full h-full p-4"
      }
    >
      <h1>Signup/Login</h1>

      <SignInGoogle />
    </BasicLayoutAnimation>
  );
};

export default page;
