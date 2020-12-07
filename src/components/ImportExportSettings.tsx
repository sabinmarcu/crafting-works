import { FC, useCallback } from 'react';
import {
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { useRecipes } from '../state/recipes-v3';
import { RecipesType } from '../utils/types';

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
