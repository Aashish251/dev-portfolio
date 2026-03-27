import { useState } from 'react';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? <Loader onComplete={() => setIsLoading(false)} /> : null}
      <CustomCursor />
      <Navbar />
      <Home animateIntro={!isLoading} />
    </>
  );
}

export default App;
