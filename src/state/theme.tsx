import { createMuiTheme, Theme, ThemeProvider } from '@material-ui/core';
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
  toggle: () => void,
  reset: () => void,
};

const themes = {
  dark: createMuiTheme({ palette: { type: 'dark' } }),
  light: createMuiTheme({ palette: { type: 'light' } }),
};

const defaultTheme = 'dark';

export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  t: themes[defaultTheme],
  toggle: () => {},
  reset: () => {},
});

export const AppThemeProvider: FC = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<ThemeType>('theme', defaultTheme);
  const [hasUserSelect, setHasUserSelect] = useLocalStorage<boolean>('theme-select');
  const toggleTheme = useCallback(
    () => {
      setHasUserSelect(true);
      setTheme((t) => (t === 'light' ? 'dark' : 'light'));
    },
    [setTheme, setHasUserSelect],
  );
  const t = useMemo(
    () => (theme ? themes[theme] : themes.light),
    [theme],
  );
  const isLight = useMatchMedia('(prefers-color-scheme: light)');
  const isDark = useMatchMedia('(prefers-color-scheme: dark)');
  useEffect(
    () => {
      if (!hasUserSelect) {
        if (isLight) {
          setTheme('light');
        } else if (isDark) {
          setTheme('dark');
        } else {
          setTheme(defaultTheme);
        }
      }
    },
    [theme, hasUserSelect, isLight, isDark, setTheme],
  );
  const reset = useCallback(
    () => {
      setHasUserSelect(undefined);
    },
    [setHasUserSelect],
  );

  return (
    <ThemeContext.Provider value={{
      theme: theme || 'light',
      t,
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
