import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import { hashPassword, verifyPassword } from "../../../lib/hash";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    //Connect to DB
    const client = await connectToDatabase();
    //Get all the users
    const users = await client.db().collection("users");
    //Find user with the email
    const user = await users.findOne({
      email: req.body.email,
    });
    //check sent old password matches password in database
    const checkPassword = await verifyPassword(req.body.oldPassword, user.password);
    //Incorrect password - send response
    if (!checkPassword) {
      res.status(403).json({ message: "Incorrect Password" });
      client.close();
    } else {
      const hashedPassword = await hashPassword(req.body.newPassword);
      await client
        .db()
        .collection("users")
        .updateOne({ email: req.body.email }, { $set: { password: hashedPassword } });
      res.status(200).json({ message: "success" });
      client.close();
    }
  } else {
    //Response for other than POST method
    res.status(500).json({ message: "Route not valid" });
  }
};
