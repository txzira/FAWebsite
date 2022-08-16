import React, { useState } from "react";
import Link from "next/link";

const Dropdown = ({ dropdownName, submenuItems }) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);

  return (
    <div>
      <span
        onMouseEnter={() => setDropdownIsActive((prev) => !prev)}
        className=""
        aria-expanded={dropdownIsActive ? "true" : "false"}
      >
        <h3>{dropdownName}</h3>
      </span>
      <div>
        <ul className={`dropdown ${dropdownIsActive ? "show" : ""}`}>
          {submenuItems.map((item) => (
            <li key={item.id}>
              <Link href={`/categories/${item.slug}`}>
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
