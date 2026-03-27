export default function Navbar() {
  const handleClick = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav id="main-nav">
      <div className="n-logo">AR<span>.</span></div>
      <div className="n-links">
        <a href="#about" onClick={(e) => handleClick(e, '#about')}>About</a>
        <a href="#experience" onClick={(e) => handleClick(e, '#experience')}>Work</a>
        <a href="#projects" onClick={(e) => handleClick(e, '#projects')}>Projects</a>
        <a href="#contact" onClick={(e) => handleClick(e, '#contact')}>Contact</a>
      </div>
    </nav>
  );
}
