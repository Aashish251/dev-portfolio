import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const fillRef = useRef(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 16;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          gsap.to(loaderRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: 'power4.inOut',
            onComplete: () => onComplete?.(),
          });
        }, 350);
      }
      setPct(Math.floor(current));
      if (fillRef.current) {
        fillRef.current.style.width = current + '%';
      }
    }, 75);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div id="loader" ref={loaderRef}>
      <div className="l-title">
        Aashish<br /><span>Ravidas</span>
      </div>
      <div className="l-track">
        <div className="l-fill" ref={fillRef}></div>
      </div>
      <div className="l-pct">{pct}%</div>
    </div>
  );
}
