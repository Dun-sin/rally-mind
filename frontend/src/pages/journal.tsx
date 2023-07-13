import React, { useState } from 'react';

import Layout from '@/components/Layout';
import Main from '@/components/Journal/Main';
import Edit from '@/components/Journal/Edit';
import Protected from '@/components/Protected';
import { journalProps } from '@/types/Component';

const journal = () => {
  const [state, setState] = useState<'Edit' | 'Main'>('Main');
  const [journalInfo, setjournalInfo] = useState<journalProps>({
    _id: '',
    message: '',
    date: '',
  });

  return (
    <Protected>
      <Layout>
        {state === 'Main' && (
          <Main setJournalInfo={setjournalInfo} setState={setState} />
        )}
        {state === 'Edit' && (
          <Edit journalInfo={journalInfo} setState={setState} />
        )}
      </Layout>
    </Protected>
  );
};

export default journal;
