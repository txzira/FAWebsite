import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import { hashPassword } from "../../../lib/hash";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    //Get email and password from body
    const { email, password, customer_id } = req.body;
    if (!email || !email.includes("@") || !password) {
      res.status(422).json({ message: "Invalid Data" });
      return;
    }
    //Connect with database
    const client = await connectToDatabase();
    //Check existing
    const checkExisting = await client.db().collection("users").findOne({ email: email });
    //Send error response if duplicate user is found
    if (checkExisting) {
      res.status(422).json({ message: "User already exists" });
      client.close();
      return;
    }
    //Hash password
    const hashedPassword = await hashPassword(password);
    //Insert User into database
    await client.db().collection("users").insertOne({
      email: email,
      password: hashedPassword,
      customer_id: customer_id,
      role: "customer",
    });
    //Send success response
    res.status(201).json({ message: "User created" });
    //Close DB connection
    client.close();
  } else {
    //Response for other than POST method
    res.status(500).json({ message: "Route not valid" });
  }
};