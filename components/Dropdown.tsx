import React, { useState } from "react";
import Link from "next/link";

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
        <ul className={`flex-col w-full left-3/4 bg-custom-100 text-black absolute z-10 list-none ${dropdownIsActive ? "flex" : "hidden"}`}>
          {submenuItems.map((item) => (
            <div key={item.id} id={item.slug} title={dropdownSlug} className="hover:bg-black hover:text-white">
              <Link className="flex items-center text-sm md:text-base h-8 md:h-14 md:p-3" href={`${path}/${item.slug}`}>
                {item.name}
              </Link>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
