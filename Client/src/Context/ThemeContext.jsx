import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultState = {
  dark: false,
  toggleDark: () => {},
};

const ThemeContext = createContext(defaultState);

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false); 

 
  useEffect(() => {
    const isDark = localStorage.getItem('darkTheme') === 'true';
    setDark(isDark);
  }, []);

  useEffect(() => {
   
    document.body.classList.toggle('dark-theme', dark);

    localStorage.setItem('darkTheme', dark.toString());
  }, [dark]); 

  const toggleDark = () => {
    setDark(!dark); 
  };
  const setTheme = (isDark) => {
    localStorage.setItem('darkTheme', JSON.stringify(isDark));
    setDark(isDark);
  };
  return (
    <ThemeContext.Provider value={{ dark, toggleDark, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}
