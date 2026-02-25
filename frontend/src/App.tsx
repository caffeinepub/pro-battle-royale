import { useState } from 'react';
import MainMenu from './components/MainMenu';
import GameScene from './components/GameScene';

export interface GameSettings {
  quality: number;
  hardcore: boolean;
}

export default function App() {
  const [gameActive, setGameActive] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({ quality: 1, hardcore: false });

  const handleStart = (s: GameSettings) => {
    setSettings(s);
    setGameActive(true);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden', position: 'relative' }}>
      {!gameActive && <MainMenu onStart={handleStart} />}
      {gameActive && <GameScene quality={settings.quality} hardcore={settings.hardcore} />}
    </div>
  );
}
