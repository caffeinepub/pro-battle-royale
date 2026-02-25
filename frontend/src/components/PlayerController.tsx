import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerControllerProps {
  playerRef: React.MutableRefObject<THREE.Object3D>;
  ammo: number;
  hardcore: boolean;
  onShoot: () => void;
  onUpdateHUD: (fps: number, stamina: number, zoneRadius: number) => void;
  gameOver: boolean;
}

export default function PlayerController({
  playerRef,
  ammo,
  hardcore,
  onShoot,
  onUpdateHUD,
  gameOver,
}: PlayerControllerProps) {
  const { camera, scene } = useThree();

  const keysRef = useRef<Record<string, boolean>>({});
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const staminaRef = useRef(100);
  const lastFrameRef = useRef(performance.now());
  const ammoRef = useRef(ammo);
  const gameOverRef = useRef(gameOver);
  const isLockedRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { ammoRef.current = ammo; }, [ammo]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  // Player object setup
  const playerObj = useRef(new THREE.Object3D());

  useEffect(() => {
    playerObj.current.position.set(0, 0, 0);
    scene.add(playerObj.current);
    playerRef.current = playerObj.current;

    return () => {
      scene.remove(playerObj.current);
    };
  }, [scene, playerRef]);

  // Pointer lock
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const requestLock = () => {
      if (!isLockedRef.current) {
        canvas.requestPointerLock();
      }
    };

    const onLockChange = () => {
      isLockedRef.current = document.pointerLockElement === canvas;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isLockedRef.current || gameOverRef.current) return;
      yawRef.current -= e.movementX * 0.002;
      pitchRef.current -= e.movementY * 0.002;
      pitchRef.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitchRef.current));
    };

    canvas.addEventListener('click', requestLock);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      canvas.removeEventListener('click', requestLock);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Keyboard
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
    const onUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    document.addEventListener('keydown', onDown);
    document.addEventListener('keyup', onUp);
    return () => {
      document.removeEventListener('keydown', onDown);
      document.removeEventListener('keyup', onUp);
    };
  }, []);

  // Shooting
  const handleShoot = useCallback(() => {
    if (gameOverRef.current || ammoRef.current <= 0 || !isLockedRef.current) return;

    onShoot();

    // Raycasting against enemies
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    const enemies = scene.children.filter(
      (obj) => obj.userData.isEnemy === true
    );

    const hits = raycaster.intersectObjects(enemies, false);
    if (hits.length > 0) {
      const hit = hits[0].object;
      if (hit.userData.isEnemy) {
        hit.userData.health -= 50;
      }
    }
  }, [camera, scene, onShoot]);

  useEffect(() => {
    document.addEventListener('click', handleShoot);
    return () => document.removeEventListener('click', handleShoot);
  }, [handleShoot]);

  useFrame(() => {
    if (gameOverRef.current) return;

    const now = performance.now();
    const delta = Math.min((now - lastFrameRef.current) / 1000, 0.1);
    const fps = Math.round(1 / delta);
    lastFrameRef.current = now;

    const keys = keysRef.current;
    const isSprinting = (keys['ShiftLeft'] || keys['ShiftRight']) && staminaRef.current > 0;
    const speed = isSprinting ? 12 : 6;

    if (isSprinting) {
      staminaRef.current = Math.max(0, staminaRef.current - 30 * delta);
    } else {
      staminaRef.current = Math.min(100, staminaRef.current + 15 * delta);
    }

    // Movement direction
    const moveDir = new THREE.Vector3();
    if (keys['KeyW'] || keys['ArrowUp']) moveDir.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) moveDir.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) moveDir.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) moveDir.x += 1;

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      moveDir.applyEuler(new THREE.Euler(0, yawRef.current, 0));
      playerObj.current.position.addScaledVector(moveDir, speed * delta);
    }

    // Keep player on ground
    playerObj.current.position.y = 0;

    // Update camera
    camera.position.copy(playerObj.current.position);
    camera.position.y = 1.8;
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yawRef.current;
    camera.rotation.x = pitchRef.current;

    onUpdateHUD(fps, staminaRef.current, 0); // zoneRadius updated by ZoneRing
  });

  return null;
}
