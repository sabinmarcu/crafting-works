import { FormControlLabel, Switch, TextField } from '@material-ui/core';
import { ChangeEvent, FC, useCallback } from 'react';
import { useStacks } from '../../state/stack';

export const StacksEnabled: FC = () => {
  const { isEnabled, toggleEnabled } = useStacks();
  return (
    <FormControlLabel
      label="Stacks Enabled"
      control={
        <Switch checked={isEnabled} onChange={toggleEnabled} />
      }
    />
  );
};

export const StacksAmount: FC = () => {
  const { stackSize, setStackSize } = useStacks();
  const changeHandler = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(value, 10);
      if (val && !Number.isNaN(val)) {
        setStackSize(val);
      }
    },
    [setStackSize],
  );
  return (
    <TextField
      fullWidth
      label="Stack Size"
      value={stackSize}
      onChange={changeHandler}
    />
  );
};
