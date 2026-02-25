import { useState } from 'react';
import { GameSettings } from '../App';

interface MainMenuProps {
  onStart: (settings: GameSettings) => void;
}

export default function MainMenu({ onStart }: MainMenuProps) {
  const [quality, setQuality] = useState(1);
  const [hardcore, setHardcore] = useState(false);

  const handleDeploy = () => {
    onStart({ quality, hardcore });
  };

  return (
    <div className="menu-overlay">
      <div className="menu-box">
        <div className="menu-title-wrapper">
          <div className="menu-title-line" />
          <h1 className="menu-title">PRO BATTLE ROYALE</h1>
          <div className="menu-title-line" />
        </div>

        <div className="menu-subtitle">TACTICAL ELIMINATION PROTOCOL</div>

        <div className="menu-divider" />

        <div className="menu-field">
          <label className="menu-label">GRAPHICS QUALITY</label>
          <select
            className="menu-select"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
          >
            <option value={1}>LOW — 1x</option>
            <option value={1.5}>MEDIUM — 1.5x</option>
            <option value={2}>HIGH — 2x</option>
            <option value={3}>4K ULTRA — 3x</option>
          </select>
        </div>

        <div className="menu-field menu-field-row">
          <label className="menu-label" htmlFor="hardcore-toggle">HARDCORE MODE</label>
          <div className="menu-checkbox-wrapper">
            <input
              id="hardcore-toggle"
              type="checkbox"
              className="menu-checkbox"
              checked={hardcore}
              onChange={(e) => setHardcore(e.target.checked)}
            />
            <span className="menu-checkbox-indicator">{hardcore ? '■' : '□'}</span>
          </div>
        </div>

        {hardcore && (
          <div className="menu-warning">
            ⚠ DOUBLE DAMAGE — NO MERCY
          </div>
        )}

        <div className="menu-divider" />

        <button className="menu-deploy-btn" onClick={handleDeploy}>
          ▶ DEPLOY
        </button>

        <div className="menu-controls">
          <div className="menu-controls-title">CONTROLS</div>
          <div className="menu-controls-grid">
            <span>WASD</span><span>Move</span>
            <span>SHIFT</span><span>Sprint</span>
            <span>MOUSE</span><span>Aim</span>
            <span>CLICK</span><span>Shoot</span>
          </div>
        </div>
      </div>

      <div className="menu-footer">
        Built with ❤ using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'pro-battle-royale')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="menu-footer-link"
        >
          caffeine.ai
        </a>{' '}
        · © {new Date().getFullYear()}
      </div>
    </div>
  );
}
