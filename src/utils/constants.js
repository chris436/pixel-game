export const AVATAR_SEEDS = Array.from({ length: 100 }, (_, i) => `avatar_${i}`);

export const GAME_CONFIG = {
  PASS_THRESHOLD: parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3', 10),
  QUESTION_COUNT: parseInt(import.meta.env.VITE_QUESTION_COUNT || '5', 10),
};
