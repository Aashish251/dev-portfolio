import { memo, useState, useCallback, useEffect } from 'react';
import { Moon, SunMedium, Menu, X } from 'lucide-react';

function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = useCallback((e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    const section = document.querySelector(id);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', id);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav id="main-nav" aria-label="Primary navigation">
      <div className="n-logo">AR<span>.</span></div>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="nav-burger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay for mobile */}
      {menuOpen && (
        <div className="nav-overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      <div className={`n-links${menuOpen ? ' open' : ''}`}>
        <a href="#about" onClick={(e) => handleClick(e, '#about')}>About</a>
        <a href="#experience" onClick={(e) => handleClick(e, '#experience')}>Work</a>
        <a href="#projects" onClick={(e) => handleClick(e, '#projects')}>Projects</a>
        <a href="#skills" onClick={(e) => handleClick(e, '#skills')}>Skills</a>
        <a href="#contact" onClick={(e) => handleClick(e, '#contact')}>Contact</a>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={theme === 'light'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </nav>
  );
}

export default memo(Navbar);
