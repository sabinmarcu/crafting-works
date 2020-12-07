import { FC, useCallback } from 'react'; import {
  Button,
  Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { useTheme } from '../../state/theme';
import { ConfirmDialog, useConfirm } from '../Confirm';
import { useRecipes } from '../../state/recipes-v3';

const goHome = () => {
  // @ts-ignore
  window.location = `${window.location}`;
};

export const ResetAll: FC = () => {
  const reset = useCallback(
    () => {
      Object.keys(localStorage)
        .forEach((key) => localStorage.removeItem(key));
      goHome();
    },
    [],
  );
  const { onOpen, ...args } = useConfirm(reset);
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={onOpen}
      >
        Reset All Settings
      </Button>
      <ConfirmDialog {...args}>
        <Typography>
          Are you sure you want to reset all data?
        </Typography>
      </ConfirmDialog>
    </>
  );
};

export const ResetThemeSelection: FC = () => {
  const { reset } = useTheme();
  const { onOpen, ...args } = useConfirm(reset);
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={onOpen}
      >
        Reset Theme Selection
      </Button>
      <ConfirmDialog {...args}>
        <Typography>
          Are you sure you want to reset theme selection?
        </Typography>
      </ConfirmDialog>
    </>
  );
};

export const ResetRecipes: FC = () => {
  const { reset } = useRecipes();
  const history = useHistory();
  const onReset = useCallback(
    () => {
      reset();
      history.push('/');
    },
    [reset, history],
  );
  const { onOpen, ...args } = useConfirm(onReset);
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={onOpen}
      >
        Remove All Recipes
      </Button>
      <ConfirmDialog {...args}>
        <Typography>
          Are you sure you want to remove all stored recipes?
        </Typography>
      </ConfirmDialog>
    </>
  );
};
