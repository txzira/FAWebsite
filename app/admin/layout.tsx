import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import AdminNavbar from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await unstable_getServerSession(authOptions);
  if (session) {
    return session.user.role === "admin" ? (
      <div className="flex flex-row">
        <AdminNavbar />
        {children}
      </div>
    ) : (
      <>Unauthorized user.</>
    );
  } else {
    return (
      <>
        Unauthorized user. Please <Link href="/auth/login">login.</Link>
      </>
    );
  }
}
