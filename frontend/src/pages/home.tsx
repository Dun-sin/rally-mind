import React from 'react';
import Protected from '@/components/Protected';

const home = () => {
  return (
    <Protected>
      <div>home</div>
    </Protected>
  );
};

export default home;
