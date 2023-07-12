import { editProps } from '@/types/Component';
import React from 'react';

const Edit = ({ id }: editProps) => {
  console.log(id);
  return <div>{id}</div>;
};

export default Edit;
