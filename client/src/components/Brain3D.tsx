import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import * as THREE from 'three';

interface Brain3DProps {
  emotionalBalance: number; // 0-1, affects color
  energyLevel: number; // 0-1, affects pulse
  cognitiveLoad: number; // 0-1, affects rotation/motion
  stressLevel: number; // 0-1, affects distortion
}

// Brain image URL - you can:
// 1. Place an image in /client/public/ folder and use '/brain.png' or '/brain.jpg'
// 2. Use a full URL to an image online
// 3. Leave empty to use fallback generated brain
const BRAIN_IMAGE_URL = '/brain.png'; // Change this to your image path or URL

export default function Brain3D({
  emotionalBalance,
  energyLevel,
  cognitiveLoad,
  stressLevel,
}: Brain3DProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  // Calculate color based on emotional balance
  // Blue (calm) to Red (agitated) spectrum
  const color = useMemo(() => {
    const hue = (1 - emotionalBalance) * 0.7; // 0 (blue) to 0.7 (red)
    const saturation = 0.8;
    const lightness = 0.5 + emotionalBalance * 0.3; // 0.5 to 0.8
    return new THREE.Color().setHSL(hue, saturation, lightness);
  }, [emotionalBalance]);

  // Load brain texture from image
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    
    // Create fallback texture function
    const createFallback = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Draw a simple brain silhouette as fallback
      ctx.fillStyle = '#6b9bd1';
      ctx.strokeStyle = '#4a7ba7';
      ctx.lineWidth = 4;
      
      ctx.beginPath();
      ctx.moveTo(256, 80);
      ctx.bezierCurveTo(220, 70, 180, 90, 160, 120);
      ctx.bezierCurveTo(140, 150, 130, 190, 140, 230);
      ctx.bezierCurveTo(150, 270, 170, 310, 200, 340);
      ctx.bezierCurveTo(220, 360, 240, 370, 240, 380);
      ctx.bezierCurveTo(240, 390, 230, 400, 220, 400);
      ctx.bezierCurveTo(210, 400, 200, 390, 200, 380);
      ctx.bezierCurveTo(200, 370, 220, 360, 240, 350);
      ctx.bezierCurveTo(260, 340, 280, 330, 300, 340);
      ctx.bezierCurveTo(310, 350, 320, 360, 320, 370);
      ctx.bezierCurveTo(320, 380, 310, 390, 300, 390);
      ctx.bezierCurveTo(290, 390, 280, 380, 280, 370);
      ctx.bezierCurveTo(280, 360, 300, 340, 320, 310);
      ctx.bezierCurveTo(340, 280, 350, 240, 360, 200);
      ctx.bezierCurveTo(370, 160, 360, 120, 340, 90);
      ctx.bezierCurveTo(320, 70, 290, 75, 256, 80);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      return new THREE.CanvasTexture(canvas);
    };
    
    // Try to load the user's brain image
    try {
      const tex = loader.load(
        BRAIN_IMAGE_URL,
        () => {
          // Image loaded successfully
          console.log('Brain image loaded successfully');
        },
        undefined,
        (error) => {
          // If image fails to load, use fallback
          console.warn('Could not load brain image, using fallback:', error);
          const fallbackTex = createFallback();
          textureRef.current = fallbackTex;
        }
      );
      
      textureRef.current = tex;
      return tex;
    } catch (error) {
      // If loading fails immediately, use fallback
      console.warn('Error loading brain image, using fallback:', error);
      const fallbackTex = createFallback();
      textureRef.current = fallbackTex;
      return fallbackTex;
    }
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    const group = groupRef.current;
    const mesh = meshRef.current;

    // Pulse animation (energy level) - affects scale
    const pulseSpeed = 2 + energyLevel * 3;
    const pulseAmount = 0.08 + energyLevel * 0.12;
    const baseScale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * pulseAmount;
    group.scale.setScalar(baseScale);

    // Rotation based on cognitive load - continuous rotation
    const rotationSpeed = 0.3 + cognitiveLoad * 0.7;
    mesh.rotation.z += delta * rotationSpeed;

    // Add slight tilt rotation for more dynamic movement
    group.rotation.y += delta * rotationSpeed * 0.3;
    group.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;

    // Update material color tint based on emotional balance
    if (mesh.material instanceof THREE.MeshStandardMaterial) {
      mesh.material.color.copy(color);
      mesh.material.emissive.copy(color);
      mesh.material.emissiveIntensity = 0.2 + emotionalBalance * 0.3;
      
      // Apply stress-based opacity/glow effect
      mesh.material.opacity = 0.9 + stressLevel * 0.1;
      mesh.material.transparent = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial
          map={texture}
          color={color}
          emissive={color}
          emissiveIntensity={0.2 + emotionalBalance * 0.3}
          transparent={true}
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
