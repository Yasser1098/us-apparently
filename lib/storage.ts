import { Answers, QuizState } from '@/types/quiz';

const CREATOR_KEY = 'us_apparently_creator';
const PLAYER_KEY = 'us_apparently_player';
const RESULT_KEY = 'us_apparently_result';

export function saveCreatorProgress(state: Partial<QuizState>): void {
  try {
    const existing = loadCreatorProgress() ?? {};
    localStorage.setItem(
      CREATOR_KEY,
      JSON.stringify({ ...existing, ...state })
    );
  } catch {
    // localStorage not available
  }
}

export function loadCreatorProgress(): QuizState | null {
  try {
    const raw = localStorage.getItem(CREATOR_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizState;
  } catch {
    return null;
  }
}

export function clearCreatorProgress(): void {
  try {
    localStorage.removeItem(CREATOR_KEY);
  } catch {
    // ignore
  }
}

export function savePlayerProgress(state: Partial<QuizState>): void {
  try {
    const existing = loadPlayerProgress() ?? {};
    localStorage.setItem(
      PLAYER_KEY,
      JSON.stringify({ ...existing, ...state })
    );
  } catch {
    // localStorage not available
  }
}

export function loadPlayerProgress(): QuizState | null {
  try {
    const raw = localStorage.getItem(PLAYER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizState;
  } catch {
    return null;
  }
}

export function clearPlayerProgress(): void {
  try {
    localStorage.removeItem(PLAYER_KEY);
  } catch {
    // ignore
  }
}

export function saveResultAnswers(
  creatorAnswers: Answers,
  playerAnswers: Answers
): void {
  try {
    localStorage.setItem(
      RESULT_KEY,
      JSON.stringify({ creatorAnswers, playerAnswers })
    );
  } catch {
    // ignore
  }
}

export function loadResultAnswers(): {
  creatorAnswers: Answers;
  playerAnswers: Answers;
} | null {
  try {
    const raw = localStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAll(): void {
  try {
    localStorage.removeItem(CREATOR_KEY);
    localStorage.removeItem(PLAYER_KEY);
    localStorage.removeItem(RESULT_KEY);
  } catch {
    // ignore
  }
}
