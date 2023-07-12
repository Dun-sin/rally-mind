import React, { useState } from 'react';

import Layout from '@/components/Layout';
import Protected from '@/components/Protected';
import Main from '@/components/Journal/Main';
import Edit from '@/components/Journal/Edit';

const journal = () => {
  const [state, setState] = useState<'Edit' | 'Main'>('Main');
  const [journalId, setjournalId] = useState<string>('');

  return (
    <Protected>
      <Layout>
        {state === 'Main' && <Main setId={setjournalId} setState={setState} />}
        {(state === 'Edit' || journalId === '') && <Edit id={journalId} />}
      </Layout>
    </Protected>
  );
};

export default journal;
