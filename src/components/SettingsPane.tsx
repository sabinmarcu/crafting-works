import { Button, Container, Typography } from '@material-ui/core';
import { FC, useCallback } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { useRecipes } from '../state/recipes-v3';

import { useTheme } from '../state/theme';
import { RecipesType } from '../utils/types';
import { ConfirmDialog, useConfirm } from './Confirm';

const StyledContainer = styled(Container)`
  margin: 1.5rem 0 !important;
`;

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

const readFile = (file: File) => new Promise<RecipesType>((accept, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      if (!reader.result) {
        throw new Error('Empty Data');
      }
      if (reader.result instanceof ArrayBuffer) {
        throw new Error('Got an Array Buffer?');
      }
      const data = JSON.parse(reader.result) as RecipesType;
      accept(data);
    } catch (e) {
      reject(e);
    }
  };
  reader.readAsText(file);
});

export const Import: FC = () => {
  const { import: importFunc } = useRecipes();
  const history = useHistory();
  const onSubmit = useCallback(
    () => {
      const el = document.createElement('input');
      el.type = 'file';
      document.body.appendChild(el);
      el.addEventListener(
        'change',
        async () => {
          const { files } = el;
          if (files && files.length > 0) {
            const results = (
              await Promise.all(
                Array.from(files).map(readFile),
              )
            ).reduce((prev, it) => ({
              ...prev,
              ...it,
            }), {}) as RecipesType;
            importFunc(results);
            history.push('/');
          }
        },
      );
      el.click();
      document.body.removeChild(el);
    },
    [importFunc, history],
  );
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={onSubmit}
      >
        Import
      </Button>
    </>
  );
};

export const Export: FC = () => {
  const { recipes } = useRecipes();
  const onSubmit = useCallback(
    () => {
      const blob = new Blob(
        [
          JSON.stringify(recipes, undefined, 2),
        ],
        { type: 'application/json' },
      );
      const obj = window.URL.createObjectURL(blob);
      const el = document.createElement('a');
      el.style.display = 'none';
      el.href = obj;
      el.download = 'export.json';
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    },
    [recipes],
  );
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={onSubmit}
      >
        Export
      </Button>
    </>
  );
};

export const Section = styled.section`
  display: flex;
  flex-flow: row nowrap;
  & > * {
    margin: 5px !important;
  }
`;

export const SettingsView: FC = () => (
  <StyledContainer>
    <Section>
      <Import />
      <Export />
    </Section>
    <Section>
      <ResetAll />
      <ResetRecipes />
      <ResetThemeSelection />
    </Section>
  </StyledContainer>
);

export default SettingsView;
