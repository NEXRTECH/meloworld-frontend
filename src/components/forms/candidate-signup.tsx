"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Button from "../ui/button/button";
import { IoCalendar, IoKey, IoMail, IoPerson } from "react-icons/io5";
import Input from "../ui/input/input";
import { signupService } from "../../services/auth";
import { UserRole } from "../types";
import { useToast } from "../hooks/use-toast";
import { useRouter } from "next/navigation";
import { BsHourglass } from "react-icons/bs";
import { FormState } from "./signup";
import Select from "../ui/select/select";
import { SelectedNeutral } from "../ui/input/likert-scale-input.stories";
import { useCandidateStore } from "../stores/candidate-store";

interface SignUpProps {}

const CandidateSignUpForm: React.FC<SignUpProps> = ({}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const organizations = useCandidateStore((s) => s.organizations);
  const { getOrganizations } = useCandidateStore();
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState>({
    name: {
      value: "",
      error: "",
    },
    email: {
      value: "",
      error: "",
    },
    dob: {
      value: 0,
      error: "",
    },
    gender: {
      value: "",
      error: "",
    },
    org: {
      value: "",
      error: "",
    },
    password: {
      value: "",
      error: "",
    },
    repassword: {
      value: "",
      error: "",
    },
  });

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    console.log(formState)
  }, [formState])

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const key = e.target.name;
    const value = e.target.value;

    // add constraints
    switch (key) {
      case "name":
        if (value.length < 2) {
          setFormState((prevState) => ({
            ...prevState,
            [key]: { value: value, error: "Minimum 3 characters Required" },
          }));
        } else {
          setFormState((prevState) => ({
            ...prevState,
            [key]: { value: value, error: "" },
          }));
        }
        break;

      case "email":
        if (value.length < 2) {
          setFormState((prevState) => ({
            ...prevState,
            [key]: { value: value, error: "Minimum 3 characters Required" },
          }));
        } else {
          setFormState((prevState) => ({
            ...prevState,
            [key]: { value: value, error: "" },
          }));
        }
        break;

      case "password":
        if (value.length < 8) {
          setFormState((prevState) => ({
            ...prevState,
            [key]: { value: value, error: "Minimum 8 characters Required" },
          }));
        } else {
          setFormState((prevState) => ({
            ...prevState,
            [key]: { value: value, error: "" },
          }));
        }
        break;

      case "repassword":
        if (value != formState["password"].value) {
          setFormState((prevState) => ({
            ...prevState,
            [key]: { value: value, error: "Please ensure passwords match" },
          }));
        } else {
          setFormState((prevState) => ({
            ...prevState,
            [key]: { value: value, error: "" },
          }));
        }
        break;

      case "dob":
        if (!value) {
          setFormState((prevState) => ({
            ...prevState,
            dob: { value, error: "Date of Birth is required" },
          }));
        } else {
          setFormState((prevState) => ({
            ...prevState,
            dob: { value, error: "" },
          }));
        }
        break;
      
      default:
        break;
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    let errorFlag = false;
    Object.values(formState).forEach((value) => {
      if (value.error.length > 0) {
        errorFlag = true;
      }
    });

    if (errorFlag) return;

    try {
      let response = null as {
        status: number;
        ok: boolean;
        data: any;
        headers: Headers;
      } | null;

      const orgId = organizations.find(org => org.organization_name === formState['org'].value)?.organization_id;
      const birthDate = new Date(formState["dob"].value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if(!orgId) return;


      response = await signupService.candidate(
        formState.name.value,
        formState.email.value,
        formState.password.value,
        orgId,
        age,
        formState.gender.value
      );
      if (response.ok) {
        setLoading(false);
        toast({
          title: "Signup successful",
          description: "Redirecting to candidate portal…",
          variant: "success",
          position: "top-right",
        });
        router.push("/auth/candidate/login");
      }
    } catch (err) {
      setLoading(false);
      toast({
        title: "Signup failed",
        description: (err as any).message,
        variant: "error",
        position: "top-right",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSignup}
        className="w-full flex items-center h-full overflow-auto lg:items-center flex-col gap-2"
      >
        <div className="flex gap-1 flex-col w-full justify-start items-center mb-5">
          <label className="text-sm">Please enter your name</label>
          <Input
            name="name"
            onChange={handleFormChange}
            value={formState["name"].value}
            placeholder="Name"
            icon={<IoPerson />}
          />
          {formState["name"].error.length > 0 && (
            <p className="text-xs text-red-400">{formState["name"].error}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full justify-start items-center mb-5">
          <label className="text-sm">Please enter your Email ID</label>
          <Input
            name="email"
            onChange={handleFormChange}
            value={formState["email"].value}
            placeholder="Email"
            icon={<IoMail />}
          />
          {formState["email"].error.length > 0 && (
            <p className="text-xs text-red-400">{formState["email"].error}</p>
          )}
        </div>
        <div className="flex gap-4 items-center flex-wrap lg:flex-nowrap">
          <div className="flex flex-col gap-1 w-full justify-start items-center mb-5">
            <label className="text-sm">Date of Birth</label>
            <Input
              name="dob"
              onChange={handleFormChange}
              type="date"
              value={formState["dob"].value}
              placeholder="Age"
              icon={<IoCalendar />}
            />
            {formState["dob"].error.length > 0 && (
              <p className="text-xs text-red-400">{formState["dob"].error}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full justify-start items-center mb-5">
            <label className="text-sm">Enter Gender</label>
            <Select
              items={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              placeholder="Select Gender"
              value={formState['gender'].value}
              onValueChange={(value) => {
                setFormState((prevState) => ({
                  ...prevState,
                  gender: {
                    value: value.toLowerCase(),
                    error: value ? "" : "Gender is required",
                  },
                }));
              }}
            />
            {formState["password"].error.length > 0 && (
              <p className="text-xs text-red-400">
                {formState["password"].error}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full justify-start items-center mb-5">
          <label className="text-sm">Type a password</label>
          <Input
            name="password"
            onChange={handleFormChange}
            type="password"
            value={formState["password"].value}
            placeholder="Password"
            icon={<IoKey />}
          />
          {formState["password"].error.length > 0 && (
            <p className="text-xs text-red-400">
              {formState["password"].error}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full justify-start items-center mb-5">
          <label className="text-sm">Re-enter password</label>
          <Input
            name="repassword"
            onChange={handleFormChange}
            type="password"
            value={formState["repassword"].value}
            placeholder="Re-enter Password"
            icon={<IoKey />}
          />
          {formState["repassword"].error.length > 0 && (
            <p className="text-xs text-red-400">
              {formState["repassword"].error}
            </p>
          )}
        </div>
        <div className="flex flex-col ga// setFilter(value);p-3 w-full justify-center items-center mb-5">
          <label className="text-sm">Please select your organization</label>
          <Select
            items={organizations.map((org) => ({
              label: org.organization_name,
              value: org.organization_name,
            }))}
            placeholder="Select Organization"
            value={formState['org'].value}
            onValueChange={(value) => {
              const selectedOrg = organizations.find(
                (org) => org.organization_name === value
              );
              setFormState((prevState) => ({
                ...prevState,
                org: {
                  value: selectedOrg ? selectedOrg.organization_name : "",
                  error: selectedOrg ? "" : "Please select an organization",
                },
              }));
            }}
          />
          {formState["email"].error.length > 0 && (
            <p className="text-xs text-red-400">{formState["email"].error}</p>
          )}
        </div>
        <Button disabled={loading} type="submit" className="w-fit mt-5">
          {!loading ? (
            <p>Signup</p>
          ) : (
            <span className="flex gap-2 items-center">
              <BsHourglass className="animate-bounce" /> Signing Up
            </span>
          )}
        </Button>
      </form>
      <p className="text-sm mt-4 mb-10 text-center">
        Already have an account?{" "}
        <a className="font-semibold hover:underline">Login</a>
      </p>
    </>
  );
};

export default CandidateSignUpForm;
