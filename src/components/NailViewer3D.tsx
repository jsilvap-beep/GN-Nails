import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Eye } from 'lucide-react';

interface NailViewer3DProps {
  shape: string; // 'almond' | 'coffin' | 'square' | 'oval' | 'stiletto'
  lengthCode: string; // 'S' | 'M' | 'L' | 'XL' | 'XXL'
  finish?: 'nude' | 'pink_glaze' | 'chrome_silver' | 'gold_liquid' | 'ruby_aura' | 'sage_matcha';
  onShapeChange?: (shape: string) => void;
  className?: string;
  showControls?: boolean;
}

export const NailViewer3D: React.FC<NailViewer3DProps> = ({
  shape,
  lengthCode,
  finish = 'pink_glaze',
  onShapeChange,
  className = '',
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFinish, setActiveFinish] = useState(finish);
  const [isRotating, setIsRotating] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nailMeshRef = useRef<THREE.Mesh | null>(null);
  const neonRingRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Map length code to numeric scale multiplier
  const getLengthScale = (code: string) => {
    switch (code) {
      case 'S': return 0.85;
      case 'M': return 1.0;
      case 'L': return 1.25;
      case 'XL': return 1.5;
      case 'XXL': return 1.8;
      default: return 1.0;
    }
  };

  // Generate nail tip geometry based on shape
  const createNailGeometry = (selectedShape: string, lengthMultiplier: number) => {
    // Generate curved parametric lathe or extruded profile for high fidelity nail tip
    const shapeCurve = new THREE.Shape();
    const halfWidth = 0.55;
    const baseHeight = -0.6;
    const totalLength = 1.3 * lengthMultiplier;

    // Start at bottom cuticle curve
    shapeCurve.moveTo(-halfWidth * 0.9, baseHeight);
    shapeCurve.quadraticCurveTo(0, baseHeight - 0.25, halfWidth * 0.9, baseHeight);

    // Tip geometry variation according to chosen shape
    if (selectedShape === 'stiletto') {
      // Extremely sharp point
      shapeCurve.quadraticCurveTo(halfWidth * 0.85, baseHeight + totalLength * 0.4, 0, baseHeight + totalLength + 0.35);
      shapeCurve.quadraticCurveTo(-halfWidth * 0.85, baseHeight + totalLength * 0.4, -halfWidth * 0.9, baseHeight);
    } else if (selectedShape === 'coffin') {
      // Tapered with flat horizontal top
      const topWidth = halfWidth * 0.45;
      shapeCurve.lineTo(topWidth, baseHeight + totalLength);
      shapeCurve.lineTo(-topWidth, baseHeight + totalLength);
      shapeCurve.lineTo(-halfWidth * 0.9, baseHeight);
    } else if (selectedShape === 'square') {
      // Straight square with crisp or micro-rounded corners
      shapeCurve.lineTo(halfWidth * 0.95, baseHeight + totalLength);
      shapeCurve.lineTo(-halfWidth * 0.95, baseHeight + totalLength);
      shapeCurve.lineTo(-halfWidth * 0.9, baseHeight);
    } else if (selectedShape === 'oval') {
      // Soft continuous oval curve
      shapeCurve.lineTo(halfWidth * 0.9, baseHeight + totalLength * 0.6);
      shapeCurve.quadraticCurveTo(0, baseHeight + totalLength + 0.15, -halfWidth * 0.9, baseHeight + totalLength * 0.6);
      shapeCurve.lineTo(-halfWidth * 0.9, baseHeight);
    } else {
      // Default: Almendra (Almond)
      shapeCurve.lineTo(halfWidth * 0.88, baseHeight + totalLength * 0.5);
      shapeCurve.quadraticCurveTo(halfWidth * 0.4, baseHeight + totalLength + 0.15, 0, baseHeight + totalLength + 0.2);
      shapeCurve.quadraticCurveTo(-halfWidth * 0.4, baseHeight + totalLength + 0.15, -halfWidth * 0.88, baseHeight + totalLength * 0.5);
      shapeCurve.lineTo(-halfWidth * 0.9, baseHeight);
    }

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 2,
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelOffset: 0,
      bevelSegments: 6,
    };

    const geom = new THREE.ExtrudeGeometry(shapeCurve, extrudeSettings);
    geom.center();
    return geom;
  };

  // Get material settings according to selected finish
  const getNailMaterial = (finishType: string) => {
    switch (finishType) {
      case 'chrome_silver':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xdadada),
          metalness: 0.95,
          roughness: 0.08,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          reflectivity: 1.0,
        });
      case 'gold_liquid':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xdfba68),
          metalness: 0.88,
          roughness: 0.12,
          clearcoat: 1.0,
          clearcoatRoughness: 0.06,
        });
      case 'ruby_aura':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xb91c3d),
          metalness: 0.35,
          roughness: 0.18,
          clearcoat: 1.0,
          transmission: 0.1,
          opacity: 0.95,
          transparent: true,
        });
      case 'sage_matcha':
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x9fa889),
          roughness: 0.35,
          metalness: 0.05,
        });
      case 'nude':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xead6c9),
          metalness: 0.1,
          roughness: 0.22,
          clearcoat: 0.8,
        });
      case 'pink_glaze':
      default:
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xf2cfc7),
          metalness: 0.2,
          roughness: 0.15,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          sheen: 0.5,
          sheenColor: new THREE.Color(0xffffff),
        });
    }
  };

  // Setup Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 300;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5eb, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf5d9bc, 1.6);
    dirLight2.position.set(-3, -2, 2);
    scene.add(dirLight2);

    const rimLight = new THREE.PointLight(0xffe2a4, 2.8, 10);
    rimLight.position.set(0, 2.5, -2);
    scene.add(rimLight);

    // 3D Neon Ring Effect
    const neonGroup = new THREE.Group();
    const ringGeom = new THREE.TorusGeometry(1.4, 0.015, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xdfba68,
      transparent: true,
      opacity: 0.7,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2.6;
    neonGroup.add(ringMesh);

    // Second faint glow ring
    const ringGeom2 = new THREE.TorusGeometry(1.6, 0.008, 16, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xf5c3b8,
      transparent: true,
      opacity: 0.45,
    });
    const ringMesh2 = new THREE.Mesh(ringGeom2, ringMat2);
    ringMesh2.rotation.x = Math.PI / 2.3;
    ringMesh2.rotation.y = Math.PI / 6;
    neonGroup.add(ringMesh2);

    scene.add(neonGroup);
    neonRingRef.current = neonGroup;

    // Floating Sparkles / Particles
    const particleCount = 28;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 3.2;
      positions[i + 1] = (Math.random() - 0.5) * 3.2;
      positions[i + 2] = (Math.random() - 0.5) * 1.8;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf5d898,
      size: 0.035,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Nail Mesh
    const lengthScale = getLengthScale(lengthCode);
    const geometry = createNailGeometry(shape, lengthScale);
    const material = getNailMaterial(activeFinish);
    const nailMesh = new THREE.Mesh(geometry, material);
    nailMesh.rotation.x = 0.15;
    scene.add(nailMesh);
    nailMeshRef.current = nailMesh;

    // Mouse Drag interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsRotating(false);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !nailMeshRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      nailMeshRef.current.rotation.y += deltaX * 0.015;
      nailMeshRef.current.rotation.x += deltaY * 0.015;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (nailMeshRef.current && isRotating && !isDragging) {
        nailMeshRef.current.rotation.y = Math.sin(elapsedTime * 0.9) * 0.55;
        nailMeshRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.04;
      }

      if (neonRingRef.current) {
        neonRingRef.current.rotation.z = elapsedTime * 0.25;
        neonRingRef.current.rotation.y = elapsedTime * 0.15;
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.dispose();
      geometry.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, []);

  // Update geometry when shape or length changes
  useEffect(() => {
    if (!nailMeshRef.current || !sceneRef.current) return;
    const lengthScale = getLengthScale(lengthCode);
    const newGeom = createNailGeometry(shape, lengthScale);
    nailMeshRef.current.geometry.dispose();
    nailMeshRef.current.geometry = newGeom;
  }, [shape, lengthCode]);

  // Update material when finish changes
  useEffect(() => {
    if (!nailMeshRef.current) return;
    const newMat = getNailMaterial(activeFinish);
    nailMeshRef.current.material = newMat;
  }, [activeFinish]);

  return (
    <div className={`relative flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#FDFBF7] to-[#F1EAE0] border border-[#E8DEC8] p-4 shadow-sm overflow-hidden ${className}`}>
      {/* 3D Stage Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.12)_0%,_transparent_70%)] pointer-events-none" />

      {/* Floating 3D Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#E2D5C3] text-[11px] font-medium text-[#7C634F] shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Vista 3D Interactiva</span>
      </div>

      {/* Rotation Toggle Button */}
      <button
        type="button"
        onClick={() => setIsRotating(!isRotating)}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#E2D5C3] text-[#7C634F] hover:text-[#382B23] transition-colors shadow-xs"
        title={isRotating ? "Pausar rotación automática" : "Activar rotación automática"}
      >
        <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
      </button>

      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-56 md:h-64 cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
      />

      <p className="text-[11px] text-[#8C7A6B] -mt-1 mb-2.5 text-center flex items-center justify-center gap-1">
        <Eye className="w-3 h-3 text-[#B09983]" />
        <span>Arrastra para girar 360° en tiempo real</span>
      </p>

      {/* Interactive Finish Selectors */}
      {showControls && (
        <div className="w-full pt-2 border-t border-[#E8DFC9] flex flex-wrap items-center justify-between gap-1.5 z-10">
          <span className="text-[11px] font-medium text-[#6B5A4D]">Acabado 3D:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'pink_glaze', label: 'Glaze Rosa', color: 'bg-[#F2CFC7]' },
              { id: 'chrome_silver', label: 'Cromo Plata', color: 'bg-[#DADADA] border-slate-400' },
              { id: 'gold_liquid', label: 'Oro 24K', color: 'bg-[#DFBA68]' },
              { id: 'ruby_aura', label: 'Rubí Aura', color: 'bg-[#B91C3D]' },
              { id: 'nude', label: 'Milky Nude', color: 'bg-[#EAD6C9]' },
              { id: 'sage_matcha', label: 'Matcha', color: 'bg-[#9FA889]' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFinish(f.id as any)}
                className={`w-5 h-5 rounded-full ${f.color} transition-all border ${
                  activeFinish === f.id
                    ? 'ring-2 ring-[#D4AF37] ring-offset-1 scale-110 shadow-sm'
                    : 'border-black/10 hover:scale-105 opacity-85'
                }`}
                title={f.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
