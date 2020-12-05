import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from '@material-ui/core';
import React, {
  FC,
  ChangeEvent,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { makeList } from '../state/list';

type DataType = { text: string };

const {
  Provider,
  useValues,
  useItem,
  useControls,
  List,
} = makeList<DataType>('test');

const MenuActions: FC = () => {
  const { addItem } = useControls();
  const [item, setItem] = useState('');
  const handler = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setItem(value),
    [setItem],
  );
  const add = useCallback(
    () => {
      addItem(item);
      setItem('');
    },
    [setItem, item, addItem],
  );
  return (
    <CardActions>
      <TextField
        fullWidth
        value={item}
        onChange={handler}
        label="New Item ID"
      />
      <Button variant="contained" color="primary" onClick={add}>Add</Button>
    </CardActions>
  );
};

const Menu: FC = () => {
  const values = useValues();
  return (
    <Card>
      <CardHeader title="values" />
      <CardContent>
        <code style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(values, undefined, 2)}
        </code>
      </CardContent>
      <MenuActions />
    </Card>
  );
};

const Item: FC<{ item: string }> = ({
  item: rawKey,
}) => {
  const [{
    value: item,
    key,
  }, {
    set: setItem,
    remove: removeItem,
  }] = useItem(rawKey);
  const [value, setValue] = useState<string>();
  useEffect(
    () => {
      if (!value && item?.text) {
        setValue(item.text);
      }
    },
    [value, item],
  );
  const change = useCallback(
    ({ target: { value: val } }: ChangeEvent<HTMLInputElement>) => {
      setValue(val);
    },
    [setValue],
  );
  useEffect(
    () => {
      if (typeof value !== 'undefined') {
        setItem({ text: value });
      }
    },
    [value, setItem],
  );
  return (
    <Card>
      <CardHeader title={key} />
      <CardContent>
        <code style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(item, undefined, 0)}
        </code>
      </CardContent>
      <CardActions>
        <TextField
          value={value}
          onChange={change}
          label="Value"
          fullWidth
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={removeItem}
        >
          Remove
        </Button>

      </CardActions>
    </Card>
  );
};

export const ListScreen: FC = () => (
  <Provider>
    <div style={{
      display: 'flex',
      padding: 25,
      flexFlow: 'column nowrap',
    }}
    >
      <Menu />
      <div style={{
        display: 'grid',
        padding: '25px 0',
        gridGap: 25,
        gridTemplateColumns: '1fr 1fr',
      }}
      >
        <List>
          {(items: string[]) => items.map((it) => <Item item={it} key={it} />)}
        </List>
      </div>
    </div>
  </Provider>
);

export default ListScreen;
