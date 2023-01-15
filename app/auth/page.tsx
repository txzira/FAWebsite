import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { signIn, getSession } from "next-auth/react";
import AuthForm from "../../components/auth/auth-form";

const AuthPage = () => {
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace("/");
      }
      return;
    });
  }, [router]);

  return <AuthForm />;
};

export default AuthPage;
