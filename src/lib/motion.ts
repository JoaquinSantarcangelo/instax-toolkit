export const NOTHING_EASING = [0.16, 1, 0.3, 1] as const;

export const NOTHING_TRANSITION = {
  duration: 0.5,
  ease: NOTHING_EASING,
} as const;

export const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: NOTHING_TRANSITION,
} as const;
