import React, { useState } from "react";
// import { signIn } from 'next-auth/react';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validatePassword, setValidatePassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validation
    if (!email || !email.includes("@") || !password) {
      alert("Invalid details");
      return;
    }
    if (password != validatePassword) {
      alert("Passwords do not match");
      return;
    }

    //POST form values
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    //Await for data for any desirable next steps
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <h2>signup</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:{" "}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="johndoe@email.com"
          />
        </label>
        <label>
          Password:{" "}
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Re-type Password:{" "}
          <input
            required
            type="password"
            value={validatePassword}
            onChange={(e) => setValidatePassword(e.target.value)}
          />
        </label>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
