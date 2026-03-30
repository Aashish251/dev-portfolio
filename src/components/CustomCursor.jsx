import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device — skip cursor entirely
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (hasCoarsePointer) {
      setIsTouch(true);
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const setMode = (modeText = '') => {
      if (!ringRef.current || !labelRef.current) return;

      ringRef.current.classList.remove('big', 'view');
      labelRef.current.textContent = '';

      if (!modeText) return;

      ringRef.current.classList.add(modeText === 'View' ? 'view' : 'big');
      labelRef.current.textContent = modeText;
    };

    const handleMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      gsap.set(dotRef.current, { x: mouseX, y: mouseY });
    };

    const handleOver = (event) => {
      const target = event.target.closest('a, button, [data-cursor], .proj-card, .sk-row, .ach-card');
      if (!target) return;

      const modeText = target.getAttribute('data-cursor') || '';
      setMode(modeText || ' ');

      if (!modeText && ringRef.current) {
        ringRef.current.classList.add('big');
      }
    };

    const handleOut = (event) => {
      const target = event.target.closest('a, button, [data-cursor], .proj-card, .sk-row, .ach-card');
      if (!target) return;
      setMode('');
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    let rafId = 0;
    const loop = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      gsap.set(ringRef.current, { x: ringX, y: ringY });
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Don't render cursor elements on touch devices at all
  if (isTouch) return null;

  return (
    <>
      <div id="c-dot" ref={dotRef}></div>
      <div id="c-ring" ref={ringRef}>
        <span className="cursor-label" ref={labelRef}></span>
      </div>
    </>
  );
}
