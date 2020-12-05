import { createMuiTheme, Theme, ThemeProvider } from '@material-ui/core';
import React, {
  createContext,
  useContext,
  useCallback,
  FC,
  useMemo,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type ThemeType = 'light' | 'dark';
export type ThemeContextType = {
  theme: ThemeType,
  t: Theme,
  toggle: () => void,
};

const themes = {
  dark: createMuiTheme({ palette: { type: 'dark' } }),
  light: createMuiTheme({ palette: { type: 'light' } }),
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  t: themes.light,
  toggle: () => {},
});

export const AppThemeProvider: FC = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<ThemeType>('theme', 'light');
  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    [setTheme],
  );
  const t = useMemo(
    () => (theme ? themes[theme] : themes.light),
    [theme],
  );
  return (
    <ThemeContext.Provider value={{
      theme: theme || 'light',
      t,
      toggle: toggleTheme,
    }}
    >
      <ThemeProvider theme={t}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
