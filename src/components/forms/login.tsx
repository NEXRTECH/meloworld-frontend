"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// UI & State Management
import Button from "../ui/button/button";
import Input from "../ui/input/input";
import { useAuthStore } from "../stores/auth-store";
import { useToast } from "../hooks/use-toast";
import { UserRole } from "../types"; // Assuming types are centralized

// Services & Icons
import { loginService } from "../../services/auth";
import { IoKey, IoMail } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import { AnimatePresence, motion } from "framer-motion";
import { FormState } from "./signup";

interface LoginProps {
  userRole: UserRole;
}

// A simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm: React.FC<LoginProps> = ({ userRole }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, token, hydrated } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    email: { value: "", error: "" },
    password: { value: "", error: "" },
  });

  // Memoized value to determine if the form is valid for submission
  const isFormValid = useMemo(() => {
    return (
      !formState.email.error &&
      !formState.password.error &&
      formState.email.value !== "" &&
      formState.password.value !== ""
    );
  }, [formState]);

  // Effect to redirect users who are already logged in
  useEffect(() => {
    if (token && hydrated) {
      const paths: Record<UserRole, string> = {
        admin: "/admin/dashboard",
        candidate: "/candidate",
        therapist: "/therapist/dashboard",
        org: "/org/dashboard"
      };
      router.replace(paths[userRole] || "/");
    }
  }, [token, userRole, router, hydrated]);

  // Refactored validation logic for real-time feedback
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "email":
        if (!EMAIL_REGEX.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "password":
        if (value.length < 8) {
          error = "Password must be at least 8 characters long.";
        }
        break;
    }

    setFormState((prev) => ({ ...prev, [name]: { value, error } }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return; // Guard clause

    setLoading(true);

    try {
      const credentials = {
        email: formState.email.value,
        password: formState.password.value,
      };

      const response = await loginService[userRole](credentials.email, credentials.password);

      if (response.ok) {
        const { token, name, email } = response.data; // Assuming a consistent success response structure
        toast({
          title: "Login Successful!",
          description: `Redirecting to ${userRole} dashboard…`,
          variant: "success",
        });
        setAuth(token, userRole, { name, email });
        // The useEffect will handle the redirection
      } else {
        // Standardized error handling for all roles
        const errorData = response.data;
        const description = errorData?.message || "Invalid credentials or server error.";
        toast({
          title: "Login Failed",
          description: description,
          variant: "error",
        });
      }
    } catch (err) {
      console.error("Login exception:", err);
      toast({
        title: "An Unexpected Error Occurred",
        description: err instanceof Error ? err.message : "Please try again later.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Variants for animating the error messages
  const errorVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 },
  };


  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold sm:text-2xl">
          Welcome Back!
        </h2>
        <p className="text-sm mt-1">
          Login to your account.
        </p>
      </div>

      <form onSubmit={handleLogin} className="w-full space-y-6 mt-8">
        {/* Email Input */}
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            onChange={handleFormChange}
            value={formState.email.value}
            placeholder="Email Address"
            icon={<IoMail />}
            aria-invalid={!!formState.email.error}
          />
          <AnimatePresence>
            {formState.email.error && (
              <motion.p
                className="text-xs text-red-500"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {formState.email.error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            onChange={handleFormChange}
            value={formState.password.value}
            placeholder="Password"
            icon={<IoKey />}
            aria-invalid={!!formState.password.error}
          />
          <AnimatePresence>
            {formState.password.error && (
              <motion.p
                className="text-xs text-red-500"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {formState.password.error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <Button
          disabled={loading || !isFormValid}
          type="submit"
          className="w-full" // Changed to full-width for a more modern, mobile-friendly look
        >
          {loading ? (
            <span className="flex gap-2 items-center justify-center">
              <CgSpinner className="animate-spin text-lg" />
              Logging In...
            </span>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      {/* Sign up Link */}
      <p className="text-sm text-center text-gray-600 mt-8">
        Don't have an account?{" "}
        <Link
          href={`/auth/${userRole}/signup`}
          className="font-semibold hover:underline transition-colors"
        >
          Sign up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;