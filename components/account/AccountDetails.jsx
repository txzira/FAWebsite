import React, { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
export default function AccountDetails() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const { data: session, status } = useSession();

  const emailRegex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );
  const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/);

  async function handleChangePassword(e) {
    e.preventDefault();
    //Validate new password as acceptable password
    //Password contains at least 1 uppercase letter, number, and symbol
    if (passwordRegex.test(newPassword)) {
      //check new password and retyped new password match
      if (newPassword === retypePassword) {
        //send old and new password to server if old password matches password on record then change password and return status:accepted
        let status = await fetch("/api/auth/changepassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session.user.email, oldPassword: oldPassword, newPassword: newPassword }),
        });
        status = await status.json();
        console.log(status);
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
      <h1>AccountDetails</h1>
      <label htmlFor="name">Full Name</label>
      <input id="name" type="text" name="name" value="ronnie" />
      <label htmlFor="email">Email Address</label>
      <input id="email" type="email" name="email" value="example@123.com" />
      <div className="password">
        <form>
          <h2>Change Password</h2>
          <label htmlFor="oldPassword">Old Password</label>
          <input id="oldPassword" type="password" name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <label htmlFor="newPassword">New Password</label>
          <input id="newPassword" type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
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
