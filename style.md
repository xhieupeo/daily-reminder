# 🎨 Frontend Style Guide: Anime Pixel Study App

> **Design Vision**: A warm, nostalgic, 90s/16-bit retro anime study haven. Inspired by *Ghibli study rooms, Coffee Talk, Pokemon Gen 3/4 GBA aesthetics, and lo-fi chillhop beats*. It combines strict pixel-art tactile feedback with functional, readable productivity tools framed by an evocative scenic backdrop.

---

## 1. Core Visual Principles

1. **Pixel-Perfect Tactility**:
   - Everything feels like a classic 16-bit console RPG or cozy handheld game interface.
   - **No smooth modern gradients, Gaussian blurred shadows, or circular pill buttons (`rounded-full`).**
   - Hard-edged pixel borders, stepped drop shadows, and 90-degree (or stepped 2px) corners.
2. **Scenic Anime Background & Daily Life**:
   - A bright, heartwarming outdoor perspective replaces empty flat black voids.
   - Features a **Sakura Avenue**: blooming cherry blossom trees, Japanese telephone poles with crossbars and wires, cozy suburban rooftops, a paved road with sidewalks, distant rolling mountains, and drifting pixel sakura petals.
   - UI cards sit above this scenic canvas with semi-opaque pixel backplates (`rgba(32, 30, 51, 0.96)`), delivering maximum readability while letting the lively anime world frame the workspace.
3. **Zoomed-Out Ergonomic Perspective**:
   - The main workspace is scaled to **85% - 90%** (default 88%) with compact paddings.
   - All three core operational panels (Study Companion & Pomodoro, Daily Jobs, and Study Calendar) fit into the viewport with zero claustrophobia or excessive vertical scrolling on standard laptop and desktop screens.
4. **Clarity & Readability First**:
   - Headers and accents use authentic pixel fonts (`Press Start 2P`).
   - Dense text (task titles, long descriptions, calendar numbers) uses high-contrast retro monospace (`VT323`) at comfortable font sizes.

---

## 2. Color Palette & Design Tokens

### Primary Scenic Theme: "Sakura Avenue Spring Study" (Default)
| Token Name | Hex Code | Visual Preview / Role |
| :--- | :--- | :--- |
| `--color-canvas-bg` | `#98c9eb` | Bright pastel anime morning sky |
| `--color-sky-dawn` | `#ffe6cf` | Warm horizon glow |
| `--color-sakura-main` | `#f48fb1` | Cherry blossom foliage |
| `--color-sakura-light` | `#ffc1e3` | Highlight cherry petals |
| `--color-sakura-shadow`| `#e57373` | Deep tree foliage shadow |
| `--color-surface-card` | `#201e33fa`| Window/Card retro panel background |
| `--color-surface-hover` | `#2c2946` | Hovered panel or list item |
| `--color-surface-sunken` | `#131221` | Inset panels (timer display, input fields) |
| `--color-border-dark` | `#0d0c17` | Outer thick pixel outline (2px - 4px) |
| `--color-border-highlight`| `#5a5286`| 1px top/left inner bevel highlight |
| `--color-primary-accent` | `#f49ac2` | Sakura pastel pink (active states, primary CTA) |
| `--color-secondary-accent`| `#8bd5ca` | Soft matcha/mint cyan (study timer mode, tags) |
| `--color-warning-break` | `#f9c846` | Sunlight gold (break timer, high priority tasks) |
| `--color-text-main` | `#f6eedb` | Parchment cream (high contrast reading) |
| `--color-text-muted` | `#9d96bd` | Subtitle text, completed tasks, timestamps |
| `--color-danger` | `#ea7679` | Delete actions, urgent deadlines |

### Alternative Themes:
- **Sunny Classroom**: Warm paper surfaces (`#f9f5edf5`), retro denim blue `#5e81ac`, warm ochre `#d08770`.
- **Cyberpunk Night Avenue**: Neon cyan `#00f0ff`, magenta `#ff007f`, dark carbon cards (`#14172be6`).

---

## 3. Typography Rules

### Font Families
- **Header & Title Display**: `'Press Start 2P'`, `'Silkscreen'`, or `'Courier Prime'` (Pixel / Monospace display font).
- **Body & Task Descriptions**: `'VT323'` or clean monospace fallback (`'JetBrains Mono'`, `'Fira Code'`, `'Courier New'`, `monospace`).
- **Font Rendering**:
  ```css
  font-smooth: never;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: grayscale;
  image-rendering: pixelated;
  ```

### Hierarchy
- **App / Page Title**: 14px - 18px (`Press Start 2P`, Uppercase)
- **Section Headers / Month Display**: 11px - 14px (`Press Start 2P`)
- **Timer Countdown**: 54px - 64px (`VT323` digital 7-segment / retro display font)
- **Task Titles & Button Labels**: 14px - 16px (`VT323` or 10px `Press Start 2P`)
- **Timestamps, Badges & Microcopy**: 10px - 12px (`VT323`)

