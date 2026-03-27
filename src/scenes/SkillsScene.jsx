import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SkillsScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const par = cv.parentElement;

    const W = par.clientWidth || 480;
    const H = par.clientHeight || 440;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x1a0b2e);
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 6;

    const grp = new THREE.Group();
    const N = 120;
    const pal = [0xf4845f, 0x4f46e5, 0x6ee7b7, 0xf9c89b, 0x7c3aed];

    // DNA helix strands
    for (let s = 0; s < 2; s++) {
      const pts = [];
      for (let i = 0; i < N; i++) {
        const t2 = i / N;
        const a = t2 * Math.PI * 4 + s * Math.PI;
        pts.push(new THREE.Vector3(Math.cos(a) * 1.3, (t2 - 0.5) * 7, Math.sin(a) * 1.3));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const tGeo = new THREE.TubeGeometry(curve, 220, 0.04, 8, false);
      grp.add(
        new THREE.Mesh(
          tGeo,
          new THREE.MeshPhongMaterial({ color: s ? 0x4f46e5 : 0xf4845f, shininess: 80 })
        )
      );
    }

    // Cross-links
    for (let i = 0; i < 22; i++) {
      const t2 = i / 22;
      const a = t2 * Math.PI * 4;
      const y = (t2 - 0.5) * 7;
      const p1 = new THREE.Vector3(Math.cos(a) * 1.3, y, Math.sin(a) * 1.3);
      const p2 = new THREE.Vector3(Math.cos(a + Math.PI) * 1.3, y, Math.sin(a + Math.PI) * 1.3);
      const lc = new THREE.CatmullRomCurve3([p1, p2]);
      grp.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(lc, 4, 0.025, 6, false),
          new THREE.MeshPhongMaterial({ color: pal[i % 5], shininess: 60 })
        )
      );
      [p1, p2].forEach((p) => {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 8, 8),
          new THREE.MeshPhongMaterial({ color: pal[i % 5] })
        );
        m.position.copy(p);
        grp.add(m);
      });
    }

    scene.add(grp);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dl = new THREE.DirectionalLight(0xffffff, 1.2);
    dl.position.set(3, 5, 3);
    scene.add(dl);
    const pl = new THREE.PointLight(0xf4845f, 1.5, 12);
    pl.position.set(-2, 0, 2);
    scene.add(pl);

    let mxS = 0, t = 0;
    const handleMove = (e) => {
      const r = par.getBoundingClientRect();
      mxS = ((e.clientX - r.left) / r.width) * 2 - 1;
    };
    par.addEventListener('mousemove', handleMove);

    let rafId;
    const loop = () => {
      rafId = requestAnimationFrame(loop);
      t += 0.006;
      grp.rotation.y = t + mxS * 0.4;
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

  return <canvas id="skills-canvas" ref={canvasRef} />;
}
