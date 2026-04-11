import { useEffect, useRef, useState } from 'react';

const setTranslate = (el, x, y) => {
  if (!el) return;
  el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
};

/** Desktop-only: mounts only when parent decides coarse pointer is false — effect deps stay `[]`. */
function CustomCursorInner() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
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
      setTranslate(dotRef.current, mouseX, mouseY);
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
      setTranslate(ringRef.current, ringX, ringY);
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

  return (
    <>
      <div id="c-dot" ref={dotRef}></div>
      <div id="c-ring" ref={ringRef}>
        <span className="cursor-label" ref={labelRef}></span>
      </div>
    </>
  );
}

export default function CustomCursor() {
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );

  if (isTouch) return null;
  return <CustomCursorInner />;
}
