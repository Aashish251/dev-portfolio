import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NeonCityScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const par = cv.parentElement;

    const W = par.clientWidth || 600;
    const H = 250;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x0a0018);
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 3.5, 7);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.GridHelper(20, 20, 0x4f46e5, 0x1a0b4e));

    const bc = [0xf4845f, 0x4f46e5, 0x6eb5ff, 0x7c3aed, 0x6ee7b7];
    for (let i = 0; i < 28; i++) {
      const bh = 0.4 + Math.random() * 2.8;
      const g = new THREE.BoxGeometry(0.45, 0.45 + bh, 0.45);
      const m = new THREE.MeshPhongMaterial({
        color: bc[i % 5],
        wireframe: Math.random() > 0.45,
        transparent: true,
        opacity: 0.65 + Math.random() * 0.3,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set((Math.random() - 0.5) * 9, bh / 2, (Math.random() - 0.5) * 9);
      scene.add(mesh);
    }

    // Particles
    const pP = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      pP[i * 3] = (Math.random() - 0.5) * 18;
      pP[i * 3 + 1] = Math.random() * 5;
      pP[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const pG = new THREE.BufferGeometry();
    pG.setAttribute('position', new THREE.BufferAttribute(pP, 3));
    scene.add(
      new THREE.Points(
        pG,
        new THREE.PointsMaterial({ color: 0x6eb5ff, size: 0.07, transparent: true, opacity: 0.55 })
      )
    );

    scene.add(new THREE.AmbientLight(0x4f46e5, 0.5));
    const dl = new THREE.DirectionalLight(0xf4845f, 1.5);
    dl.position.set(5, 8, 5);
    scene.add(dl);

    let t = 0;
    let rafId;
    const loop = () => {
      rafId = requestAnimationFrame(loop);
      t += 0.004;
      camera.position.x = Math.sin(t) * 0.6;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
