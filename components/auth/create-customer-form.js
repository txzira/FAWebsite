import React, { useRef } from "react";

const CustomerForm = () => {
  const emailInputRef = useRef();
  const phoneInputRef = useRef();
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    const customerDetails = {
      email: emailInputRef.current.value,
      phone: phoneInputRef.current.value,
      firstname: firstNameInputRef.current.value,
      lastname: lastNameInputRef.current.value,
    };
    await fetch("/api/commercejs/createcustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerDetails),
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input required id="email" type="email" ref={emailInputRef} />
        </div>
        <div>
          <label htmlFor="phone">Phone Number:</label>
          <input required id="phone" type="tel" ref={phoneInputRef} />
        </div>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input required id="firstName" type="text" ref={firstNameInputRef} />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input required id="lastName" type="text" ref={lastNameInputRef} />
        </div>
        <button>submit</button>
      </form>
    </div>
  );
};

export default CustomerForm;
