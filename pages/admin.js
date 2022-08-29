import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (session && session.user.role == "admin") {
    return <div>Welcome {session.user.email}</div>;
  } else {
    return <div>Unauthorized User</div>;
  }
}

// router.replace("/");
