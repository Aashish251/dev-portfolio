import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cappedDevicePixelRatio } from '../lib/canvasQuality';

export default function AboutScene({ theme = 'dark' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const width = parent.clientWidth || 460;
    const height = parent.clientHeight || 460;
    const low = width < 500;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(cappedDevicePixelRatio(width));
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 6.5);
    const isLight = theme === 'light';

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const coralLight = new THREE.PointLight(0xf4845f, 2.2, 18);
    coralLight.position.set(2.4, 1.8, 3.2);
    scene.add(coralLight);

    const indigoLight = new THREE.PointLight(0x4f46e5, 2.4, 18);
    indigoLight.position.set(-2.6, -1.7, 2.8);
    scene.add(indigoLight);

    const mintLight = new THREE.PointLight(0x6ee7b7, 1.6, 16);
    mintLight.position.set(0, 2.2, -1.8);
    scene.add(mintLight);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.25, 1),
      new THREE.MeshPhysicalMaterial({
        color: isLight ? 0xf4ecff : 0xf7d7c8,
        emissive: isLight ? 0x8f7cff : 0x5b4bf2,
        emissiveIntensity: isLight ? 0.18 : 0.35,
        roughness: isLight ? 0.2 : 0.12,
        metalness: 0.18,
        transmission: isLight ? 0.62 : 0.45,
        thickness: 0.8,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      })
    );
    group.add(core);

    const wireShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.72, 2),
      new THREE.MeshBasicMaterial({
        color: isLight ? 0x8caee8 : 0x6eb5ff,
        wireframe: true,
        transparent: true,
        opacity: isLight ? 0.26 : 0.18,
      })
    );
    group.add(wireShell);

    const ringGroup = new THREE.Group();
    group.add(ringGroup);

    const ringConfigs = [
      { radius: 2.1, tube: 0.03, color: 0xf4845f, rotation: [0.35, 0.7, 0.2] },
      { radius: 2.35, tube: 0.025, color: 0x4f46e5, rotation: [1.15, 0.1, 0.65] },
      { radius: 1.8, tube: 0.02, color: 0x6ee7b7, rotation: [0.9, 0.45, 1.2] },
    ];

    ringConfigs.forEach(({ radius, tube, color, rotation }) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, low ? 14 : 24, low ? 96 : 160),
        new THREE.MeshPhongMaterial({
          color,
          emissive: color,
          emissiveIntensity: isLight ? 0.16 : 0.25,
          transparent: true,
          opacity: isLight ? 0.62 : 0.75,
        })
      );
      ring.rotation.set(rotation[0], rotation[1], rotation[2]);
      ringGroup.add(ring);
    });

    const particleCount = low ? 420 : 720;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const palette = [
      new THREE.Color(0xf4845f),
      new THREE.Color(0x4f46e5),
      new THREE.Color(0x6eb5ff),
      new THREE.Color(0x6ee7b7),
    ];

    for (let i = 0; i < particleCount; i += 1) {
      const radius = 2.3 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.cos(phi) * 0.75;
      particlePositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const color = palette[i % palette.length];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        size: isLight ? 0.026 : 0.03,
        vertexColors: true,
        transparent: true,
        opacity: isLight ? 0.48 : 0.7,
      })
    );
    scene.add(particles);

    let pointerX = 0;
    let pointerY = 0;
    const handleMove = (event) => {
      const rect = parent.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    parent.addEventListener('mousemove', handleMove);

    let frame = 0;
    let rafId = 0;
    const render = () => {
      rafId = requestAnimationFrame(render);
      frame += 0.008;

      core.rotation.x = frame * 0.45;
      core.rotation.y = frame * 0.65;
      core.position.y = Math.sin(frame * 1.4) * 0.12;

      wireShell.rotation.x = -frame * 0.3;
      wireShell.rotation.y = frame * 0.48;

      ringGroup.rotation.x += 0.003;
      ringGroup.rotation.y += 0.004;
      ringGroup.rotation.z += 0.002;

      particles.rotation.y = frame * 0.12;
      particles.rotation.x = frame * 0.05;

      group.rotation.y += (pointerX * 0.45 - group.rotation.y) * 0.04;
      group.rotation.x += (pointerY * 0.2 - group.rotation.x) * 0.04;

      camera.position.x += ((pointerX * 0.35) - camera.position.x) * 0.03;
      camera.position.y += ((pointerY * 0.18 + 0.2) - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    render();

    const handleResize = () => {
      const nextWidth = parent.clientWidth || 460;
      const nextHeight = parent.clientHeight || 460;
      renderer.setPixelRatio(cappedDevicePixelRatio(nextWidth));
      renderer.setSize(nextWidth, nextHeight);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(parent);

    return () => {
      cancelAnimationFrame(rafId);
      parent.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      particleGeometry.dispose();
      core.geometry.dispose();
      core.material.dispose();
      wireShell.geometry.dispose();
      wireShell.material.dispose();
      ringGroup.children.forEach((ring) => {
        ring.geometry.dispose();
        ring.material.dispose();
      });
      renderer.dispose();
    };
  }, [theme]);

  return <canvas id="about-canvas" ref={canvasRef} />;
}
