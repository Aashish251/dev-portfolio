import { useEffect, useState } from 'react';
import BackgroundMotion from './components/BackgroundMotion';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <>
      {isLoading ? <Loader onComplete={() => setIsLoading(false)} /> : null}
      <BackgroundMotion theme={theme} />
      <CustomCursor />
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      />
      <Home animateIntro={!isLoading} />
    </>
  );
}

export default App;
