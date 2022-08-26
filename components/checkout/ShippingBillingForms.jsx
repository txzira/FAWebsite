import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
import styles from "../../styles/CheckoutForm.module.css";

export function ShippingDetails({
  countries,
  shippingCountry,
  setShippingCountry,
  subdivisions,
  shippingSubdivision,
  setShippingSubdivision,
  setStep,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  city,
  setCity,
  postalCode,
  setPostalCode,
  shippingLine1,
  setShippingLine1,
  shippingLine2,
  setShippingLine2,
}) {
  return (
    <div>
      <h1 className={styles["form-title"]}>Contact Information</h1>
      <div className={styles["input-line"]}>
        <label htmlFor="shippingEmail">Email</label>
        <input
          required
          id="shippingEmail"
          name="shippingEmail"
          type="text"
          placeholder="abc123@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <h1 className={styles["form-title"]}>Shipping Address</h1>

      <label htmlFor="shippingCountry">Country</label>
      <select id="shippingCountry" name="shippingCountry" value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)}>
        {countries.map((country) => (
          <option value={country.id} key={country.id}>
            {country.label}
          </option>
        ))}
      </select>

      <div className={styles["row"]}>
        <div className={styles["col-50"]}>
          <label htmlFor="shippingFirstName">First Name</label>
          <input
            required
            id="shippingFirstName"
            name="shippingFirstName"
            type="text"
            placeholder="John Doe"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className={styles["col-50"]}>
          <label htmlFor="shippingLastName">Last Name</label>
          <input
            required
            id="shippingLastName"
            name="shippingLastName"
            type="text"
            placeholder="John Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className={styles["row"]}>
        <div className={styles["col-25"]}>
          <label htmlFor="shippingCity">City</label>
          <input
            required
            id="shippingCity"
            name="shippingCity"
            type="text"
            placeholder="Trenton"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className={styles["col-25"]}>
          <label htmlFor="shippingState">State/Province</label>
          <select
            id="shippingState"
            name="shippingState"
            value={shippingSubdivision}
            onChange={(e) => setShippingSubdivision(e.target.value)}
          >
            {subdivisions.map((subdivision) => (
              <option value={subdivision.id} key={subdivision.id}>
                {subdivision.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles["col-25"]}>
          <label htmlFor="shippingZip">Postal Code</label>
          <input
            required
            id="shippingZip"
            name="shippingZip"
            type="text"
            placeholder="08608"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
      </div>
      <div className={styles["input-line"]}>
        <label htmlFor="shippingLine1">Address</label>
        <input
          required
          id="shippingLine1"
          name="shippingLine1"
          type="text"
          placeholder="20 S Montgomery St"
          value={shippingLine1}
          onChange={(e) => setShippingLine1(e.target.value)}
        />
      </div>
      <div className={styles["input-line"]}>
        <label htmlFor="shippingLine2">Apartment, suite, etc.. (optional)</label>
        <input
          id="shippingLine2"
          name="shippingLine2"
          type="text"
          placeholder="Apt. 1"
          value={shippingLine2}
          onChange={(e) => setShippingLine2(e.target.value)}
        />
      </div>

      <div className={styles["test"]}>
        <span>{"<- back to cart"}</span>
        <span onClick={() => setStep(1)}>{"Shipping ->"}</span>
      </div>
    </div>
  );
}

export function ShippingMethod({ options, setStep, setShippingOption, setShippingOptionLabel }) {
  function handleShippingOption(event, label) {
    setShippingOptionLabel(label);
    setShippingOption(event.target.value);
  }

  return (
    <div style={{ width: "100%" }}>
      <h1 className={styles["form-title"]}>Shipping Method</h1>
      {options.map((option) => (
        <div className={styles["group"]} key={option.id}>
          <input
            type="radio"
            value={option.id}
            name="shippingOption"
            id={option.id}
            onClick={(e) => handleShippingOption(e, option.label)}
          />
          <label htmlFor={option.id}>{option.label}</label>
        </div>
      ))}
      <div className={styles["test"]}>
        <span onClick={() => setStep(0)}>{"<- Contact"}</span>
        <span onClick={() => setStep(2)}>{"Billing ->"}</span>
      </div>
    </div>
  );
}

export function BillingDetails({
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  country,
  setCountry,
  subdivision,
  setSubdivision,
  city,
  setCity,
  postalCode,
  setPostalCode,
  billingLine1,
  setBillingLine1,
  billingLine2,
  setBillingLine2,
  countries,
  setStep,
  stripe,
  elements,
  isLoading,
  shippingAsBillingAddress,
  setShippingAsBillingAddress,
}) {
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Courier New",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        fontFamily: "Arial, sans-serif",
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  function handleShowBilling(event) {
    event.target.value === "yes" ? setShippingAsBillingAddress(true) : setShippingAsBillingAddress(false);
  }

  return (
    <>
      <h1 className={styles["form-title"]}>Payment</h1>
      <div className={styles["form-control"]}>
        <div className={styles["col-75"]}>
          <CardElement id="card-element" options={cardStyle} />
        </div>
      </div>
      <div className="">
        <h1 className={styles["form-title"]}>Billing Address</h1>
        {/* <input type="checkbox" onChange={handleShowBilling} /> */}
        <div className={styles["group"]} style={{ width: "100%", display: "block" }} onChange={(e) => handleShowBilling(e)}>
          <div className={styles["group"]}>
            <input type="radio" name="shipAsBill" value="yes" defaultChecked />
            <label>Same as shipping address</label>
          </div>
          <div className={styles["group"]}>
            <input type="radio" name="shipAsBill" value="no" />
            <label>Use a different billing address</label>
          </div>
        </div>
        {!shippingAsBillingAddress && (
          <>
            <div className={styles["input-line"]}>
              <label>Email</label>
              <input
                required
                name="billingEmail"
                type="text"
                placeholder="abc123@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles["row"]}>
              <div className={styles["col-50"]}>
                <label>First Name</label>
                <input
                  required
                  name="billingFirstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className={styles["col-50"]}>
                <label>Last Name</label>
                <input
                  required
                  name="billingLastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <label>Country</label>
            <select name="billingCountry" value={country} onChange={(e) => setCountry(e.target.value)}>
              {countries.map((country) => (
                <option value={country.id} key={country.id}>
                  {country.label}
                </option>
              ))}
            </select>

            <div className={styles["row"]}>
              <div className={styles["col-25"]}>
                <label>City</label>
                <input
                  required
                  name="billingCity"
                  type="text"
                  placeholder="Trenton"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className={styles["col-25"]}>
                <label>State</label>
                <input
                  required
                  name="billingState"
                  type="text"
                  placeholder="New Jersey"
                  value={subdivision}
                  onChange={(e) => setSubdivision(e.target.value)}
                />
              </div>
              <div className={styles["col-25"]}>
                <label>Postal Code</label>
                <input
                  required
                  name="billingZip"
                  type="text"
                  placeholder="08608"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            <div className={styles["input-line"]}>
              <label>Address</label>
              <input
                required
                name="billingLine1"
                type="text"
                placeholder="20 S Montgomery St"
                value={billingLine1}
                onChange={(e) => setBillingLine1(e.target.value)}
              />
            </div>
            <div className={styles["input-line"]}>
              <label>Apartment, suite, etc.. (optional)</label>
              <input
                name="billingLine2"
                type="text"
                placeholder="Apt. 1"
                value={billingLine2}
                onChange={(e) => setBillingLine2(e.target.value)}
              />
            </div>
          </>
        )}
        <div className={styles["test"]}>
          <span onClick={() => setStep(1)}>{"<- Shipping"}</span>
          {/* <span onClick={() => setStep(3)}>{"Pay Now ->"}</span> */}
          <button disabled={!stripe || !elements} id="submit">
            <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now ->"}</span>
          </button>
        </div>
      </div>
    </>
  );
}

export function ProgressView({ step, setStep, email, line1, line2, city, subdivision, postalCode, country, shippingOptionLabel }) {
  return (
    <div className={styles["progress-view-container"]}>
      <div className={styles["col-75"]}>
        {step >= 1 && (
          <>
            <div className={styles["test"]}>
              <div>
                <label>Contact&nbsp;</label>
                <span>{email}</span>
              </div>
              <span onClick={() => setStep(0)}>change</span>
            </div>
            <hr />
            <div className={styles["test"]}>
              <div>
                <label>Ship To&nbsp;</label>
                <span>
                  {`${line1}, `}
                  {line2 ? `${line2}, ` : ""}
                  {`${city} ${subdivision} ${postalCode}, ${country}`}
                </span>
              </div>
              <span onClick={() => setStep(0)}>change</span>
            </div>
          </>
        )}
        {step >= 2 && (
          <>
            <hr />
            <div className={styles["test"]}>
              <div>
                <label>Shipping&nbsp;</label>
                <span>{shippingOptionLabel}</span>
              </div>
              <span onClick={() => setStep(1)}>change</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
