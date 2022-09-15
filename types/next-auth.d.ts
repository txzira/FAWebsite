import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      customer_id: string;
      role: string;
      jwt: string;
    } & DefaultSession["user"];
  }

  interface User {
    customer_id: string;
    role: string;
    jwt: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken: string;
    email: string;
    customer_id: string;
    role: string;
  }
}
