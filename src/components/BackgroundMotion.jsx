import { useEffect, useRef, memo } from 'react';

/**
 * Advanced aurora / constellation background
 * - Flowing RGB aurora bands with simplex-noise-style motion
 * - Connected particle constellation with edge glow
 * - Reactive to mouse parallax
 * - Automatic palette swap for light / dark
 */
function BackgroundMotion({ theme = 'dark' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const light = theme === 'light';
    const isMobile = window.innerWidth < 768;
    let W = 0;
    let H = 0;
    let animId = 0;
    let mx = 0.5;
    let my = 0.5;
    let time = 0;

    /* ── cheap 2D noise (value-noise via hash) ── */
    const perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) perm[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + t * (b - a);
    const grad = (hash, x, y) => {
      const h = hash & 3;
      const u = h < 2 ? x : -x;
      const v = h === 0 || h === 3 ? y : -y;
      return u + v;
    };
    const noise2d = (x, y) => {
      const xi = Math.floor(x) & 255;
      const yi = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const u = fade(xf);
      const v = fade(yf);
      const aa = perm[perm[xi] + yi];
      const ab = perm[perm[xi] + yi + 1];
      const ba = perm[perm[xi + 1] + yi];
      const bb = perm[perm[xi + 1] + yi + 1];
      return lerp(
        lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
        lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
        v
      );
    };

    /* ── particles (constellation) ── */
    const COUNT = isMobile ? 36 : 72;
    const EDGE_DIST = isMobile ? 140 : 180;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: 1.2 + Math.random() * 1.8,
      hue: Math.floor(Math.random() * 4),
    }));

    const darkPalette = [
      [201, 167, 124],   // gold
      [110, 113, 247],   // violet
      [136, 214, 199],   // mint
      [213, 116, 92],    // rose
    ];
    const lightPalette = [
      [180, 140, 90],
      [90, 92, 210],
      [80, 170, 150],
      [190, 100, 80],
    ];

    /* ── resize ── */
    let resizeTimer;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    };

    const handleMove = (e) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };

    /* ── render loop ── */
    const render = () => {
      time += 0.003;
      ctx.clearRect(0, 0, W, H);

      const pal = light ? lightPalette : darkPalette;

      /* ── 1. Aurora bands ── */
      const bandCount = isMobile ? 3 : 5;
      for (let b = 0; b < bandCount; b++) {
        const yOffset = (b / bandCount) * H;
        const col = pal[b % pal.length];
        const alpha = light ? 0.06 : 0.08;

        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let px = 0; px <= W; px += 6) {
          const nx = px / W * 3 + time * (0.5 + b * 0.15);
          const ny = b * 1.7 + time * 0.4;
          const n = noise2d(nx, ny);
          const wave = n * H * 0.18 + Math.sin(px * 0.003 + time * 2 + b) * H * 0.06;
          const y = yOffset + H * 0.15 + wave + (my - 0.5) * 30 * (b + 1) * 0.3;
          ctx.lineTo(px, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, yOffset, 0, yOffset + H * 0.5);
        grad.addColorStop(0, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha})`);
        grad.addColorStop(0.5, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      /* ── 2. Mouse-reactive glow ── */
      const gx = mx * W;
      const gy = my * H;
      const glowR = Math.max(W, H) * 0.45;
      const glow = ctx.createRadialGradient(gx, gy, 20, gx, gy, glowR);
      glow.addColorStop(0, light ? 'rgba(201, 167, 124, 0.07)' : 'rgba(201, 167, 124, 0.06)');
      glow.addColorStop(0.4, light ? 'rgba(110, 113, 247, 0.03)' : 'rgba(110, 113, 247, 0.04)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      /* ── 3. Constellation particles + edges ── */
      particles.forEach((p) => {
        // Noise-driven drift
        const nx = noise2d(p.x * 2 + time, p.y * 2) * 0.3;
        const ny = noise2d(p.x * 2, p.y * 2 + time) * 0.3;
        p.x += (p.vx + nx) * 0.0014;
        p.y += (p.vy + ny) * 0.0014;

        // Mouse attraction
        p.x += (mx - p.x) * 0.0004;
        p.y += (my - p.y) * 0.0004;

        // Wrap
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;
      });

      // Draw edges
      const edgeAlphaBase = light ? 0.07 : 0.1;
      for (let i = 0; i < COUNT; i++) {
        const a = particles[i];
        const ax = a.x * W;
        const ay = a.y * H;
        for (let j = i + 1; j < COUNT; j++) {
          const b = particles[j];
          const bx = b.x * W;
          const by = b.y * H;
          const dx = ax - bx;
          const dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < EDGE_DIST) {
            const alpha = (1 - dist / EDGE_DIST) * edgeAlphaBase;
            const col = pal[a.hue];
            ctx.strokeStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      particles.forEach((p) => {
        const px = p.x * W;
        const py = p.y * H;
        const col = pal[p.hue];
        const dotAlpha = light ? 0.25 : 0.4;

        // Outer glow
        const dg = ctx.createRadialGradient(px, py, 0, px, py, p.r * 12);
        dg.addColorStop(0, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${dotAlpha * 0.3})`);
        dg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.arc(px, py, p.r * 12, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${dotAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      /* ── 4. Pulsing orbs (large and slow) ── */
      const orbCount = isMobile ? 2 : 3;
      for (let i = 0; i < orbCount; i++) {
        const col = pal[i % pal.length];
        const ox = W * (0.2 + i * 0.3) + Math.sin(time * 0.7 + i * 2) * W * 0.08;
        const oy = H * (0.3 + i * 0.18) + Math.cos(time * 0.5 + i * 3) * H * 0.06;
        const pulse = 0.8 + Math.sin(time * 1.5 + i * 1.2) * 0.2;
        const radius = (isMobile ? 100 : 180) * pulse;
        const orbAlpha = light ? 0.04 : 0.06;

        const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, radius);
        og.addColorStop(0, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${orbAlpha})`);
        og.addColorStop(0.6, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${orbAlpha * 0.3})`);
        og.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = og;
        ctx.beginPath();
        ctx.arc(ox, oy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('mousemove', handleMove, { passive: true });

    return () => {
      clearTimeout(resizeTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('mousemove', handleMove);
    };
  }, [theme]);

  return <canvas className="background-motion" ref={canvasRef} aria-hidden="true" />;
}

export default memo(BackgroundMotion);
