import React, { useEffect, useState } from 'react';

import { rank } from '@/types/User';
import Layout from '@/components/Layout';

import { Icon } from '@iconify/react';
import logger from '@/lib/logger';
import Loading from '@/components/Loading';

const Rank: React.FC = () => {
  const [ranks, setRanks] = useState<rank>({
    top3: [],
    others: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsersRank();
  }, []);

  async function getUsersRank() {
    try {
      const response = await fetch(
        'https://rally-mind.onrender.com/api/user/rank'
      );
      const data = await response.json();

      if (response.ok) {
        setRanks({ top3: data.message.top3, others: data.message.others });
        logger(
          { top3: data.message.top3, others: data.message.others },
          'ranks'
        );
      } else {
        logger(data);
      }
    } catch (error) {
      logger(error);
    }

    setLoading(false);
  }

  return (
    <Layout>
      <section className='h-full w-full flex-col'>
        <header className='bg-brand flex h-[10%] w-full items-center rounded-b-2xl px-4 py-3'>
          <h2 className='text-primary text-3xl'>LeaderBoard</h2>
          {/* <Icon
            icon='mingcute:information-fill'
            className='text-primary h-8 w-8 cursor-pointer'
          /> */}
        </header>
        <main className='h-[90%] w-full px-4 py-6 text-xl'>
          <div className='flex items-center justify-between'>
            <div className='bg-brand h-1 w-[40%]' />
            <span>Top 3👇🏾</span>
            <div className='bg-brand h-1 w-[40%]' />
          </div>
          <ul>
            {loading ? (
              <Loading />
            ) : (
              ranks.top3.map(({ name, points }) => {
                return (
                  <li className='flex justify-between' key={name}>
                    <span className='font-semibold'>{name}</span>
                    <span>{points}pt</span>
                  </li>
                );
              })
            )}
          </ul>
          <div className='mt-2 flex items-center justify-between'>
            <div className='bg-brand h-1 w-[40%]' />
            <span>Others👇🏾</span>
            <div className='bg-brand h-1 w-[40%]' />
          </div>
          <ol>
            {loading ? (
              <Loading />
            ) : (
              ranks.others.map(({ name, points }) => {
                return (
                  <li className='flex justify-between' key={name}>
                    <span className='font-semibold'>{name}</span>
                    <span>{points}pt</span>
                  </li>
                );
              })
            )}
          </ol>
        </main>
      </section>
    </Layout>
  );
};

export default Rank;