---

## 4. Component Styling & Pixel Geometry

### 4.1. Panels & Cards (The Retro Window Frame)
- **Border**: `3px solid var(--color-border-dark)`
- **Shadow**: `4px 4px 0px 0px var(--color-border-dark)` (hard offset, 0 blur)
- **Backdrop**: Semi-opaque backdrop (`backdrop-filter: blur(4px)`) over the scenic world.
- **Corners**: Sharp 90° corners (`border-radius: 0px`).

### 4.2. Buttons (Tactile 3D Pixel Press)
- **Default State**:
  ```css
  background: var(--color-surface-card);
  border: 3px solid var(--color-border-dark);
  box-shadow: 3px 3px 0px 0px var(--color-border-dark);
  cursor: pointer;
  transform: translate(0, 0);
  transition: transform 0.05s ease, box-shadow 0.05s ease;
  ```
- **Hover State**:
  - Background lightens by 10% or switches to `--color-primary-accent` with dark text.
- **Active / Pressed State**:
  ```css
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px 0px var(--color-border-dark);
  ```

### 4.3. Inputs & Checkboxes
- **Input Fields**: Sunken style (`--color-surface-sunken`), inset border `2px solid var(--color-border-dark)`.
- **Checkboxes**:
  - Unchecked: Square 18x18px box with 2px dark outline.
  - Checked: Pixel-art green checkmark or pink star `★` icon. Completed task text gains strikethrough and `--color-text-muted`.

### 4.4. Progress Bars (HP / Mana Bar Style)
- Outer container: 3px black border, 0px border radius.
- Progress fill: Segmented blocks (stepped intervals) or striped retro pixel pattern (like game health bars).
- Color:
  - Focus Mode: Pastel Matcha / Mint (`#8bd5ca`)
  - Break Mode: Amber Gold / Sakura Pink (`#f49ac2`)

---

## 5. Scenic Background & Layout Viewport System

### 5.1. Scenic Backdrop Architecture
1. **Sky Gradient**: Bright daylight sky (`linear-gradient(180deg, #98c9eb 0%, #c4e0f5 35%, #ffd4e5 75%, #ffe6cf 100%)`).
2. **Skyline**: Pixel sun with stepped halo, slowly drifting pixel clouds (`animate-cloud-slow`).
3. **Mountain Horizon**: Layered polygon silhouettes in pastel purples (`#a393bf`, `#7e749e`).
4. **Suburban Life**: Japanese street houses with tiled roofs, ramen shop lanterns, electrical poles with transformers.
5. **Roadway**: Dark slate road with yellow dashed center lines and light concrete curb sidewalk.
6. **Blooming Sakura**: Symmetrical pixel cherry blossom trees framing the left and right flanks.
7. **Drifting Petals**: Continuous floating sakura blossom particle petals (`animate-sakura-fall`) drifting diagonally across the screen.

### 5.2. Viewport Scale & Zoom Rules
- **Base Zoom**: Scaled to `88%` - `90%` (`zoom: 88%` or `transform: scale(0.88)`).
- **Max Width**: `max-w-[1320px]`, horizontally centered with ample margins exposing the scenic sakura trees on both sides.
- **Live Zoom Controller**: An interactive `[-] 88% [+]` control is persistently available in the top navbar to allow users to adapt to different screen dimensions.
- **Compact Vertical Rhythm**: Panels use `p-3.5` and `gap-3.5`, preventing components from overflowing standard 1080p and laptop screens.

---

## 6. Motion & Sound Guidelines

1. **Stepped Animations**:
   - Mascot and pixel elements use CSS `steps(2)` or `steps(4)` to simulate classic 16-bit sprite frame rates.
2. **Atmospheric Motion**:
   - Sakura petals sway and rotate gently as they fall.
   - Clouds drift smoothly in the background.
3. **Procedural 8-Bit Audio**:
   - Button click: Soft retro blip (8-bit pop).
   - Task complete: Level-up chime.
   - Timer end: Melodic 8-bit bell chime.
   - Ambient study rain: Synthesized pink noise.

---

## 7. Strict "DOs and DON'Ts"

### ❌ NEVER DO:
- **No pure pitch-black void backgrounds** without scenic framing.
- **No 100% viewport-choking UI scaling** that forces vertical scrolling for basic actions.
- **No `border-radius: 8px / 16px / 9999px`** (no rounded modern pills).
- **No blurry Gaussian drop shadows** (`box-shadow: 0 10px 25px rgba(...)`).
- **No unreadable low-contrast text** over scenic backgrounds (always use dark semi-opaque card backings).

### ✅ ALWAYS DO:
- **Maintain hard 2px - 4px solid borders** for all container boundaries.
- **Frame the dashboard inside the scenic anime environment**.
- **Provide interactive zoom adjustments** so the user can control screen density.
- **Preserve contrast** between retro backgrounds and text (WCAG AA compliant).
