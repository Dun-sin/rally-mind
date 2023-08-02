import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import logger from '@/lib/logger';
import { profile } from '@/types/User';
import Layout from '@/components/Layout';
import Protected from '@/components/Protected';
import { getFromLocalStorage } from '@/lib/helper';

import { Icon } from '@iconify/react';

const Settings: React.FC = () => {
  const router = useRouter();

  const [profile, setProfile] = useState<profile>({
    username: null,
    gender: 'others',
    email: null,
    gamification: {
      points: 0,
      streak: 0,
    },
  });

  useEffect(() => {
    getUserProfile();
  }, []);

  async function getUserProfile() {
    try {
      const response = await fetch(
        `https://rally-mind.onrender.com/api/user/userProfile?email=${getFromLocalStorage(
          'email'
        )}`,
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${getFromLocalStorage('token')}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        logger(data.message, 'profile');
        setProfile(data.message);
      } else {
        logger(data.message, 'error');
      }
    } catch (error) {
      logger(error, 'error');
    }
  }

  const logout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('email');
    router.push('/');
  };

  const deleteUser = async () => {
    try {
      const response = await fetch(
        `https://rally-mind.onrender.com/api/user/deleteUser`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${getFromLocalStorage('token')}`,
          },
          body: JSON.stringify({ email: getFromLocalStorage('email') }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        logger(data.message, 'message');
        logout();
      } else {
        logger(data.message, 'error');
      }
    } catch (error) {
      logger(error, 'error');
    }
  };

  return (
    <Protected>
      <Layout>
        <section className='flex h-full w-full flex-col gap-6'>
          <header className='bg-brand flex h-[8%] w-full items-center gap-4 rounded-b-2xl px-4 py-3'>
            <Icon
              icon='ion:arrow-back-outline'
              className='text-primary h-8 w-8 cursor-pointer'
              onClick={() => router.back()}
            />
            <h2 className='text-primary text-2xl'>Settings</h2>
          </header>
          <main className='flex h-[92%] w-full flex-col items-center gap-5 px-10 py-6'>
            <section className='flex flex-col items-center'>
              <div className='ring-brand relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-full p-1 ring-4'>
                {profile.gender === 'male' ? (
                  <Image
                    src={'/svg/male.svg'}
                    alt='Male avater'
                    fill
                    quality={100}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  profile.gender === 'female' && (
                    <Image
                      src={'/svg/female.svg'}
                      alt='Female avater'
                      fill
                      quality={100}
                      className='h-full w-full object-cover'
                    />
                  )
                )}
              </div>
              <span className='mt-1 flex items-center'>
                <p className='text-xl'>{profile.username}</p>
                <Icon
                  icon='fluent:edit-24-filled'
                  className='text-brand h-4 w-4 cursor-pointer'
                />
              </span>
              <p className='text-lg'>{profile.email}</p>
              <span className='flex items-center gap-2'>
                <p>
                  <span className='text-base font-normal'>Streak: </span>
                  <span className='text-base font-medium'>
                    {profile.gamification?.streak}days
                  </span>
                </p>
                <p>
                  <span className='text-base font-normal'>Points: </span>
                  <span className='text-base font-medium'>
                    {profile.gamification?.points}pt
                  </span>
                </p>
              </span>
            </section>

            <section className='text-primary w-full gap-3'>
              <div className='bg-brand flex w-full items-center justify-between rounded-lg px-4 py-4'>
                <p className='text-base'>Remind me to Journal Everyday at</p>
                <div className='border-primary rounded-md border p-2'>
                  10:00AM
                </div>
              </div>
            </section>
          </main>

          <footer className='mb-6 flex w-full flex-col items-center gap-4'>
            <div
              className='text-primary bg-brand flex h-12 w-2/4 cursor-pointer items-center justify-center rounded-md text-base font-semibold'
              onClick={logout}
            >
              LogOut
            </div>
            <div
              className='text-primary flex h-12 w-2/4 cursor-pointer items-center justify-center rounded-md bg-red-700 text-base font-semibold'
              onClick={deleteUser}
            >
              Delete Your Account
            </div>
          </footer>
        </section>
      </Layout>
    </Protected>
  );
};

export default Settings;
