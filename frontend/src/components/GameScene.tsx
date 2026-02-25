import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import PlayerController from './PlayerController';
import EnemyBots from './EnemyBots';
import LootCrates from './LootCrates';
import HUD from './HUD';
import ZoneRing from './ZoneRing';
import { useGameLoop } from '../hooks/useGameLoop';

interface GameSceneProps {
  quality: number;
  hardcore: boolean;
}

export interface GameState {
  health: number;
  armor: number;
  ammo: number;
  maxAmmo: number;
  enemiesRemaining: number;
  fps: number;
  stamina: number;
  zoneRadius: number;
  gameOver: boolean;
}

export default function GameScene({ quality, hardcore }: GameSceneProps) {
  const playerRef = useRef<THREE.Object3D>(null!);
  const [gameState, setGameState] = useState<GameState>({
    health: 100,
    armor: 50,
    ammo: 30,
    maxAmmo: 30,
    enemiesRemaining: 15,
    fps: 0,
    stamina: 100,
    zoneRadius: 100,
    gameOver: false,
  });

  const applyDamage = useCallback((amount: number) => {
    setGameState(prev => {
      if (prev.gameOver) return prev;
      let remaining = amount;
      let newArmor = prev.armor;
      if (newArmor > 0) {
        const absorbed = Math.min(newArmor, remaining * 0.5);
        newArmor -= absorbed;
        remaining -= absorbed;
      }
      const newHealth = Math.max(0, prev.health - remaining);
      return { ...prev, health: newHealth, armor: newArmor, gameOver: newHealth <= 0 };
    });
  }, []);

  const decrementAmmo = useCallback(() => {
    setGameState(prev => ({ ...prev, ammo: Math.max(0, prev.ammo - 1) }));
  }, []);

  const setEnemiesRemaining = useCallback((count: number) => {
    setGameState(prev => ({ ...prev, enemiesRemaining: count }));
  }, []);

  const updateHUD = useCallback((fps: number, stamina: number, zoneRadius: number) => {
    setGameState(prev => ({ ...prev, fps, stamina, zoneRadius }));
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        dpr={quality}
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 2, 0] }}
        gl={{ antialias: true }}
      >
        <fog attach="fog" args={[0x001a1a, 50, 300]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[50, 100, 50]} intensity={1.2} castShadow />
        <directionalLight position={[-30, 50, -30]} intensity={0.4} color="#004444" />

        {/* Terrain */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[500, 500, 60, 60]} />
          <meshStandardMaterial color="#0a0f0a" wireframe={false} />
        </mesh>

        {/* Grid overlay for terrain */}
        <gridHelper args={[500, 100, '#001a1a', '#001a1a']} position={[0, 0.01, 0]} />

        <PlayerController
          playerRef={playerRef}
          ammo={gameState.ammo}
          hardcore={hardcore}
          onShoot={decrementAmmo}
          onUpdateHUD={updateHUD}
          gameOver={gameState.gameOver}
        />

        <EnemyBots
          playerRef={playerRef}
          hardcore={hardcore}
          onPlayerDamage={applyDamage}
          onEnemyCountChange={setEnemiesRemaining}
          ammo={gameState.ammo}
          gameOver={gameState.gameOver}
        />

        <LootCrates />

        <ZoneRing
          playerRef={playerRef}
          hardcore={hardcore}
          onPlayerDamage={applyDamage}
          gameOver={gameState.gameOver}
        />
      </Canvas>

      {/* Crosshair */}
      {!gameState.gameOver && (
        <div className="crosshair">
          <div className="crosshair-h" />
          <div className="crosshair-v" />
        </div>
      )}

      <HUD gameState={gameState} hardcore={hardcore} />

      {gameState.gameOver && (
        <div className="game-over-screen">
          <div className="game-over-box">
            <div className="game-over-title">ELIMINATED</div>
            <div className="game-over-sub">You have been eliminated from the zone.</div>
            <div className="game-over-stats">
              <div>Enemies Remaining: {gameState.enemiesRemaining}</div>
              <div>Ammo Left: {gameState.ammo}</div>
            </div>
            <button className="menu-deploy-btn" onClick={() => window.location.reload()}>
              ↩ RETURN TO MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
