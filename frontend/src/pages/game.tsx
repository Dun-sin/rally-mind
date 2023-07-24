import Layout from '@/components/Layout';
import Protected from '@/components/Protected';
import React from 'react';

import { Icon } from '@iconify/react';
import SnakeGame from '@/components/Game/SnakeGame';

const game = () => {
  return (
    <Protected>
      <Layout>
        <section className='h-full w-full flex-col'>
          <header className='bg-brand flex h-[8%] w-full items-center justify-between rounded-b-2xl px-4 py-3'>
            <h2 className='text-primary text-3xl'>Game</h2>
            <Icon
              icon='mingcute:information-fill'
              className='text-primary h-8 w-8 cursor-pointer'
            />
          </header>
          <main className='flex h-[92%] w-full flex-col items-center justify-center px-4 py-6 text-xl'>
            <SnakeGame />
          </main>
        </section>
      </Layout>
    </Protected>
  );
};

export default game;
