import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.set(dotRef.current, { x: mx, y: my });
    };

    window.addEventListener('mousemove', handleMouseMove);

    let raf;
    const track = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      gsap.set(ringRef.current, { x: rx, y: ry });
      raf = requestAnimationFrame(track);
    };
    track();

    // Enlarge ring on interactive elements
    const addBig = () => ringRef.current?.classList.add('big');
    const removeBig = () => ringRef.current?.classList.remove('big');

    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, .proj-card, .sk-row, .ach-card').forEach(el => {
        el.removeEventListener('mouseenter', addBig);
        el.removeEventListener('mouseleave', removeBig);
        el.addEventListener('mouseenter', addBig);
        el.addEventListener('mouseleave', removeBig);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial bind
    document.querySelectorAll('a, button, .proj-card, .sk-row, .ach-card').forEach(el => {
      el.addEventListener('mouseenter', addBig);
      el.addEventListener('mouseleave', removeBig);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id="c-dot" ref={dotRef}></div>
      <div id="c-ring" ref={ringRef}></div>
    </>
  );
}
