import { Customer } from "@chec/commerce.js/types/customer";
import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../../lib/hash";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email, password, firstname, lastname, phone } = req.body;
    console.log(email, password, firstname, lastname, phone);
    if (!email || !email.includes("@") || !password || !firstname || !lastname || !phone) {
      res.status(422).json({ message: "Invalid Data" });
      return;
    }
    try {
      //Check existing
      const checkExisting = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      console.log(checkExisting);
      //Send error response if duplicate user is found
      if (checkExisting) {
        res.status(422).json({ message: "User already exists" });
        return;
      }
      const createCustomer = await fetch("https://api.chec.io/v1/customers", {
        method: "POST",
        headers: {
          "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(req.body),
      });
      const customer: Customer = await createCustomer.json();

      //Hash password
      const hashedPassword = await hashPassword(password);
      //Insert User into database
      await prisma.user.create({
        data: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstname,
          lastName: customer.lastname,
          role: "customer",
          password: hashedPassword,
        },
      });
      //Send success response
      res.status(201).json({ message: "User created" });
    } catch (err) {
      //Send erro response
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
