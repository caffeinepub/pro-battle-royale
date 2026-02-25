import { useMemo } from 'react';
import * as THREE from 'three';

export default function LootCrates() {
  const positions = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      x: (Math.random() - 0.5) * 380,
      z: (Math.random() - 0.5) * 380,
    }));
  }, []);

  return (
    <group>
      {positions.map((pos, i) => (
        <mesh key={i} position={[pos.x, 0.5, pos.z]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#00cc44" emissive="#003311" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}
