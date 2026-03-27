import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NetworkScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const par = cv.parentElement;

    const W = par.clientWidth || 600;
    const H = 250;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x041228);
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 5;

    const nodes = [];
    const nGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const nC = [0x6eb5ff, 0x6ee7b7, 0xf4845f, 0x7c3aed];

    for (let i = 0; i < 20; i++) {
      const m = new THREE.Mesh(
        nGeo.clone(),
        new THREE.MeshPhongMaterial({ color: nC[i % 4], emissive: nC[i % 4], emissiveIntensity: 0.3 })
      );
      m.position.set((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 2);
      m._v = new THREE.Vector3(
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.008
      );
      nodes.push(m);
      scene.add(m);
    }

    const eGrp = new THREE.Group();
    scene.add(eGrp);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pl = new THREE.PointLight(0x6eb5ff, 2, 14);
    pl.position.set(0, 0, 4);
    scene.add(pl);

    let rafId;
    const loop = () => {
      rafId = requestAnimationFrame(loop);

      while (eGrp.children.length) eGrp.remove(eGrp.children[0]);

      nodes.forEach((n) => {
        n.position.add(n._v);
        ['x', 'y', 'z'].forEach((ax) => {
          if (Math.abs(n.position[ax]) > 3.5) n._v[ax] *= -1;
        });
        n.rotation.y += 0.01;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = nodes[i].position.distanceTo(nodes[j].position);
          if (d < 2.8) {
            const g = new THREE.BufferGeometry().setFromPoints([
              nodes[i].position.clone(),
              nodes[j].position.clone(),
            ]);
            eGrp.add(
              new THREE.Line(
                g,
                new THREE.LineBasicMaterial({ color: 0x6eb5ff, transparent: true, opacity: 1 - d / 2.8 })
              )
            );
          }
        }
      }

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
