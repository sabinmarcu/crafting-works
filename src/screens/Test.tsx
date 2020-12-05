import React, { FC } from 'react';
import { Title } from '../state/title';
import { useLocalStorageObject } from '../hooks/useLocalStorageObject';

const initial = {
  somewhat: false,
  this: {
    is: 'awesome',
    with: {
      a: { list: [1, 2, 3] },
      and: {
        a: {
          nested: [{ list: 1 }, { thing: 2 }],
        },
      },
    },
  },
};

const changed = {
  diffed: {
    is: {
      an: [{ awesome: 'thing ' }],
      schweet: 'awesome',
    },
  },
  this: {
    is: 'shite',
    with: {
      a: { list: [1, 5, 8, 4] },
      and: {
        a: {
          nested: [{ list: 31 }, { thing: 2 }],
        },
      },
    },
  },
};

export const TestScreen: FC = () => {
  const [value, setValue] = useLocalStorageObject('test', initial);
  console.log(value);
  return (
    <>
      <Title>Test Screen</Title>
      <code style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(value, undefined, 2)}
      </code>
      <button
        type="button"
        onClick={() => setValue(changed)}
      >
        Change
      </button>
    </>
  );
};

export default TestScreen;
