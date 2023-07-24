import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import moods from '@/data/moods';
import logger from '@/lib/logger';
import Layout from '@/components/Layout';
import Protected from '@/components/Protected';
import { getFromLocalStorage, getCurrentDate, checkStreak } from '@/lib/helper';

import { Icon } from '@iconify/react';

const limit = 250;
const home = () => {
  const [mood, setMood] = useState('');
  const [showReason, setShowReason] = useState(false);
  const [disableSelection, setDisableSelection] = useState(false);
  const [value, setValue] = useState(0);
  const [songs, setSongs] = useState([
    {
      name: 'Happy',
      color: '#E87C17',
    },
    {
      name: 'Energized',
      color: '#66FF00',
    },
    {
      name: 'Calm',
      color: '#F18AB5',
    },
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remainingcharacters = limit - value;

  useEffect(() => {
    // check if user has recorded their mood today
    if (getFromLocalStorage('date') === getCurrentDate()) {
      setDisableSelection(true);
    } else {
      setDisableSelection(false);
    }
  }, []);

  const handleMoodClick = (name: string) => {
    if (disableSelection) return;

    setMood(name);
    setShowReason(true);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setValue(newValue.length);
  };

  const handleSubmit = async () => {
    const reason = textareaRef.current?.value;
    const date = getCurrentDate();

    if (reason?.length === undefined) return;
    if (reason.length === 0 || reason.length > 250) return;

    const moodDetails = {
      date: new Date(date),
      mood,
      reason,
    };

    try {
      const response = await fetch(
        'http://localhost:4000/api/user/updateMood',
        {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${getFromLocalStorage('token')}`,
          },
          body: JSON.stringify({
            email: getFromLocalStorage('email'),
            moodDetails,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        logger(data.message);
        window.localStorage.setItem('date', date);
        setDisableSelection(true);
        checkStreak();
      } else {
        logger(`Couldn't add mood`);
      }
    } catch (error) {
      logger(error, 'Error');
    }

    setShowReason(false);
  };

  return (
    <Protected>
      <Layout>
        <section className='h-full w-full px-10 py-6'>
          <header className='mb-20 flex items-center justify-between'>
            <Image
              priority
              src='/svg/Logo.svg'
              height={32}
              width={32}
              alt='Rally mind logo'
            />
            <Link href='/settings'>
              <Icon
                icon='solar:settings-bold'
                className='text-brand h-10 w-10'
              />
            </Link>
          </header>
          <main className='flex h-full flex-col gap-12'>
            <section className='flex h-2/5 flex-col gap-3'>
              <h2>How are you feeling today?</h2>
              {!showReason ? (
                <div className='bg-brand max:h-full max:w-full flex h-full w-full flex-wrap content-start gap-3 rounded-md px-3 py-5'>
                  {moods.map(({ icon, name, color }) => {
                    return (
                      <div
                        className='bg-primary flex h-12 w-fit cursor-pointer items-center justify-center gap-1 rounded-lg px-3 py-1'
                        onClick={() => handleMoodClick(name)}
                        key={name}
                      >
                        <Icon
                          style={{ color: `#${color}` }}
                          className='h-8 w-8'
                          icon={`${icon}`}
                        />
                        <span className='text-lg'>{name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className='bg-brand max:h-full max:w-full relative flex h-full w-full flex-col items-center rounded-md px-3 py-5'>
                  <span className='relative flex h-2/4 w-full flex-col'>
                    <textarea
                      name='reason'
                      id='reason'
                      className='ring-brand focus:ring-brand h-full w-full resize-none rounded-lg border-0 ring ring-inset focus:ring focus:ring-inset'
                      placeholder='Why are you feeling that way?'
                      ref={textareaRef}
                      onChange={handleChange}
                    />
                    <span
                      className='absolute bottom-2 right-4 text-gray-800'
                      style={{
                        color:
                          remainingcharacters < 0
                            ? 'rgb(220, 38, 38, 1)'
                            : 'rgb(31, 41, 55, 1)',
                      }}
                    >
                      {remainingcharacters}
                    </span>
                  </span>
                  <button
                    className='text-brand bg-primary h-14 w-2/4 rounded-md font-semibold'
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              )}
            </section>
            <section className='flex h-1/3 flex-col gap-3 opacity-95'>
              <span>
                <h2>Songs</h2>
                <p>Listen to songs right for your mood</p>
              </span>
              <div className='bg-brand max:h-full max:w-full flex h-full w-full flex-col items-center gap-3 rounded-md py-5'>
                {songs.map(({ name, color }) => {
                  return (
                    <div
                      style={{
                        border: `1.5px solid ${color}`,
                        background: `linear-gradient(149deg, #F8FBFE 0%, ${color} 100%)`,
                      }}
                      className='flex h-14 w-[90%] items-center justify-between rounded-md px-5'
                      key={name}
                    >
                      <p className='font-medium'>{`${name} Playlist`}</p>
                      <Icon
                        icon='icon-park-solid:play'
                        className='text-primary h-8 w-8'
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </main>
        </section>
      </Layout>
    </Protected>
  );
};

export default home;
