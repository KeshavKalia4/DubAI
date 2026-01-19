/**
 * Bouncing card configurations for floating event cards
 * Cards bounce off viewport edges like a screensaver
 */

export interface BouncingCardConfig {
  id: string;
  // Initial position (percentage of viewport, within bounds)
  initialX: number; // 10-90 (% of viewport width)
  initialY: number; // 10-90 (% of viewport height)
  // Velocity (percentage points per second)
  velocityX: number; // e.g., 2-8
  velocityY: number; // e.g., 2-8
  // Depth level affects z-index, scale, and opacity
  depth: 1 | 2 | 3;
}

// 10 unique bouncing card configs with varied positions and velocities
export const bouncingCardConfigs: BouncingCardConfig[] = [
  // Fast cards (depth 1 - far, small)
  {
    id: 'bounce-1',
    initialX: 15,
    initialY: 20,
    velocityX: 6,
    velocityY: 4,
    depth: 1,
  },
  {
    id: 'bounce-2',
    initialX: 80,
    initialY: 70,
    velocityX: -5,
    velocityY: 5,
    depth: 1,
  },
  {
    id: 'bounce-3',
    initialX: 50,
    initialY: 85,
    velocityX: 4,
    velocityY: -6,
    depth: 1,
  },
  // Medium speed cards (depth 2 - mid)
  {
    id: 'bounce-4',
    initialX: 25,
    initialY: 60,
    velocityX: -4,
    velocityY: 3,
    depth: 2,
  },
  {
    id: 'bounce-5',
    initialX: 70,
    initialY: 30,
    velocityX: 3,
    velocityY: -4,
    depth: 2,
  },
  {
    id: 'bounce-6',
    initialX: 40,
    initialY: 15,
    velocityX: -3,
    velocityY: 4,
    depth: 2,
  },
  // Slow cards (depth 3 - near, large)
  {
    id: 'bounce-7',
    initialX: 85,
    initialY: 45,
    velocityX: 2,
    velocityY: 2.5,
    depth: 3,
  },
  {
    id: 'bounce-8',
    initialX: 20,
    initialY: 80,
    velocityX: -2.5,
    velocityY: -2,
    depth: 3,
  },
  {
    id: 'bounce-9',
    initialX: 60,
    initialY: 50,
    velocityX: 2,
    velocityY: -2.5,
    depth: 3,
  },
  {
    id: 'bounce-10',
    initialX: 35,
    initialY: 35,
    velocityX: -2,
    velocityY: 2,
    depth: 3,
  },
];

// Depth configuration affects visual appearance
export const depthConfig = {
  1: { scale: 0.7, opacity: 0.35, zIndex: 1 }, // Far - small, faded, fast
  2: { scale: 0.85, opacity: 0.45, zIndex: 2 }, // Mid
  3: { scale: 1.0, opacity: 0.55, zIndex: 3 }, // Near - full size, more visible, slow
};

// Mobile configs (fewer cards)
export const mobileBouncingCardConfigs: BouncingCardConfig[] = [
  bouncingCardConfigs[0],
  bouncingCardConfigs[3],
  bouncingCardConfigs[6],
  bouncingCardConfigs[8],
  bouncingCardConfigs[9],
];
