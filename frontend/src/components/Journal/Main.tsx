import React, { useEffect, useState } from 'react';

import { Icon } from '@iconify/react';

import logger from '@/lib/logger';
import { journalProps, mainProps } from '@/types/Component';
import Loading from '../Loading';
import { formatDate, getFromLocalStorage } from '@/lib/helper';

const Main = ({ setJournalInfo, setState }: mainProps) => {
  const [journals, setJournals] = useState<journalProps[]>([]);
  const [loading, setLoading] = useState(true);
  const handleOnClickJournal = (info: journalProps) => {
    setJournalInfo(info);
    setState('Edit');
  };

  useEffect(() => {
    const getAllJournals = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/users/journal?email=${getFromLocalStorage(
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
          logger(data.message);
          setJournals(data.message);
          setLoading(false);
        } else {
          logger(`Couldn't get all journals`);
        }
      } catch (error) {
        logger(error, 'Error');
      }
    };

    getAllJournals();
  }, []);

  const resetJournalInfo = () => {
    setJournalInfo({ _id: '', message: '', date: '' });
    setState('Edit');
  };

  return (
    <section className='relative flex h-full w-full flex-col gap-6'>
      <header
        className='bg-brand text-primary flex h-[35%] w-full flex-col gap-16 px-6 py-8'
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 64%, 50% 100%, 0 64%)',
        }}
      >
        <div className='flex justify-between'>
          <h1 className='text-3xl'>Journal</h1>
          <Icon icon='ion:filter' className='h-8 w-8' />
        </div>
        <div className='flex flex-col items-center'>
          <h2 className='text-center text-2xl'>Record your daily life</h2>
          <p className='px-6 text-center text-xl'>
            Tip: Pick a specific time in settings to write in your journal
            everday
          </p>
        </div>
      </header>

      <main className='relative flex w-full flex-col gap-2 px-6'>
        <span className='ml-auto font-medium underline underline-offset-1'>
          Viewing all Journals
        </span>
        <div
          className={`text-primary flex w-full flex-col gap-5 ${
            loading && 'items-center'
          }`}
        >
          {loading ? (
            <Loading />
          ) : (
            journals.map(({ _id, date, message }) => {
              return (
                <div
                  className='bg-brand h-26 max-w-full cursor-pointer rounded-lg px-4 py-4'
                  onClick={() => handleOnClickJournal({ _id, date, message })}
                  key={_id}
                >
                  <p className='text-2xl font-bold'>{formatDate(date)}</p>
                  <p className='line-clamp-1 w-full truncate'>
                    {message.slice(0, 200)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Icon
        icon='gridicons:add'
        className='text-brand absolute bottom-4 right-4 h-14 w-14 cursor-pointer z-10'
        onClick={resetJournalInfo}
      />
    </section>
  );
};

export default Main;
