import toast from "react-hot-toast";

export const validatePassword = (password) => {
  const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/);
  if (passwordRegex.test(password)) return true;
  return false;
};
export const validateEmail = (email) => {
  const emailRegex = new RegExp(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  );
  if (emailRegex.test(email.toLowerCase())) return true;
  return false;
};

export const validateContactForm = (values, type) => {
  const errors = {};

  if (values.email) {
    if (!validateEmail(values.email)) errors.email = "\u2022Invalid email.";
  } else {
    errors.email = "\u2022An email is required.";
  }
  if (!values.firstName) {
    errors.firstName = "\u2022A first name is required.";
  }
  if (!values.lastName) {
    errors.lastName = "\u2022A last name is required.";
  }
  if (!values.street) {
    errors.street = "\u2022A street address is required";
  }
  if (!values.city) {
    errors.city = "\u2022A city name is required.";
  }
  if (!values.postalCode) {
    errors.postalCode = "\u2022A postal code is required.";
  }
  if (type === "billing") {
    if (!values.subdivision) {
      errors.subdivision = "\u2022A state/province name is required.";
    }
  }
  console.log(errors);

  return errors;
};

export const displayFormErrors = (formErrors) => {
  let string = "";
  for (var key in formErrors) {
    string += formErrors[key] + "\n";
  }
  toast.error(string);
};
