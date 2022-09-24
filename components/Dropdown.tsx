import React, { useState } from "react";
import Link from "next/link";
import { NavDropdown, NavItem } from "./Nav";

const Dropdown = ({ dropdownName, dropdownSlug, submenuItems, path }) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);

  return (
    <div className="flex-col items-center" onMouseLeave={() => setDropdownIsActive(false)}>
      <Link href={`${path}/${dropdownSlug}`}>
        <a
          onMouseEnter={() => setDropdownIsActive((prev) => !prev)}
          className="flex items-center h-14 w-full p-3"
          aria-expanded={dropdownIsActive ? "true" : "false"}
        >
          {dropdownName}+
        </a>
      </Link>
      <div>
        <NavDropdown dropdownState={dropdownIsActive}>
          {submenuItems.map((item) => (
            <NavItem key={item.id} id={item.slug} title={dropdownSlug}>
              <Link href={`${path}/${item.slug}`}>
                <a className="flex items-center h-14 p-3">{item.name}</a>
              </Link>
            </NavItem>
          ))}
        </NavDropdown>
      </div>
    </div>
  );
};

export default Dropdown;
