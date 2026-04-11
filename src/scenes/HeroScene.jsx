import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cappedDevicePixelRatio } from '../lib/canvasQuality';

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec3 transformed = position;
    transformed += normal * sin(uTime * 1.6 + position.y * 4.0) * 0.045;
    transformed += normal * sin(uTime * 1.2 + position.x * 5.0) * 0.03;

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uGlowColor;
  uniform vec3 uCameraPosition;

  void main() {
    vec3 viewDirection = normalize(uCameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, normalize(vNormal)), 0.0), 2.2);

    float wave = sin(vUv.y * 9.0 + uTime * 1.8) * 0.5 + 0.5;
    float wave2 = sin(vUv.x * 11.0 - uTime * 1.2) * 0.5 + 0.5;
    vec3 base = mix(uColorA, uColorB, wave);
    base = mix(base, uGlowColor, wave2 * 0.32);
    base += fresnel * uGlowColor * 0.75;

    gl_FragColor = vec4(base, 0.96);
  }
`;

export default function HeroScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const width = parent.clientWidth || window.innerWidth / 2;
    const height = parent.clientHeight || window.innerHeight;
    const low = width < 540;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(cappedDevicePixelRatio(width));
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0f1e, 8, 20);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.32));

    const warmLight = new THREE.PointLight(0xff8d5c, 3.4, 24);
    warmLight.position.set(2.6, 2.4, 3.6);
    scene.add(warmLight);

    const violetLight = new THREE.PointLight(0x675cff, 3.2, 22);
    violetLight.position.set(-3.2, -1.8, 2.8);
    scene.add(violetLight);

    const mintLight = new THREE.PointLight(0x73ffd8, 2.3, 18);
    mintLight.position.set(0, 2.9, -1.5);
    scene.add(mintLight);

    const group = new THREE.Group();
    scene.add(group);

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0xffa572) },
        uColorB: { value: new THREE.Color(0x6d63ff) },
        uGlowColor: { value: new THREE.Color(0x7cf5da) },
        uCameraPosition: { value: camera.position.clone() },
      },
    });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, low ? 6 : 10), shaderMaterial);
    group.add(core);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.42, low ? 1 : 2),
      new THREE.MeshBasicMaterial({
        color: 0x96a8ff,
        wireframe: true,
        transparent: true,
        opacity: 0.14,
      })
    );
    group.add(shell);

    const ringGroup = new THREE.Group();
    group.add(ringGroup);

    [
      { radius: 1.95, tube: 0.03, rotation: [1.02, 0.18, 0.72], color: 0xff996d },
      { radius: 2.28, tube: 0.026, rotation: [0.28, 0.86, 0.16], color: 0x6d63ff },
      { radius: 2.58, tube: 0.018, rotation: [1.18, 0.42, 1.32], color: 0x7cf5da },
    ].forEach(({ radius, tube, rotation, color }) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, low ? 12 : 22, low ? 100 : 220),
        new THREE.MeshPhongMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.28,
          transparent: true,
          opacity: 0.7,
        })
      );
      ring.rotation.set(rotation[0], rotation[1], rotation[2]);
      ringGroup.add(ring);
    });

    const starGeometry = new THREE.BufferGeometry();
    const starCount = low ? 320 : 700;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 18;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      starPositions[i * 3 + 2] = -4 - Math.random() * 10;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.018,
        transparent: true,
        opacity: 0.35,
      })
    );
    scene.add(stars);

    const particleCount = low ? 140 : 260;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particles = [];
    const palette = [
      new THREE.Color(0xffb286),
      new THREE.Color(0xff825c),
      new THREE.Color(0x7266ff),
      new THREE.Color(0x7cf5da),
    ];

    for (let i = 0; i < particleCount; i += 1) {
      const radius = 1.8 + Math.random() * 2.6;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.8;

      const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      );

      const tangent = new THREE.Vector3(-position.z, 0, position.x)
        .normalize()
        .multiplyScalar(0.005 + Math.random() * 0.006);

      const velocity = tangent.add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.0018,
          (Math.random() - 0.5) * 0.0012,
          (Math.random() - 0.5) * 0.0018
        )
      );

      particles.push({ position, velocity });
      particlePositions.set([position.x, position.y, position.z], i * 3);

      const color = palette[i % palette.length];
      particleColors.set([color.r, color.g, color.b], i * 3);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const gravityField = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        size: 0.032,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      })
    );
    scene.add(gravityField);

    let pointerX = 0;
    let pointerY = 0;
    const handleMove = (event) => {
      const rect = parent.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    parent.addEventListener('mousemove', handleMove);

    let time = 0;
    let rafId = 0;

    const render = () => {
      rafId = requestAnimationFrame(render);
      time += 0.008;
      shaderMaterial.uniforms.uTime.value = time;
      shaderMaterial.uniforms.uCameraPosition.value.copy(camera.position);

      const positions = particleGeometry.attributes.position.array;
      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        const toCenter = particle.position.clone().multiplyScalar(-1);
        const distance = Math.max(toCenter.length(), 0.75);
        const gravity = toCenter.normalize().multiplyScalar(0.00072 / distance);
        const swirl = new THREE.Vector3(-particle.position.z, 0, particle.position.x)
          .normalize()
          .multiplyScalar(0.00028);

        particle.velocity.add(gravity);
        particle.velocity.add(swirl);
        particle.velocity.multiplyScalar(0.9965);
        particle.position.add(particle.velocity);

        if (particle.position.length() < 1.15 || particle.position.length() > 5.1) {
          const resetRadius = 2.1 + Math.random() * 2.3;
          const resetAngle = Math.random() * Math.PI * 2;
          particle.position.set(
            Math.cos(resetAngle) * resetRadius,
            (Math.random() - 0.5) * 2.6,
            Math.sin(resetAngle) * resetRadius
          );
        }

        positions[i * 3] = particle.position.x;
        positions[i * 3 + 1] = particle.position.y;
        positions[i * 3 + 2] = particle.position.z;
      }

      particleGeometry.attributes.position.needsUpdate = true;

      core.rotation.x = time * 0.26;
      core.rotation.y = time * 0.52;
      core.position.y = Math.sin(time * 1.5) * 0.06;

      shell.rotation.y = -time * 0.28;
      shell.rotation.z = time * 0.18;

      ringGroup.rotation.x += 0.0022;
      ringGroup.rotation.y += 0.0036;

      gravityField.rotation.y += 0.0015;
      stars.rotation.y += 0.00035;

      group.rotation.y += (pointerX * 0.34 - group.rotation.y) * 0.035;
      group.rotation.x += (pointerY * 0.18 - group.rotation.x) * 0.035;

      camera.position.x += (pointerX * 0.44 - camera.position.x) * 0.028;
      camera.position.y += (pointerY * 0.24 - camera.position.y) * 0.028;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    render();

    const handleResize = () => {
      const nextWidth = parent.clientWidth || window.innerWidth / 2;
      const nextHeight = parent.clientHeight || window.innerHeight;
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
      shaderMaterial.dispose();
      core.geometry.dispose();
      shell.geometry.dispose();
      shell.material.dispose();
      ringGroup.children.forEach((ring) => {
        ring.geometry.dispose();
        ring.material.dispose();
      });
      particleGeometry.dispose();
      gravityField.material.dispose();
      starGeometry.dispose();
      stars.material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="hero-canvas" ref={canvasRef} />;
}
