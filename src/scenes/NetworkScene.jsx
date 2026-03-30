import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NetworkScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const par = cv.parentElement;

    const W = par.clientWidth || 600;
    const H = par.clientHeight || 250;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0x041228);
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 5;

    const nodes = [];
    const nGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const nC = [0x6eb5ff, 0x6ee7b7, 0xf4845f, 0x7c3aed];

    // Pre-create shared materials
    const nodeMaterials = nC.map(
      (c) => new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.3 })
    );

    for (let i = 0; i < 20; i++) {
      const m = new THREE.Mesh(nGeo, nodeMaterials[i % 4]);
      m.position.set(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 2
      );
      m._v = new THREE.Vector3(
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.008
      );
      nodes.push(m);
      scene.add(m);
    }

    // Pre-allocate line geometry with a pool to avoid GC churn
    const maxEdges = (20 * 19) / 2;
    const edgePositions = new Float32Array(maxEdges * 6);
    const edgeGeometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(edgePositions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    edgeGeometry.setAttribute('position', posAttr);

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x6eb5ff,
      transparent: true,
      opacity: 0.4,
    });
    const edgeMesh = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    scene.add(edgeMesh);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pl = new THREE.PointLight(0x6eb5ff, 2, 14);
    pl.position.set(0, 0, 4);
    scene.add(pl);

    let rafId;
    const loop = () => {
      rafId = requestAnimationFrame(loop);

      let edgeIndex = 0;
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
            const base = edgeIndex * 6;
            edgePositions[base] = nodes[i].position.x;
            edgePositions[base + 1] = nodes[i].position.y;
            edgePositions[base + 2] = nodes[i].position.z;
            edgePositions[base + 3] = nodes[j].position.x;
            edgePositions[base + 4] = nodes[j].position.y;
            edgePositions[base + 5] = nodes[j].position.z;
            edgeIndex++;
          }
        }
      }

      edgeGeometry.setDrawRange(0, edgeIndex * 2);
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    loop();

    const handleResize = () => {
      const nW = par.clientWidth || 600;
      const nH = par.clientHeight || 250;
      renderer.setSize(nW, nH);
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      nGeo.dispose();
      nodeMaterials.forEach((m) => m.dispose());
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
