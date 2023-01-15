import React, { useState } from "react";
import Link from "next/link";
import { NavDropdown, NavItem } from "./Nav";

const Dropdown = ({ dropdownName, dropdownSlug, submenuItems, path }) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false);

  return (
    <div className="flex-col items-center" onMouseLeave={() => setDropdownIsActive(false)}>
      <Link
        href={`${path}/${dropdownSlug}`}
        onMouseEnter={() => setDropdownIsActive((prev) => !prev)}
        className="flex items-center text-sm md:text-base h-8 md:h-14 w-full md:p-3"
        aria-expanded={dropdownIsActive ? "true" : "false"}
      >
        {dropdownName}+
      </Link>
      <div>
        <NavDropdown dropdownState={dropdownIsActive}>
          {submenuItems.map((item) => (
            <NavItem key={item.id} id={item.slug} title={dropdownSlug}>
              <Link className="flex items-center text-sm md:text-base h-8 md:h-14 md:p-3" href={`${path}/${item.slug}`}>
                {item.name}
              </Link>
            </NavItem>
          ))}
        </NavDropdown>
      </div>
    </div>
  );
};

export default Dropdown;
