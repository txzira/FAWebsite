import React from "react";

export const HorizontalDivider = ({ tailwindClass = "" }: { tailwindClass?: string }) => (
  <div className={`border-b-2  ${tailwindClass ? `${tailwindClass}` : ""}`}></div>
);
export const VerticalDivider = ({ tailwindClass = "" }: { tailwindClass?: string }) => (
  <div className={`border-l-2  ${tailwindClass ? `${tailwindClass}` : ""}`}></div>
);

export const MainBox = ({ children }: { children: React.ReactNode }) => <div className="w-full max-w-1400 m-auto">{children}</div>;
