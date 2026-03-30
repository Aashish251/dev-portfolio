import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SkillsScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const parent = canvas.parentElement;
    const width = parent.clientWidth || 560;
    const height = parent.clientHeight || 520;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0f1119, 6, 18);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.8);

    scene.add(new THREE.AmbientLight(0xffffff, 0.36));

    const goldLight = new THREE.PointLight(0xe5bd8a, 2.4, 18);
    goldLight.position.set(2.6, 1.8, 2.8);
    scene.add(goldLight);

    const blueLight = new THREE.PointLight(0x7086ff, 2.1, 18);
    blueLight.position.set(-2.8, -1.4, 3.2);
    scene.add(blueLight);

    const field = new THREE.Group();
    scene.add(field);

    const particleCount = 420;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const pointsMeta = [];
    const palette = [
      new THREE.Color(0xe5bd8a),
      new THREE.Color(0xc86f5d),
      new THREE.Color(0x7282ff),
      new THREE.Color(0x84d7c6),
    ];

    for (let i = 0; i < particleCount; i += 1) {
      const radius = 1 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const position = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      positions.set([position.x, position.y, position.z], i * 3);

      const color = palette[i % palette.length];
      colors.set([color.r, color.g, color.b], i * 3);

      pointsMeta.push({
        radius,
        angle: theta,
        speed: 0.0018 + Math.random() * 0.0024,
        height: position.y,
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 0.04,
        transparent: true,
        opacity: 0.86,
        vertexColors: true,
      })
    );
    field.add(particles);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.18, 4),
      new THREE.MeshPhongMaterial({
        color: 0x161823,
        emissive: 0x111525,
        shininess: 120,
        transparent: true,
        opacity: 0.9,
        wireframe: true,
      })
    );
    field.add(core);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(2.3, 0.035, 20, 220),
      new THREE.MeshBasicMaterial({
        color: 0xe5bd8a,
        transparent: true,
        opacity: 0.28,
      })
    );
    halo.rotation.set(1.15, 0.22, 0.5);
    field.add(halo);

    const haloTwo = halo.clone();
    haloTwo.material = halo.material.clone();
    haloTwo.material.color = new THREE.Color(0x7282ff);
    haloTwo.rotation.set(0.26, 0.78, 0.2);
    field.add(haloTwo);

    let pointerX = 0;
    let pointerY = 0;
    const handleMove = (event) => {
      const rect = parent.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    parent.addEventListener('mousemove', handleMove);

    let rafId = 0;
    let time = 0;

    const render = () => {
      rafId = requestAnimationFrame(render);
      time += 0.008;

      const positionArray = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i += 1) {
        const point = pointsMeta[i];
        point.angle += point.speed;

        const r = point.radius + Math.sin(time * 1.4 + i * 0.12) * 0.06;
        positionArray[i * 3] = Math.cos(point.angle) * r;
        positionArray[i * 3 + 1] = point.height + Math.sin(time * 0.9 + i * 0.18) * 0.12;
        positionArray[i * 3 + 2] = Math.sin(point.angle) * r;
      }

      geometry.attributes.position.needsUpdate = true;

      field.rotation.y += 0.002;
      field.rotation.x += (pointerY * 0.22 - field.rotation.x) * 0.04;
      field.rotation.z += (pointerX * 0.08 - field.rotation.z) * 0.04;
      field.position.x += (pointerX * 0.18 - field.position.x) * 0.03;
      field.position.y += (pointerY * 0.16 - field.position.y) * 0.03;

      core.rotation.x = time * 0.18;
      core.rotation.y = time * 0.28;
      halo.rotation.z += 0.0035;
      haloTwo.rotation.x -= 0.0028;

      renderer.render(scene, camera);
    };

    render();

    const handleResize = () => {
      const nextWidth = parent.clientWidth || 560;
      const nextHeight = parent.clientHeight || 520;
      renderer.setSize(nextWidth, nextHeight);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      parent.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      particles.material.dispose();
      core.geometry.dispose();
      core.material.dispose();
      halo.geometry.dispose();
      halo.material.dispose();
      haloTwo.material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="skills-canvas" ref={canvasRef} />;
}
