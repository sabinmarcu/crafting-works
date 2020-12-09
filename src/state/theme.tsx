import {
  createMuiTheme,
  Theme,
  ThemeProvider,
} from '@material-ui/core';
import React, {
  createContext,
  useContext,
  useCallback,
  FC,
  useMemo,
  useEffect,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMatchMedia } from '../hooks/useMatchMedia';

export type ThemeType = 'light' | 'dark';
export type ThemeContextType = {
  theme: ThemeType,
  t: Theme,
  ti: Theme,
  toggle: () => void,
  reset: () => void,
};

const themes = {
  dark: createMuiTheme({
    palette: {
      type: 'dark',
    },
  }),
  light: createMuiTheme({
    palette: {
      type: 'light',
      background: {
        default: 'rgb(230, 230, 230)',
      },
    },
  }),
};

const defaultTheme = 'dark';
const invertTheme = (t: string) => (t === 'dark' ? 'light' : 'dark');
const defaultInvertedTheme = 'light';

export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  t: themes[defaultTheme],
  ti: themes[defaultInvertedTheme],
  toggle: () => {},
  reset: () => {},
});

export const AppThemeProvider: FC = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<ThemeType>('theme', defaultTheme);
  const [hasMediaDetection, setHasMediaDetection] = useLocalStorage<boolean>('theme-select', true);
  const toggleTheme = useCallback(
    () => {
      setHasMediaDetection(false);
      setTheme((t) => (t === 'light' ? 'dark' : 'light'));
    },
    [setTheme, setHasMediaDetection],
  );
  const t = useMemo(
    () => (theme ? themes[theme] : themes[defaultTheme]),
    [theme],
  );
  const ti = useMemo(
    () => (theme ? themes[invertTheme(theme)] : themes[defaultInvertedTheme]),
    [theme],
  );
  const isLight = useMatchMedia('(prefers-color-scheme: light)');
  const isDark = useMatchMedia('(prefers-color-scheme: dark)');
  useEffect(
    () => {
      if (hasMediaDetection) {
        if (isLight) {
          setTheme('light');
        } else if (isDark) {
          setTheme('dark');
        } else {
          setTheme(defaultTheme);
        }
      }
    },
    [theme, hasMediaDetection, isLight, isDark, setTheme],
  );
  const reset = useCallback(
    () => {
      setHasMediaDetection(true);
    },
    [setHasMediaDetection],
  );

  return (
    <ThemeContext.Provider value={{
      theme: theme || 'light',
      t,
      ti,
      toggle: toggleTheme,
      reset,
    }}
    >
      <ThemeProvider theme={t}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
