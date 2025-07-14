"use client";

import React, { ChangeEvent, FormEvent, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// UI & State Management
import Button from "../ui/button/button";
import Input from "../ui/input/input";
import Select from "../ui/select/select";
import { useToast } from "../hooks/use-toast";

// Icons & Services
import { IoKey, IoMail, IoBusiness } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import { signupService } from "@/services/auth";

// A simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  orgName: { value: string; error: string };
  orgType: { value: string; error: string };
  contactEmail: { value: string; error: string };
  password: { value: string; error: string };
  repassword: { value: string; error: string };
}

const OrganizationSignUpForm: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    orgName: { value: "", error: "" },
    orgType: { value: "", error: "" },
    contactEmail: { value: "", error: "" },
    password: { value: "", error: "" },
    repassword: { value: "", error: "" },
  });

  // Memoized value to determine if the form is valid for submission
  const isFormValid = useMemo(() => {
    return Object.values(formState).every(field => field.value && !field.error);
  }, [formState]);

  // Refactored real-time validation logic
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "orgName":
        if (value.trim().length < 2) error = "Organization name must be at least 2 characters.";
        break;
      case "contactEmail":
        if (!EMAIL_REGEX.test(value)) error = "Please enter a valid email address.";
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
      const formData = {
        orgName: formState.orgName.value,
        orgType: formState.orgType.value,
        contactEmail: formState.contactEmail.value,
        password: formState.password.value,
      };

      const response = await signupService.org(formData.orgName, formData.contactEmail, formData.password, formData.orgType);

      if (response.ok) {
        toast({ title: "Signup Successful!", description: "You can now log in with your new account.", variant: "success" });
        router.push("/auth/org/login");
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

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold sm:text-2xl">Create Organization Account</h2>
        <p className="text-sm mt-1">Register your organization by filling out the form below.</p>
      </div>

      <form onSubmit={handleSignup} className="flex flex-col w-full space-y-5 mt-8">
        <Input 
          name="orgName" 
          placeholder="Organization Name" 
          icon={<IoBusiness />} 
          onChange={handleFormChange} 
          value={formState.orgName.value} 
        />

        <Select
          placeholder="Select Organization Type"
          items={[
            { label: "Healthcare", value: "Healthcare" },
            { label: "Education", value: "Education" },
            { label: "Corporate", value: "Corporate" },
            { label: "Non-profit", value: "Non-profit" },
            { label: "Government", value: "Government" },
            { label: "Other", value: "other" }
          ]}
          value={formState.orgType.value}
          onValueChange={(value) => handleSelectChange("orgType", value)}
        />

        <Input 
          name="contactEmail" 
          type="email" 
          placeholder="Contact Email Address" 
          icon={<IoMail />} 
          onChange={handleFormChange} 
          value={formState.contactEmail.value} 
        />

        {/* Responsive Grid for Passwords */}
        <div className="grid grid-cols-1 gap-5">
            <Input 
              name="password" 
              type="password" 
              placeholder="Create Password" 
              icon={<IoKey />} 
              onChange={handleFormChange} 
              value={formState.password.value} 
            />
            <Input 
              name="repassword" 
              type="password" 
              placeholder="Confirm Password" 
              icon={<IoKey />} 
              onChange={handleFormChange} 
              value={formState.repassword.value}
            />
        </div>

        <Button disabled={loading || !isFormValid} type="submit" className="w-full">
          {loading ? (
            <span className="flex gap-2 items-center justify-center">
              <CgSpinner className="animate-spin text-lg" /> Signing Up...
            </span>
          ) : "Create Organization Account"}
        </Button>
      </form>

      <p className="text-sm text-center mt-8">
        Already have an account?{" "}
        <Link href="/auth/org/login" className="font-semibold hover:underline">
          Login
        </Link>
      </p>
    </>
  );
};

export default OrganizationSignUpForm; 