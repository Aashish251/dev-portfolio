import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const par = cv.parentElement;

    const W = par.clientWidth || window.innerWidth / 2;
    const H = par.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 3.8;

    // Particles
    const N = 3200;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const pal = [
      [0.96, 0.52, 0.37],
      [0.31, 0.28, 0.9],
      [0.43, 0.71, 1],
      [0.43, 0.91, 0.72],
      [0.97, 0.78, 0.61],
    ];

    for (let i = 0; i < N; i++) {
      const phi = Math.acos(-1 + (2 * i) / N);
      const theta = Math.sqrt(N * Math.PI) * phi;
      const r = 1.5 + Math.random() * 0.4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = pal[Math.floor(Math.random() * pal.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ size: 0.022, vertexColors: true, transparent: true, opacity: 0.9 })
    );
    scene.add(pts);

    // Inner wireframe icosahedron
    const iGeo = new THREE.IcosahedronGeometry(0.85, 4);
    const iMat = new THREE.MeshPhongMaterial({ color: 0x6eb5ff, wireframe: true, opacity: 0.18, transparent: true });
    const inner = new THREE.Mesh(iGeo, iMat);
    scene.add(inner);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pl1 = new THREE.PointLight(0xf4845f, 2.5, 12);
    pl1.position.set(2, 2, 2);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0x4f46e5, 2.5, 12);
    pl2.position.set(-2, -1, 1);
    scene.add(pl2);

    let hx = 0, hy = 0, t = 0;
    const handleMove = (e) => {
      const r = par.getBoundingClientRect();
      hx = ((e.clientX - r.left) / r.width) * 2 - 1;
      hy = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    par.addEventListener('mousemove', handleMove);

    let rafId;
    const loop = () => {
      rafId = requestAnimationFrame(loop);
      t += 0.007;
      pts.rotation.y = t * 0.35 + hx * 0.05;
      pts.rotation.x = t * 0.12 + hy * 0.03;
      inner.rotation.y = -t * 0.5;
      inner.rotation.z = t * 0.25;
      renderer.render(scene, camera);
    };
    loop();

    const handleResize = () => {
      const w = par.clientWidth;
      const h = par.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      par.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas id="hero-canvas" ref={canvasRef} />;
}
