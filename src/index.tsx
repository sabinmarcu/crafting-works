import * as React from 'react';
import { render } from 'react-dom';
import 'typeface-roboto';

import './styles.css';
import { App } from './App';
import { DrawerProvider } from './state/drawer';
import { TitleProvider } from './state/title';
import { AppThemeProvider as ThemeProvider } from './state/theme';
import { RecipeProviderV3 } from './state/recipes-v3';
import { StackProvider } from './state/stack';
import * as serviceWorker from './serviceWorker'

const rootElement = document.getElementById('root');
render(
  <ThemeProvider>
    <DrawerProvider>
      <RecipeProviderV3>
        <StackProvider>
          <TitleProvider>
            <App />
          </TitleProvider>
        </StackProvider>
      </RecipeProviderV3>
    </DrawerProvider>
  </ThemeProvider>,
  rootElement,
);

serviceWorker[
  process.env.NODE_ENV === 'production'
    ? 'register'
    : 'unregister'
]();
