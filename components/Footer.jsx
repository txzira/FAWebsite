import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "30px", flexDirection: "column", alignItems: "center" }}>
      <Link href="/">
        <a>
          <Image alt="logo" width="120" height="60" src="/images/logo_size.png" />
        </a>
      </Link>
      <div>
        <ul style={{ display: "flex", listStyle: "none" }}>
          <li style={{ padding: "10px" }}>Contact</li>
          <li style={{ padding: "10px" }}>Locations</li>
          <li style={{ padding: "10px" }}>Shipping</li>
          <li style={{ padding: "10px" }}>Terms</li>
          <li style={{ padding: "10px" }}>Privacy</li>
          <li style={{ padding: "10px" }}>Accessibility</li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
