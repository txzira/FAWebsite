import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center pt-8">
      <Link href="/">
        <a>
          <Image alt="logo" width="120" height="60" src="/images/logo_size.png" />
        </a>
      </Link>
      <ul className="flex list-none">
        <li className="p-2.5">Contact</li>
        <li className="p-2.5">Locations</li>
        <li className="p-2.5">Shipping</li>
        <li className="p-2.5">Terms</li>
        <li className="p-2.5">Privacy</li>
        <li className="p-2.5">Accessibility</li>
      </ul>
    </footer>
  );
};

export default Footer;
