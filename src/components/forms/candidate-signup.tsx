"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// UI & State Management
import Button from "../ui/button/button";
import Input from "../ui/input/input";
import Select from "../ui/select/select";
import { useCandidateStore } from "../stores/candidate-store";
import { useToast } from "../hooks/use-toast";
import { FormState } from "./signup"; // Assuming this type is defined centrally

// Icons & Services
import { IoCalendar, IoKey, IoMail, IoPerson, IoWoman, IoMan } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import { signupService } from "../../services/auth";

// A simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CandidateSignUpForm: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { organizations, getOrganizations } = useCandidateStore();
  
  const [loading, setLoading] = useState(false);
  const [isFetchingOrgs, setIsFetchingOrgs] = useState(true);

  const [formState, setFormState] = useState<FormState>({
    name: { value: "", error: "" },
    email: { value: "", error: "" },
    dob: { value: "", error: "" }, // Store DOB as string 'YYYY-MM-DD'
    gender: { value: "", error: "" },
    org: { value: "", error: "" },
    password: { value: "", error: "" },
    repassword: { value: "", error: "" },
  });

  // Fetch organizations on component mount
  useEffect(() => {
    const fetchOrgs = async () => {
      setIsFetchingOrgs(true);
      await getOrganizations();
      setIsFetchingOrgs(false);
    };
    fetchOrgs();
  }, [getOrganizations]);

  // Memoized value to determine if the form is valid for submission
  const isFormValid = useMemo(() => {
    return Object.values(formState).every(field => field.value && !field.error);
  }, [formState]);

  // Refactored real-time validation logic
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "name":
        if (value.trim().length < 3) error = "Name must be at least 3 characters.";
        break;
      case "email":
        if (!EMAIL_REGEX.test(value)) error = "Please enter a valid email address.";
        break;
      case "dob":
        if (!value) error = "Date of Birth is required.";
        else if (new Date(value) > new Date()) error = "Date of Birth cannot be in the future.";
        break;
      case "password":
        if (value.length < 8) error = "Password must be at least 8 characters.";
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

  // Handler for Select components
  const handleSelectChange = (name: keyof FormState, value: string) => {
    const error = !value ? `Please select a ${name}.` : "";
    setFormState(prev => ({ ...prev, [name]: { value, error } }));
  };

  // Form submission handler
  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);

    try {
      const orgId = organizations.find(org => org.organization_name === formState.org.value)?.organization_id;
      if (!orgId) {
        toast({ title: "Error", description: "Selected organization is not valid. Please refresh and try again.", variant: "error" });
        return;
      }
      
      const birthDate = new Date(formState.dob.value);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      // More accurate age calculation can be added if needed

      const response = await signupService.candidate(
        formState.name.value,
        formState.email.value,
        formState.password.value,
        orgId,
        age,
        formState.gender.value
      );

      if (response.ok) {
        toast({ title: "Signup Successful!", description: "You can now log in with your new account.", variant: "success" });
        router.push("/auth/candidate/login");
      } else {
        toast({ title: "Signup Failed", description: response.data?.message || "An error occurred.", variant: "error" });
      }
    } catch (err) {
      console.error("Signup exception:", err);
      toast({ title: "An Unexpected Error Occurred", description: err instanceof Error ? err.message : "Please try again.", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 },
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold sm:text-2xl">Create an Account</h2>
        <p className="text-sm mt-1">Join us by filling out the form below.</p>
      </div>

      <form onSubmit={handleSignup} className="w-full space-y-5 mt-8">
        <Input name="name" placeholder="Full Name" icon={<IoPerson />} onChange={handleFormChange} value={formState.name.value} error={formState.name.error} />
        <Input name="email" type="email" placeholder="Email Address" icon={<IoMail />} onChange={handleFormChange} value={formState.email.value} error={formState.email.error} />

        {/* Responsive Grid for DOB and Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input name="dob" type="date" placeholder="Date of Birth" icon={<IoCalendar />} onChange={handleFormChange} value={formState.dob.value} error={formState.dob.error} />
          <Select
            placeholder="Select Gender"
            items={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]}
            value={formState.gender.value}
            onValueChange={(value) => handleSelectChange("gender", value)}
            error={formState.gender.error}
          />
        </div>

        {/* Responsive Grid for Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input name="password" type="password" placeholder="Create Password" icon={<IoKey />} onChange={handleFormChange} value={formState.password.value} error={formState.password.error} />
            <Input name="repassword" type="password" placeholder="Confirm Password" icon={<IoKey />} onChange={handleFormChange} value={formState.repassword.value} error={formState.repassword.error} />
        </div>

        <Select
          placeholder={isFetchingOrgs ? "Loading Organizations…" : "Select Organization"}
          disabled={isFetchingOrgs}
          items={organizations.map(org => ({ label: org.organization_name, value: org.organization_name }))}
          value={formState.org.value}
          onValueChange={(value) => handleSelectChange("org", value)}
          error={formState.org.error}
        />

        <Button disabled={loading || !isFormValid} type="submit" className="w-full">
          {loading ? (
            <span className="flex gap-2 items-center justify-center"><CgSpinner className="animate-spin text-lg" /> Signing Up...</span>
          ) : "Create Account"}
        </Button>
      </form>

      <p className="text-sm text-center mt-8">
        Already have an account?{" "}
        <Link href="/auth/candidate/login" className="font-semibold hover:underline">
          Login
        </Link>
      </p>
    </>
  );
};

// You might want a reusable, animated Input wrapper like this to keep the form clean
const AnimatedInputWrapper = ({ name, placeholder, icon, type = "text", value, error, onChange }) => (
    <div className="space-y-1">
        <Input name={name} placeholder={placeholder} icon={icon} type={type} value={value} onChange={onChange} aria-invalid={!!error} />
        <AnimatePresence>
            {error && (
                <motion.p
                    className="text-xs text-red-500"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                >
                    {error}
                </motion.p>
            )}
        </AnimatePresence>
    </div>
);

// Note: I refactored the Input fields to be cleaner in the main component.
// If your <Input> component doesn't handle displaying its own error message,
// you can wrap each one in a component like `AnimatedInputWrapper` above.
// The provided code assumes your `Input` and `Select` components can take an `error` prop and display it.

export default CandidateSignUpForm;