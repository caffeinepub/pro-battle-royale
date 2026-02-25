import { GameState } from './GameScene';

interface HUDProps {
  gameState: GameState;
  hardcore: boolean;
}

export default function HUD({ gameState, hardcore }: HUDProps) {
  const { health, armor, ammo, maxAmmo, enemiesRemaining, fps, stamina, zoneRadius } = gameState;

  const healthPct = Math.max(0, health);
  const armorPct = Math.max(0, armor);
  const staminaPct = Math.max(0, stamina);

  const healthColor = health > 60 ? '#00ffcc' : health > 30 ? '#ffcc00' : '#ff2200';

  return (
    <div className="hud-overlay">
      {/* Top-left stats */}
      <div className="hud-panel hud-top-left">
        <div className="hud-row">
          <span className="hud-label">HP</span>
          <div className="hud-bar-track">
            <div
              className="hud-bar-fill"
              style={{ width: `${healthPct}%`, background: healthColor }}
            />
          </div>
          <span className="hud-value" style={{ color: healthColor }}>{Math.floor(health)}</span>
        </div>

        <div className="hud-row">
          <span className="hud-label">ARM</span>
          <div className="hud-bar-track">
            <div
              className="hud-bar-fill"
              style={{ width: `${armorPct * 2}%`, background: '#4488ff' }}
            />
          </div>
          <span className="hud-value" style={{ color: '#4488ff' }}>{Math.floor(armor)}</span>
        </div>

        <div className="hud-row">
          <span className="hud-label">STM</span>
          <div className="hud-bar-track">
            <div
              className="hud-bar-fill"
              style={{ width: `${staminaPct}%`, background: '#ffaa00' }}
            />
          </div>
          <span className="hud-value" style={{ color: '#ffaa00' }}>{Math.floor(stamina)}</span>
        </div>
      </div>

      {/* Bottom-left ammo */}
      <div className="hud-panel hud-bottom-left">
        <div className="hud-ammo">
          <span className="hud-ammo-current">{ammo}</span>
          <span className="hud-ammo-sep">/</span>
          <span className="hud-ammo-max">{maxAmmo}</span>
        </div>
        <div className="hud-ammo-label">AMMO</div>
        {ammo === 0 && <div className="hud-no-ammo">NO AMMO</div>}
      </div>

      {/* Top-right info */}
      <div className="hud-panel hud-top-right">
        <div className="hud-info-row">
          <span className="hud-info-icon">◈</span>
          <span className="hud-info-label">ENEMIES</span>
          <span className="hud-info-value">{enemiesRemaining}</span>
        </div>
        <div className="hud-info-row">
          <span className="hud-info-icon">◉</span>
          <span className="hud-info-label">ZONE</span>
          <span className="hud-info-value">{Math.floor(zoneRadius)}m</span>
        </div>
        <div className="hud-info-row">
          <span className="hud-info-icon">◌</span>
          <span className="hud-info-label">FPS</span>
          <span className="hud-info-value">{fps}</span>
        </div>
        {hardcore && (
          <div className="hud-hardcore-badge">HARDCORE</div>
        )}
      </div>

      {/* Zone warning */}
      {zoneRadius < 20 && (
        <div className="hud-zone-warning">⚠ ZONE CLOSING</div>
      )}
    </div>
  );
}
