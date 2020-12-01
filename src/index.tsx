import * as React from 'react';
import { render } from 'react-dom';
import 'typeface-roboto';

import './styles.css';
import { App } from './App';
import { DrawerProvider } from './state/drawer';
import { RecipesProvider } from './state/recipes';
import { TitleProvider } from './state/title';

const rootElement = document.getElementById('root');
render(
  <DrawerProvider>
    <RecipesProvider>
      <TitleProvider>
        <App />
      </TitleProvider>
    </RecipesProvider>
  </DrawerProvider>,
  rootElement,
);
