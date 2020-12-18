import React, { FC } from 'react';
import { Title } from '../state/title';
import { useLocalStorageObject } from '../hooks/useLocalStorageObject';

import seedData from '../config/seed';

export const TestScreen: FC = () => {
  const [value] = useLocalStorageObject('test', seedData);
  return (
    <>
      <Title>Test Screen</Title>
      <code style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(value, undefined, 2)}
      </code>
    </>
  );
};
