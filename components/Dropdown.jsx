import React, { useState } from "react";
import Link from "next/link";

const Dropdown = ({ dropdownName, dropdownSlug, submenuItems, path }) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);

  return (
    <div onMouseLeave={() => setDropdownIsActive(false)} style={{ display: "flex", flexDirection: "column" }}>
      <span onMouseEnter={() => setDropdownIsActive((prev) => !prev)} className="" aria-expanded={dropdownIsActive ? "true" : "false"}>
        <Link href={`${path}/${dropdownSlug}`}>
          <a>{dropdownName}+</a>
        </Link>
      </span>
      <div style={{ margin: "0px", padding: "0px", top: "1", height: "0px", width: "0px" }}>
        <ul className={`dropdown ${dropdownIsActive ? "show" : ""}`}>
          {submenuItems.map((item) => (
            <li key={item.id} id={item.slug} name={dropdownSlug}>
              <Link href={`${path}/${item.slug}`}>
                <a>{item.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
