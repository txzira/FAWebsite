import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';

import { signIn, getSession } from 'next-auth/react';
import AuthForm from '../components/auth/auth-form';

const AuthPage = () => {
  const [isLoading, setIsLoading ] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if(isLoading){
    return <p>Loading...</p>;
  }
  return <AuthForm/>
}

export default AuthPage;