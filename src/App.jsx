import { useEffect, useState } from 'react';
import BackgroundMotion from './components/BackgroundMotion';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
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
      <ScrollProgress />
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      />
      <main id="main-content" role="main">
        <Home animateIntro={!isLoading} />
      </main>
    </>
  );
}

export default App;
