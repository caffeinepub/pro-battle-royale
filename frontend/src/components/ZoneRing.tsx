import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ZoneRingProps {
  playerRef: React.MutableRefObject<THREE.Object3D>;
  hardcore: boolean;
  onPlayerDamage: (amount: number) => void;
  gameOver: boolean;
}

export default function ZoneRing({ playerRef, hardcore, onPlayerDamage, gameOver }: ZoneRingProps) {
  const ringRef = useRef<THREE.Mesh>(null!);
  const zoneRadiusRef = useRef(100);
  const gameOverRef = useRef(gameOver);
  const lastDamageTime = useRef(0);

  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  useFrame((_, delta) => {
    if (gameOverRef.current) return;

    // Shrink zone
    zoneRadiusRef.current = Math.max(5, zoneRadiusRef.current - 1.5 * delta);

    // Update ring visual
    if (ringRef.current) {
      const r = zoneRadiusRef.current;
      ringRef.current.scale.set(r, 1, r);
    }

    // Zone damage
    if (playerRef.current) {
      const dist = playerRef.current.position.length();
      if (dist > zoneRadiusRef.current) {
        const now = performance.now();
        if (now - lastDamageTime.current > 500) {
          lastDamageTime.current = now;
          onPlayerDamage(hardcore ? 4 : 2);
        }
      }
    }
  });

  return (
    <group>
      {/* Zone boundary ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[0.98, 1, 128]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Zone fill (outside area) - subtle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[100, 260, 128]} />
        <meshBasicMaterial color="#ff0044" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
