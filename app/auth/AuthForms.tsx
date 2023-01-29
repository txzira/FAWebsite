"use client";
import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import classes from "./auth-form.module.css";
import toast from "react-hot-toast";
import Link from "next/link";

export function SignupForm() {
  const router = useRouter();
  //form data
  const emailInputRef = useRef<HTMLInputElement>();
  const passwordInputRef = useRef<HTMLInputElement>();
  const phoneInputRef = useRef<HTMLInputElement>();
  const firstNameInputRef = useRef<HTMLInputElement>();
  const lastNameInputRef = useRef<HTMLInputElement>();

  async function signup(e) {
    e.preventDefault();
    const enteredEmail: string = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    try {
      const customerDetails = {
        email: enteredEmail,
        phone: phoneInputRef.current.value,
        firstname: firstNameInputRef.current.value,
        lastname: lastNameInputRef.current.value,
        password: enteredPassword,
      };
      const response = await fetch("/api/commercejs/createcustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerDetails),
      });
      const customer = await response.json();
      toast.success(customer.message);
      router.replace("/auth");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={classes.auth}>
      <h1>Sign Up</h1>
      <form onSubmit={signup}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input required type="email" id="email" ref={emailInputRef} />
        </div>

        <div className={classes.control}>
          <label htmlFor="firstName">First Name:</label>
          <input required id="firstName" type="text" ref={firstNameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="lastName">Last Name:</label>
          <input required id="lastName" type="text" ref={lastNameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="phone">Phone Number:</label>
          <input id="phone" type="tel" ref={phoneInputRef} placeholder="(optional)" />
        </div>

        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input required type="password" id="password" ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          <button>Create Account</button>
          <span>
            Already have an account?
            <Link href="/auth/login">Login</Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  //form data
  const emailInputRef = useRef<HTMLInputElement>();
  const passwordInputRef = useRef<HTMLInputElement>();

  async function login(e) {
    e.preventDefault();
    const enteredEmail: string = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const result = await signIn("credentials", {
      redirect: false,
      email: enteredEmail,
      password: enteredPassword,
    });

    if (!result.error) {
      //set some auth state
      // router.replace('/profile');
      router.replace("/");
    }
  }

  return (
    <div className={classes.auth}>
      <h1>Login</h1>
      <form onSubmit={login}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input required type="email" id="email" ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input required type="password" id="password" ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          <button>Login</button>
          <span>
            Don't have an account?
            <Link href="/auth/signup">Create new account</Link>
          </span>
        </div>
      </form>
    </div>
  );
}
