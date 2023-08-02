import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import logger from '@/lib/logger';
import Seo from '@/components/Seo';
import { useRouter } from 'next/router';
import { loginDetailsType } from '@/types/User';
import { getFromLocalStorage } from '@/lib/helper';

const Login = () => {
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = getFromLocalStorage('token');

    if (token) {
      const checkToken = async () => {
        try {
          const response = await fetch(
            'https://rally-mind.onrender.com/api/user/protected',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          window.localStorage.setItem('email', data.message);
          response.ok ? router.push('/home') : logger(data.message);
        } catch (error) {
          logger(error, 'Error');
        }
      };

      checkToken();
    }
  });

  const handleLogin = async (loginDetails: loginDetailsType) => {
    try {
      const response = await fetch(
        'https://rally-mind.onrender.com/api/user/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...loginDetails }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        const { token } = data;
        // Store the token in web storage
        localStorage.setItem('token', token);

        window.localStorage.setItem('email', loginDetails.email);

        router.push('/home');
      } else {
        const error = `Login failed: ${data.message}`;
        logger(error);
        setError(error);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleSubmit = () => {
    if (emailRef.current === null || passwordRef.current === null) return;

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    console.log(email, password);

    handleLogin({ email, password });
    resetInputValues();
  };

  const resetInputValues = () => {
    if (emailRef.current === null || passwordRef.current === null) return;

    emailRef.current.value = '';
    passwordRef.current.value = '';
  };

  return (
    <>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main className='bg-primary flex h-screen w-screen flex-col items-center justify-center gap-6'>
        <h1 className='text-brand text-3xl font-semibold'>Login</h1>
        <section className='item flex w-full flex-col items-center justify-center gap-6'>
          <input
            type='email'
            placeholder='Email'
            name='email'
            className='ring-brand focus:ring-brand h-14 w-2/3 rounded-lg border-0 ring ring-inset focus:ring focus:ring-inset'
            ref={emailRef}
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            className='ring-brand focus:ring-brand h-14 w-2/3 rounded-lg border-0 ring ring-inset focus:ring focus:ring-inset'
            ref={passwordRef}
          />
          <p className='w-2/3 text-lg text-red-600'>{error !== '' && error}</p>
        </section>
        <span className='flex flex-col items-center justify-center'>
          <button
            className='text-primary bg-brand h-14 w-2/4 rounded-md font-semibold'
            onClick={handleSubmit}
          >
            Sumbit
          </button>
          <div className='flex gap-3'>
            <span>Don't have an account yet?</span>
            <Link href='/register' className='text-brand font-bold'>
              SignUp
            </Link>
          </div>
        </span>
      </main>
    </>
  );
};

export default Login;
