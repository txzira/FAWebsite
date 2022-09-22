import React, { useState } from "react";
import Link from "next/link";

const Dropdown = ({ dropdownName, dropdownSlug, submenuItems, path }) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);

  return (
    <div onMouseLeave={() => setDropdownIsActive(false)} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* <span onMouseEnter={() => setDropdownIsActive((prev) => !prev)} className="" aria-expanded={dropdownIsActive ? "true" : "false"}> */}
      <Link href={`${path}/${dropdownSlug}`}>
        <a
          onMouseEnter={() => setDropdownIsActive((prev) => !prev)}
          className="flex items-center h-full"
          aria-expanded={dropdownIsActive ? "true" : "false"}
          style={{ height: "100%" }}
        >
          {dropdownName}+
        </a>
      </Link>
      {/* </span> */}
      <div style={{ display: "flex", margin: "0px", padding: "0px", top: "0px", width: "0px" }}>
        <ul className={`dropdown ${dropdownIsActive ? "show" : ""}`}>
          {submenuItems.map((item) => (
            <li key={item.id} id={item.slug} title={dropdownSlug}>
              <Link href={`${path}/${item.slug}`}>
                <a style={{ height: "60px" }}>{item.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
