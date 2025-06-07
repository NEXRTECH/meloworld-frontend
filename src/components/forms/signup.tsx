"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import Button from "../ui/button/button";
import { IoKey, IoMail, IoPerson } from "react-icons/io5";
import Input from "../ui/input/input";
import { signupService } from "../../services/auth";
import { UserRole } from "../types";
import { useToast } from "../hooks/use-toast";
import { useRouter } from "next/navigation";
import { BsHourglass } from "react-icons/bs";

export type FormState = { [key: string]: { value: any; error: string } };

interface SignUpProps {
  userRole: UserRole;
}

const SignUpForm: React.FC<SignUpProps> = ({ userRole }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    password: {
      value: "",
      error: "",
    },
    repassword: {
      value: "",
      error: "",
    },
  });

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

      switch (userRole) {
        case "admin":
          response = await signupService.admin(
            formState.name.value,
            formState.email.value,
            formState.password.value
          );
          if (response.ok) {
            setLoading(false);
            toast({
              title: "Admin signup successful",
              description: "Redirecting to admin dashboard…",
              variant: "success",
              position: "top-right",
            });
            router.push("/auth/admin/login");
          }
          break;

        default:
          // you can handle unsupported roles here
          setLoading(false);
          toast({
            title: "Role not supported",
            variant: "error",
            position: "top-right",
          });
          return;
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
        className="w-full flex items-center lg:items-center flex-col gap-2"
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
        <Button disabled={loading} type="submit" className="w-fit mt-5">
          {!loading ? <p>Signup</p> : <span className="flex gap-2 items-center"><BsHourglass className="animate-bounce"/> Signing Up</span>}
        </Button>
      </form>
      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <a className="font-semibold hover:underline">Login</a>
      </p>
    </>
  );
};

export default SignUpForm;
