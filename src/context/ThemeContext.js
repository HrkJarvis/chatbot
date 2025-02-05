import { createContext, useContext } from 'react';

export const ThemeContext = createContext({
    mode: 'light',
    toggleTheme: () => {}
});

export const useThemeContext = () => useContext(ThemeContext);
