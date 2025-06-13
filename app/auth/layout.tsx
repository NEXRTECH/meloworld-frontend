"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/assets/logo-transparent.png";

interface AuthLayoutProps {
  children?: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  // Animation variants remain the same as they are not device-dependent
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
      },
    },
  };

  return (
    // Main container with responsive top padding
    <div className="min-h-full w-full flex flex-col items-center justify-start pt-12 sm:pt-20 px-4 bg-dotted-pattern">
      
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
      >
        {/* Animated Logo */}
        <motion.div className="flex justify-center mt-20" variants={logoVariants}>
          <Image
            src={logo}
            alt="MeloWorld Logo"
            // Responsive logo size: smaller on mobile, larger on desktop
            className="w-20 h-20 sm:w-24 sm:h-24"
            priority
          />
        </motion.div>

        {/* Animated Floating Card for the form */}
        <motion.div
          className="
            bg-white
            border
            border-black/10
            rounded-xl 
            shadow-lg sm:shadow-xl      // Responsive shadow: slightly less intense on mobile
            p-6 sm:p-8                  // Responsive padding: less on mobile, more on desktop
            mb-20               // Responsive margin: less space on mobile
          "
          variants={cardVariants}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;