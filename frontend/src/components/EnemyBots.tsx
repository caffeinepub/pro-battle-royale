import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnemyBotsProps {
  playerRef: React.MutableRefObject<THREE.Object3D>;
  hardcore: boolean;
  onPlayerDamage: (amount: number) => void;
  onEnemyCountChange: (count: number) => void;
  ammo: number;
  gameOver: boolean;
}

interface EnemyData {
  mesh: THREE.Mesh;
  health: number;
  state: 'idle' | 'chase';
  alive: boolean;
}

export default function EnemyBots({
  playerRef,
  hardcore,
  onPlayerDamage,
  onEnemyCountChange,
  gameOver,
}: EnemyBotsProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const enemiesRef = useRef<EnemyData[]>([]);
  const lastDamageTime = useRef(0);
  const gameOverRef = useRef(gameOver);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  const initialPositions = useMemo(() => {
    return Array.from({ length: 15 }, () => ({
      x: (Math.random() - 0.5) * 380,
      z: (Math.random() - 0.5) * 380,
    }));
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;

    const geo = new THREE.BoxGeometry(1, 2, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff2200 });

    enemiesRef.current = initialPositions.map((pos) => {
      const mesh = new THREE.Mesh(geo, mat.clone());
      mesh.position.set(pos.x, 1, pos.z);
      mesh.userData.isEnemy = true;
      mesh.userData.health = 100;
      mesh.castShadow = true;
      groupRef.current.add(mesh);
      return { mesh, health: 100, state: 'idle', alive: true };
    });

    onEnemyCountChange(15);

    return () => {
      enemiesRef.current.forEach(e => groupRef.current?.remove(e.mesh));
      enemiesRef.current = [];
    };
  }, [initialPositions, onEnemyCountChange]);

  useFrame((_, delta) => {
    if (gameOverRef.current || !playerRef.current) return;

    const playerPos = playerRef.current.position;
    let aliveCount = 0;
    let changed = false;

    enemiesRef.current.forEach((enemy) => {
      if (!enemy.alive) return;

      // Sync health from userData (set by raycaster in PlayerController)
      if (enemy.mesh.userData.health !== enemy.health) {
        enemy.health = enemy.mesh.userData.health;
      }

      if (enemy.health <= 0) {
        enemy.alive = false;
        enemy.mesh.visible = false;
        enemy.mesh.userData.isEnemy = false;
        changed = true;
        return;
      }

      aliveCount++;

      const dist = enemy.mesh.position.distanceTo(playerPos);

      if (dist < 100) {
        enemy.state = 'chase';
      }

      if (enemy.state === 'chase') {
        const dir = new THREE.Vector3()
          .subVectors(playerPos, enemy.mesh.position)
          .normalize();
        enemy.mesh.position.addScaledVector(dir, 4 * delta);
        enemy.mesh.lookAt(playerPos.x, enemy.mesh.position.y, playerPos.z);
      }

      // Proximity damage (throttled to once per second)
      if (dist < 3) {
        const now = performance.now();
        if (now - lastDamageTime.current > 500) {
          lastDamageTime.current = now;
          onPlayerDamage(hardcore ? 10 : 5);
        }
      }

      // Bob animation
      enemy.mesh.position.y = 1 + Math.sin(Date.now() * 0.003 + enemy.mesh.position.x) * 0.1;
    });

    if (changed) {
      onEnemyCountChange(aliveCount);
    }
  });

  return <group ref={groupRef} />;
}
