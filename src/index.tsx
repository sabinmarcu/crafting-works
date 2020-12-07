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
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration[
  process.env.NODE_ENV === 'production'
    ? 'register'
    : 'unregister'
]();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line no-console
reportWebVitals(console.log);
