import React, { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { AiOutlineEdit } from "react-icons/ai";
import { validatePassword } from "../../lib/formvalidation";

export default function AccountDetails() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const { data: session, status } = useSession();

  async function handleChangePassword(e) {
    e.preventDefault();
    //Validate new password as acceptable password
    //Password contains at least 1 uppercase letter, lowercase letter, number, and symbol
    if (validatePassword(newPassword)) {
      //check new password and retyped new password match
      if (newPassword === retypePassword) {
        //send old and new password to server if old password matches password on record then change password and return status:accepted
        let status = await fetch("/api/auth/changepassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email,
            oldPassword: oldPassword,
            newPassword: newPassword,
          }),
        });
        status = await status.json();
        status.message === "success"
          ? toast.success("Password Successfully Changed")
          : toast.error(status.message);
      } else {
        toast.error("Mismatched passwords");
      }
    } else {
      toast.error(
        "Password must be between 8 to 16 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
      );
    }
  }

  return (
    <div>
      {console.log(session)}
      <h1>AccountDetails</h1>
      <label htmlFor="name">Full Name</label>
      <input id="name" type="text" name="name" placeholder="session name" />
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        type="email"
        name="email"
        placeholder={session.user.email}
      />
      <button>
        <AiOutlineEdit />
      </button>
      <div className="password">
        <form>
          <h2>Change Password</h2>
          <label htmlFor="oldPassword">Old Password</label>
          <input
            id="oldPassword"
            type="password"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label htmlFor="retypePassword">Retype New Password</label>
          <input
            id="retypePassword"
            type="password"
            name="retypePassword"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
          />
          <button type="submit" onClick={handleChangePassword}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
