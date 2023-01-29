import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/hash";
import prisma from "../../../lib/prisma";

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
export const authOptions: NextAuthOptions = {
  //Configure JWT
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          //Find user with the email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });
          // If user exist
          if (user) {
            const checkPassword = await verifyPassword(credentials?.password, user.password);
            // If entered password matches with password in database
            if (checkPassword) {
              //get and attach commerceJs JWT for commerce.customer's function usage
              user.jwt = await getJwt(user.id);
              return user;
            }
            // Error invalid password
            return null;
          }
          //not found send error
          return null;
          //throw new Error("No user found with the email");
        } catch (err: any) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      console.log(user);
      if (user) {
        token.accessToken = user.jwt;
        token.email = user.email;
        token.id = user.id;
        token.role = user.role;
        token.name = user.firstName + " " + user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      // session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      return session;
    },
  },
};

export default NextAuth(authOptions);
