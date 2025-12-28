/**
 * Traversal path configurations for floating event cards
 * Cards travel across the entire viewport using vw/vh units
 */

export interface TraversalPath {
  id: string;
  // Keyframes for x position (viewport width units)
  x: string[];
  // Keyframes for y position (viewport height units)
  y: string[];
  // Duration in seconds
  duration: number;
  // Start delay in seconds
  delay: number;
  // Depth level affects z-index, scale, and opacity
  depth: 1 | 2 | 3;
  // Easing type
  ease: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear';
}

// 10 unique traversal paths with varied directions and speeds
export const traversalPaths: TraversalPath[] = [
  // Path 1: Diagonal - Bottom right to top left (far, fast)
  {
    id: 'diag-br-tl',
    x: ['110vw', '70vw', '30vw', '-15vw'],
    y: ['110vh', '65vh', '35vh', '-10vh'],
    duration: 28,
    delay: 0,
    depth: 1,
    ease: 'easeInOut',
  },
  // Path 2: Diagonal - Bottom left to top right (near, slow)
  {
    id: 'diag-bl-tr',
    x: ['-15vw', '25vw', '65vw', '110vw'],
    y: ['110vh', '70vh', '40vh', '-10vh'],
    duration: 48,
    delay: 3,
    depth: 3,
    ease: 'easeOut',
  },
  // Path 3: Diagonal - Top right to bottom left (mid)
  {
    id: 'diag-tr-bl',
    x: ['110vw', '60vw', '20vw', '-15vw'],
    y: ['-10vh', '30vh', '60vh', '110vh'],
    duration: 38,
    delay: 6,
    depth: 2,
    ease: 'easeInOut',
  },
  // Path 4: Diagonal - Top left to bottom right (far)
  {
    id: 'diag-tl-br',
    x: ['-15vw', '30vw', '70vw', '110vw'],
    y: ['-10vh', '35vh', '65vh', '110vh'],
    duration: 32,
    delay: 9,
    depth: 1,
    ease: 'easeInOut',
  },
  // Path 5: Curved arc - Right side sweep (near, very slow)
  {
    id: 'arc-right',
    x: ['110vw', '75vw', '55vw', '45vw', '55vw', '75vw', '110vw'],
    y: ['-10vh', '20vh', '45vh', '55vh', '70vh', '85vh', '110vh'],
    duration: 55,
    delay: 2,
    depth: 3,
    ease: 'easeOut',
  },
  // Path 6: Curved arc - Left side sweep (mid)
  {
    id: 'arc-left',
    x: ['-15vw', '10vw', '25vw', '35vw', '25vw', '10vw', '-15vw'],
    y: ['110vh', '80vh', '55vh', '45vh', '30vh', '15vh', '-10vh'],
    duration: 42,
    delay: 12,
    depth: 2,
    ease: 'easeInOut',
  },
  // Path 7: Horizontal - Left to right (far, fast)
  {
    id: 'horiz-lr',
    x: ['-20vw', '30vw', '70vw', '120vw'],
    y: ['25vh', '28vh', '22vh', '26vh'],
    duration: 25,
    delay: 5,
    depth: 1,
    ease: 'linear',
  },
  // Path 8: Horizontal - Right to left (mid)
  {
    id: 'horiz-rl',
    x: ['120vw', '70vw', '30vw', '-20vw'],
    y: ['75vh', '72vh', '78vh', '74vh'],
    duration: 35,
    delay: 15,
    depth: 2,
    ease: 'easeOut',
  },
  // Path 9: Slow background - Very slow diagonal (far)
  {
    id: 'slow-bg-1',
    x: ['120vw', '50vw', '-20vw'],
    y: ['120vh', '50vh', '-20vh'],
    duration: 60,
    delay: 8,
    depth: 1,
    ease: 'linear',
  },
  // Path 10: Slow background - Counter diagonal (far)
  {
    id: 'slow-bg-2',
    x: ['-20vw', '50vw', '120vw'],
    y: ['120vh', '50vh', '-20vh'],
    duration: 52,
    delay: 18,
    depth: 1,
    ease: 'easeInOut',
  },
];

// Depth configuration affects visual appearance
export const depthConfig = {
  1: { scale: 0.7, opacity: 0.35, zIndex: 1 },  // Far - small, faded, fast
  2: { scale: 0.85, opacity: 0.45, zIndex: 2 }, // Mid
  3: { scale: 1.0, opacity: 0.55, zIndex: 3 },  // Near - full size, more visible, slow
};

// Mobile paths (fewer, simpler)
export const mobileTraversalPaths: TraversalPath[] = [
  traversalPaths[0], // diag-br-tl
  traversalPaths[1], // diag-bl-tr
  traversalPaths[4], // arc-right
  traversalPaths[6], // horiz-lr
  traversalPaths[8], // slow-bg-1
];
