# Specification

## Summary
**Goal:** Build a single-player 3D FPS battle royale game in the browser with a main menu, first-person combat, enemy bots, loot crates, a shrinking safe zone, and a HUD overlay.

**Planned changes:**
- Create a main menu with title "PRO BATTLE ROYALE", a graphics quality selector (Low/Medium/High/4K Ultra), a Hardcore Mode toggle checkbox, and a "Deploy" button — styled with black background and cyan (#00ffcc) border
- Render a 3D game world using Three.js with a 500×500 flat terrain, directional lighting, and dark teal fog (distance 50–300)
- Implement first-person player movement: WASD keys, pointer lock mouse look, Shift to sprint with stamina depletion and recovery
- Implement hitscan shooting on left click: decrements ammo, raycasts for enemy hits (50 HP damage per hit), removes enemies at 0 HP
- Spawn 15 red box enemy bots at random positions; bots idle until player is within 100 units then chase at speed 0.3; deal 2 HP/frame (normal) or 5 HP/frame (hardcore) when within 3 units
- Spawn 20 green 1×1×1 loot crate boxes at random positions on the terrain (no pickup logic)
- Implement a shrinking safe zone starting at radius 100, shrinking by 0.02/frame; player takes 1 HP/frame (normal) or 2 HP/frame (hardcore) while outside the zone
- Display a HUD in the top-left showing Health, Armor, Ammo (current/max), Enemies remaining, and live FPS — updated every frame in cyan text
- Apply a military/tactical dark theme throughout: black backgrounds, cyan (#00ffcc) accents, monospace/bold fonts, fullscreen canvas

**User-visible outcome:** The user can launch a solo first-person battle royale game in the browser — moving, sprinting, shooting enemies, avoiding the shrinking zone, and monitoring stats via HUD — all running entirely client-side.
