import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import classes from "./auth-form.module.css";
import toast from "react-hot-toast";
import { useCartDispatch } from "../../context/cart";
import type { NextApiResponse } from "next";
type Data = {
  customer_id: string;
};

async function createUser(email, password, customer_id) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, customer_id }), //,jwt
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }
  return data;
}

function AuthForm() {
  //form data
  const emailInputRef = useRef<HTMLInputElement>();
  const passwordInputRef = useRef<HTMLInputElement>();
  const phoneInputRef = useRef<HTMLInputElement>();
  const firstNameInputRef = useRef<HTMLInputElement>();
  const lastNameInputRef = useRef<HTMLInputElement>();

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(e) {
    e.preventDefault();
    const enteredEmail: string = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (isLogin) {
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
    } else {
      try {
        const customerDetails = {
          email: enteredEmail,
          phone: phoneInputRef.current.value,
          firstname: firstNameInputRef.current.value,
          lastname: lastNameInputRef.current.value,
        };
        const customerId = await fetch("/api/commercejs/createcustomer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerDetails),
        });
        const customerJSON = await customerId.json();

        const result = await createUser(enteredEmail, enteredPassword, customerJSON.customer_id);
        toast.success(result.message);
        router.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input required type="email" id="email" ref={emailInputRef} />
        </div>

        {!isLogin && (
          <>
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
          </>
        )}

        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input required type="password" id="password" ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button type="button" onClick={switchAuthModeHandler}>
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
