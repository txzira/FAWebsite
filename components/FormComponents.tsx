import React from "react";

export const FormTitle = ({ children }: { children: React.ReactNode }) => <h1 className="text-4xl font-medium mb-10">{children}</h1>;

export const FormCol25 = ({ children }: { children: React.ReactNode }) => <div className="basis-1/4 px-4 py-0">{children}</div>;

export const FormCol33 = ({ children }: { children: React.ReactNode }) => <div className="basis-1/3 px-4 py-0">{children}</div>;

export const FormCol50 = ({ children }: { children: React.ReactNode }) => <div className="basis-1/2 px-4 py-0">{children}</div>;

export const FormCol75 = ({ children }: { children: React.ReactNode }) => <div className="basis-3/4">{children}</div>;

export const Row = ({ children }: { children: React.ReactNode }) => <div className="flex flex-wrap -mx-4">{children}</div>;
