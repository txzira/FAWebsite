import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import { hashPassword, verifyPassword } from "../../../lib/hash";
import prisma from "../../../lib/prisma";
import Email from "next-auth/providers/email";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    //Find user with the email
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    //check sent old password matches password in database
    const checkPassword = await verifyPassword(req.body.oldPassword, user.password);
    //Incorrect password - send response
    if (!checkPassword) {
      res.status(403).json({ message: "Incorrect Password" });
    } else {
      const hashedPassword = await hashPassword(req.body.newPassword);
      await prisma.user.update({ where: { email: req.body.email }, data: { password: hashedPassword } });

      res.status(200).json({ message: "success" });
    }
  } else {
    //Response for other than POST method
    res.status(500).json({ message: "Route not valid" });
  }
};
