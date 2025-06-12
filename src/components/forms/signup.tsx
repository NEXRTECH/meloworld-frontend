"use client";

import React, { ChangeEvent, FormEvent, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// UI & State Management
import Button from "../ui/button/button";
import Input from "../ui/input/input";
import { useToast } from "../hooks/use-toast";
import { UserRole } from "../types";

// Icons & Services
import { signupService } from "../../services/auth";
import { IoKey, IoMail, IoPerson } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";

export type FormState = { [key: string]: { value: string; error: string } };

interface SignUpProps {
  userRole: UserRole;
}

// A simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUpForm: React.FC<SignUpProps> = ({ userRole }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    name: { value: "", error: "" },
    email: { value: "", error: "" },
    password: { value: "", error: "" },
    repassword: { value: "", error: "" },
  });

  // Memoized value to determine if the form is valid for submission
  const isFormValid = useMemo(() => {
    return Object.values(formState).every(field => field.value && !field.error);
  }, [formState]);

  // Refactored validation logic for real-time feedback
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "name":
        if (value.trim().length < 3) error = "Full name must be at least 3 characters.";
        break;
      case "email":
        if (!EMAIL_REGEX.test(value)) error = "Please enter a valid email address.";
        break;
      case "password":
        if (value.length < 8) error = "Password must be at least 8 characters long.";
        // Also re-validate the repassword field if password changes
        if (formState.repassword.value && value !== formState.repassword.value) {
            setFormState(prev => ({ ...prev, repassword: { ...prev.repassword, error: "Passwords do not match." } }));
        } else if (formState.repassword.value && value === formState.repassword.value) {
             setFormState(prev => ({ ...prev, repassword: { ...prev.repassword, error: "" } }));
        }
        break;
      case "repassword":
        if (value !== formState.password.value) error = "Passwords do not match.";
        break;
    }
    setFormState(prev => ({ ...prev, [name]: { value, error } }));
  };

  // Form submission handler
  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return; // Guard clause
    
    setLoading(true);

    try {
      let response;
      switch (userRole) {
        case "admin":
          response = await signupService.admin(
            formState.name.value,
            formState.email.value,
            formState.password.value
          );
          break;
        // Add other roles like 'therapist' here in the future
        // case "therapist":
        //   response = await signupService.therapist(...);
        //   break;
        default:
          toast({ title: "Error", description: `Signup for role '${userRole}' is not supported.`, variant: "error" });
          return; // Exit if role is not handled
      }
      
      if (response.ok) {
        toast({ title: "Signup Successful!", description: "You can now log in with your new account.", variant: "success" });
        router.push(`/auth/${userRole}/login`);
      } else {
        // Handle failed API calls (e.g., email already exists)
        toast({ title: "Signup Failed", description: response.data?.message || "An error occurred. Please try again.", variant: "error" });
      }
    } catch (err) {
      console.error("Signup exception:", err);
      toast({ title: "An Unexpected Error Occurred", description: err instanceof Error ? err.message : "Please check your connection and try again.", variant: "error" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold sm:text-2xl">
          Create {userRole === 'admin' ? 'an Admin' : 'a'} Account
        </h2>
        <p className="text-sm  mt-1">
          Get started by filling out the form below.
        </p>
      </div>

      <form onSubmit={handleSignup} className="w-full space-y-5 mt-8">
        <Input name="name" placeholder="Full Name" icon={<IoPerson />} onChange={handleFormChange} value={formState.name.value} error={formState.name.error} />
        <Input name="email" type="email" placeholder="Email Address" icon={<IoMail />} onChange={handleFormChange} value={formState.email.value} error={formState.email.error} />

        {/* Responsive Grid for Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input name="password" type="password" placeholder="Create Password" icon={<IoKey />} onChange={handleFormChange} value={formState.password.value} error={formState.password.error} />
            <Input name="repassword" type="password" placeholder="Confirm Password" icon={<IoKey />} onChange={handleFormChange} value={formState.repassword.value} error={formState.repassword.error} />
        </div>
        
        <Button disabled={loading || !isFormValid} type="submit" className="w-full">
          {loading ? (
            <span className="flex gap-2 items-center justify-center">
              <CgSpinner className="animate-spin text-lg" /> Signing Up...
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="text-sm text-center mt-8">
        Already have an account?{" "}
        <Link
          href={`/auth/${userRole}/login`}
          className="font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </>
  );
};

// Note: This implementation assumes your custom <Input /> component can receive
// and display an 'error' prop. If not, you can use the animated wrapper
// component pattern from the previous examples to display the error messages.

export default SignUpForm;