import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div>
      <h1>The page you&apos;re looking for was not found.</h1>
      <Link href="/">
        <button>Back to Hompage</button>
      </Link>
    </div>
  );
};

export default NotFound;
