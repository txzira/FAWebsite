import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/mongodb";
import { verifyPassword } from "../../../lib/hash";

export default NextAuth({
  //Configure JWT
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialProvider({
      async authorize(credentials) {
        //Connect to DB
        const client = await connectToDatabase();
        //Get all the users
        const users = await client.db().collection("users");
        //Find user with the email
        const user = await users.findOne({
          email: credentials.email,
        });
        //Not found - send error res
        if (!user) {
          client.close();
          throw new Error("No user found with the email");
        }
        const checkPassword = verifyPassword(
          credentials.password,
          user.password
        );
        //Incorrect password - send response
        if (!checkPassword) {
          client.close();
          throw new Error("Password doesnt match");
        }
        //Else send success response
        client.close();
        return { email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
