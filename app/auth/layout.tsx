"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/logo-white.png";

interface AuthLayoutProps {
  children?: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
      {/* Main container */}
      <div className="min-h-screen h-full w-full mt-14 flex flex-col items-center  justify-start px-10 lg:px-0">
        <img src={logo.src} className="w-40 mt-10" />
        <div className="w-full">{children}</div>
      </div>
    </>
  );
};

export default AuthLayout;
