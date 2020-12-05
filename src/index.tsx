import * as React from 'react';
import { render } from 'react-dom';
import 'typeface-roboto';

import './styles.css';
import { App } from './App';
import { DrawerProvider } from './state/drawer';
import { RecipesProvider } from './state/recipes';
import { TitleProvider } from './state/title';
import { Provider as RecipesV2 } from './state/recipes-v2';

const rootElement = document.getElementById('root');
render(
  <DrawerProvider>
    <RecipesV2>
      <RecipesProvider>
        <TitleProvider>
          <App />
        </TitleProvider>
      </RecipesProvider>
    </RecipesV2>
  </DrawerProvider>,
  rootElement,
);
