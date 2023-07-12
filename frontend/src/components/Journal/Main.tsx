import React from 'react';
import { Icon } from '@iconify/react';
import { mainProps } from '@/types/Component';

const Main = ({ setId, setState }: mainProps) => {
  const handleOnClickJournal = () => {
    setId('1dskfjsfj032ir39r2329r2r23');
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

      <main className='relative flex w-full flex-col px-6'>
        <span className='ml-auto font-medium underline underline-offset-1'>
          Viewing all Journals
        </span>
        <div className='flex w-full flex-col gap-5'>
          <div className='bg-brand h-28 max-w-full rounded-lg'>
            <p className=''>15th March 2023</p>
            <p className='line-clamp-1 w-full truncate'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              doeiusmod tempor incididunt ut labore et dolore magna aliqua.
              Utenim ad minim veniam, quis nostrud exercitation ullamco
              laborisnisi ut aliquip ex ea commodo consequat. Duis aute
              iruredolor inreprehenderit in voluptate velit esse cillum dolore
              eufugiatnulla pariatur. Excepteur sint occaecat cupidatat
              nonproident,sunt in culpa qui officia deserunt mollit anim id
              estlaborum.
            </p>
          </div>
        </div>
      </main>

      <Icon
        icon='gridicons:add'
        className='text-brand absolute bottom-2 right-4 h-14 w-14 cursor-pointer'
        onClick={() => {}}
      />
    </section>
  );
};

export default Main;
