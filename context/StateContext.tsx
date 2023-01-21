"use client";
import React, { createContext, useContext, useState } from "react";

const Context = createContext(null);

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);

export default StateContext;
