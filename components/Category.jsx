// components/Category.js
import React from "react";
import Dropdown from "./Dropdown";

export default function Category({ name, children }) {
  return (
    <div>
      {children.length > 0 ? (
        <Dropdown dropdownName={name} submenuItems={children} />
      ) : (
        <p>{name}</p>
      )}
    </div>
  );
}
