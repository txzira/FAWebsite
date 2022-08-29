import React, { useState } from "react";
import Link from "next/link";

const Dropdown = ({ dropdownName, dropdownSlug, submenuItems, path }) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);

  return (
    <div onMouseLeave={() => setDropdownIsActive(false)}>
      <span onMouseEnter={() => setDropdownIsActive((prev) => !prev)} className="" aria-expanded={dropdownIsActive ? "true" : "false"}>
        <Link href={`${path}/${dropdownSlug}`}>
          <a>{dropdownName}</a>
        </Link>
      </span>
      <div>
        <ul className={`dropdown ${dropdownIsActive ? "show" : ""}`}>
          {submenuItems.map((item) => (
            <li key={item.id}>
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
