import Link from 'next/link';
import React, { useRef, useState, useEffect } from 'react';

import logger from '@/lib/logger';
import Seo from '@/components/Seo';
import { signupDetailsType } from '@/types/User';
import { getFromLocalStorage } from '@/lib/helper';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';

const Register = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);

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
          if (response.ok) {
            router.push('/home');
            logger(data.message);
          } else {
            logger(data.message);
          }
        } catch (error) {
          logger(error, 'Error');
        }
      };

      checkToken();
    }
  });

  const handleSignup = async (signupDetails: signupDetailsType) => {
    try {
      const response = await fetch(
        'https://rally-mind.onrender.com/api/user/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...signupDetails }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        const { token } = data;
        // Store the token in web storage
        localStorage.setItem('token', token);
        console.log('Signup successful');
        router.push('/home');
      } else {
        resetInputValues();
        setLoading(false);
        const error = `SignUp failed: ${data.message}`;
        console.error(error);
        setError(error);
      }
    } catch (error) {
      resetInputValues();
      setLoading(false);

      const msg = `Error: ${error}`;
      setError(msg);
      console.error(msg);
    }
  };

  const handleSubmit = () => {
    if (
      emailRef.current === null ||
      passwordRef.current === null ||
      usernameRef.current === null ||
      genderRef.current === null
    )
      return;

    const email = emailRef.current.value.toLowerCase();
    const password = passwordRef.current.value;
    const username = usernameRef.current.value;
    const gender = genderRef.current.value.toLowerCase();

    setLoading(true);
    handleSignup({ email, password, username, gender });
  };

  const resetInputValues = () => {
    if (
      emailRef.current === null ||
      passwordRef.current === null ||
      usernameRef.current === null
    )
      return;

    emailRef.current.value = '';
    passwordRef.current.value = '';
    usernameRef.current.value = '';
  };

  return (
    <>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main className='bg-primary flex h-screen w-screen flex-col items-center justify-center gap-6'>
        <h1 className='text-brand text-3xl font-semibold'>Signup</h1>
        <section className='item flex w-full flex-col items-center justify-center gap-6'>
          <input
            type='text'
            name='username'
            id='username'
            placeholder='Username'
            ref={usernameRef}
            className='ring-brand focus:ring-brand h-14 w-2/3 rounded-lg border-0 ring ring-inset focus:ring focus:ring-inset'
          />
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
          <select
            id='country'
            name='country'
            className='mt-1 block w-2/3 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            ref={genderRef}
          >
            <option>Male</option>
            <option>female</option>
            <option>other</option>
          </select>
          <p className='w-2/3 text-lg text-red-600'>{error !== '' && error}</p>
        </section>
        <span className='flex flex-col items-center justify-center'>
          {loading ? (
            <Loading />
          ) : (
            <button
              className='text-primary bg-brand h-14 w-2/4 rounded-md font-semibold'
              onClick={handleSubmit}
            >
              Sumbit
            </button>
          )}
          <div className='flex gap-3'>
            <span>Already have an account?</span>
            <Link href='/' className='text-brand font-bold'>
              Login
            </Link>
          </div>
        </span>
      </main>
    </>
  );
};

export default Register;
