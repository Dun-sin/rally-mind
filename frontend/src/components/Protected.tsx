import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import logger from '@/lib/logger';
import { getFromLocalStorage } from '@/lib/helper';
import { protectedProps } from '@/types/Component';

const Protected = ({ children }: protectedProps) => {
  // const router = useRouter();

  // const fetchData = async (token: string) => {
  //   try {
  //     const response = await fetch(
  //       'http://localhost:4000/api/users/protected',
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const data = await response.json();
  //     response.ok ? logger(data.message) : router.push('/');
  //   } catch (error) {
  //     logger(error, 'Error');
  //   }
  // };

  // useEffect(() => {
  //   const token = getFromLocalStorage('token');

  //   token ? fetchData(token) : router.push('/');
  // });
  return <>{children}</>;
};

export default Protected;
