import React, { useEffect, useRef } from 'react';

import logger from '@/lib/logger';
import { Icon } from '@iconify/react';
import { editProps } from '@/types/Component';
import {
  checkStreak,
  formatDate,
  getCurrentDate,
  getFromLocalStorage,
} from '@/lib/helper';

let type: 'Add' | 'View';
let date: string;

const Edit = ({ journalInfo, setState }: editProps) => {
  if (journalInfo._id === '') {
    type = 'Add';
    date = getCurrentDate();
  } else {
    type = 'View';
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    const text = textareaRef.current?.value;
    if (date === '') return;
    if (text === '' || text === undefined) return;

    const journal = {
      date,
      message: text,
    };

    try {
      const response = await fetch(
        'http://localhost:4000/api/users/updateJournal',
        {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${getFromLocalStorage('token')}`,
          },
          body: JSON.stringify({
            email: getFromLocalStorage('email'),
            journal,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        logger(data.message);
        checkStreak();
        setState('Main');
      } else {
        logger(`Couldn't add journal`);
      }
    } catch (error) {
      logger(error, 'Error');
    }
  };

  useEffect(() => {
    if (type === 'View') {
      if (textareaRef.current === null) return;
      textareaRef.current.value = journalInfo.message;
    }
  }, []);

  return (
    <section className='h-full w-full'>
      <header className='bg-brand flex h-[14%] w-full flex-col justify-between rounded-b-2xl px-4 py-3'>
        <div className='flex items-center justify-between'>
          <Icon
            icon='ion:arrow-back'
            className='text-primary h-8 w-8 cursor-pointer'
            onClick={() => setState('Main')}
          />
          <div className='flex items-center gap-3'>
            <Icon
              icon='mingcute:information-fill'
              className='text-primary h-8 w-8 cursor-pointer'
            />
            <Icon
              icon='material-symbols:done-rounded'
              className='text-primary h-8 w-8 cursor-pointer'
              onClick={handleSubmit}
            />
          </div>
        </div>
        <h2 className='text-primary text-2xl'>
          {type === 'Add' ? formatDate(date) : formatDate(journalInfo.date)}
        </h2>
      </header>
      <textarea
        className='h-[86%] w-full border-none px-4 text-lg focus:ring-0'
        placeholder='Click here to write....'
        ref={textareaRef}
      />
    </section>
  );
};

export default Edit;
