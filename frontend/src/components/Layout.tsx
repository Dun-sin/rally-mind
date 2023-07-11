import Link from 'next/link';
import * as React from 'react';

import { Icon } from '@iconify/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <span className='relative flex h-screen w-screen flex-col'>
      <section className='bg-primary h-[93%]'>{children}</section>
      <section className='border-t-brand fixed bottom-0 z-40 flex h-[7%] w-full items-center justify-center gap-16 rounded-s-md border-t-2'>
        <Link href='/home'>
          <div className='flex flex-col items-center justify-center'>
            <Icon icon='heroicons:home-solid' className='text-brand h-8 w-8' />
            <p className='-m-1 text-[0.3rem]'>Home</p>
          </div>
        </Link>
        <Link href='/journal'>
          <div className='flex flex-col items-center justify-center'>
            <Icon icon='mdi:journal' className='text-brand h-8 w-8' />
            <p className='-m-1 text-[0.3rem]'>Journal</p>
          </div>
        </Link>
        <Link href='/rank'>
          <div className='flex flex-col items-center justify-center'>
            <Icon
              icon='material-symbols:leaderboard-rounded'
              className='text-brand h-8 w-8'
            />
            <p className='-m-1 text-[0.3rem]'>Rank</p>
          </div>
        </Link>
        <Link href='/insights'>
          <div className='flex flex-col items-center justify-center'>
            <Icon icon='fluent-mdl2:insights' className='text-brand h-8 w-8' />
            <p className='-m-1 text-[0.3rem]'>Insights</p>
          </div>
        </Link>
      </section>
    </span>
  );
}
