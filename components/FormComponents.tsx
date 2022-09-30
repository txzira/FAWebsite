import React from "react";

export const FormTitle = ({ children }: { children: React.ReactNode }) => <h1 className="text-4xl font-medium mb-10">{children}</h1>;

export const FormCol25 = ({ children }: { children: React.ReactNode }) => <div className="basis-1/4 px-4 py-0">{children}</div>;

export const FormCol33 = ({ children }: { children: React.ReactNode }) => <div className="basis-1/3 px-4 py-0">{children}</div>;

export const FormCol50 = ({ children }: { children: React.ReactNode }) => <div className="basis-1/2 px-4 py-0">{children}</div>;

export const FormCol75 = ({ children }: { children: React.ReactNode }) => <div className="basis-3/4">{children}</div>;

export const Row = ({ children }: { children: React.ReactNode }) => <div className="flex flex-wrap -mx-4">{children}</div>;

export const Input = ({
  id,
  name,
  value,
  onChange,
  labelText,
  required = true,
  type = "text",
  placeholder = "",
}: {
  id: string;
  name: string;
  value: any;
  onChange: (e: any) => void;
  labelText: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) => (
  <>
    <label htmlFor={id}>{labelText}</label>
    <input
      required={required}
      className="border border-black rounded-lg mb-5 p-2.5 w-full"
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </>
);

export const Select = ({
  id,
  name,
  value,
  labelText,
  options,
  onChange,
}: {
  id: string;
  name: string;
  value: any;
  labelText: string;
  options: any;
  onChange: (e: any) => void;
}) => (
  <>
    <label htmlFor={id}>{labelText}</label>
    <select className="border border-black rounded-lg mb-5 p-2.5 w-full" id={id} name={name} value={value} onChange={onChange}>
      {options.map((option) => (
        <option value={option.id} key={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  </>
);
