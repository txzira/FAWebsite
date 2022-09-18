import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/mongodb";
import { verifyPassword } from "../../../lib/hash";

// async function http(url: URL, init: RequestInit): Promise<any> {
//   const response = await fetch(url, init);
//   const body = await response.json();
//   return body;
// }

async function getJwt(customerId) {
  const url = new URL(`https://api.chec.io/v1/customers/${customerId}/issue-token`);

  const headers = {
    "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  let commerceJsCustomer: any = await fetch(url.toString(), {
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
    maxAge: 24 * 60 * 60,
  },
  providers: [
    CredentialProvider({
      async authorize(credentials: any) {
        try {
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
            return null;
            throw new Error("No user found with the email");
          }
          const checkPassword = verifyPassword(credentials.password, user.password);
          //Incorrect password - send response
          if (!checkPassword) {
            client.close();
            return null;
            throw new Error("Password doesnt match");
          }
          //Else send success response
          //get and attach commerceJs JWT for commerce.customer's function usage
          user.jwt = await getJwt(user.customer_id);

          client.close();
          return user;
        } catch (err: any) {
          return null;
        }
      },
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
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
