import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/mongodb";
import { verifyPassword } from "../../../lib/hash";
import commerce from "../../../lib/commerce";

async function getJwt(customerId) {
  const url = new URL(`https://api.chec.io/v1/customers/${customerId}/issue-token`);

  const headers = {
    "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  let commerceJsCustomer = await fetch(url, {
    method: "POST",
    headers: headers,
  });
  commerceJsCustomer = await commerceJsCustomer.json();

  return commerceJsCustomer.jwt;
}

export default NextAuth({
  //Configure JWT
  session: {
    strategy: "jwt",
    jwt: "true",
    maxAge: 24 * 60 * 60,
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
        const checkPassword = verifyPassword(credentials.password, user.password);
        //Incorrect password - send response
        if (!checkPassword) {
          client.close();
          throw new Error("Password doesnt match");
        }
        //Else send success response
        //get and attach commerceJs JWT for commerce.customer's function usage
        user.jwt = await getJwt(user.customer_id);

        client.close();
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.jwt;
        token.email = user.email;
        token.customer_id = user.customer_id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // session.accessToken = token.accessToken;
      session.user.customer_id = token.customer_id;
      session.user.role = token.role;
      return session;
    },
  },
});
