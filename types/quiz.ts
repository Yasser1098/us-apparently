export type AnswerType = 'single-choice' | 'text';

export interface AnswerOption {
  id: string;
  label: string;
  emoji?: string;
}

export interface Question {
  id: string;
  number: number;
  category: string;
  text: string;
  emoji?: string;
  type: AnswerType;
  options?: AnswerOption[];
  weight: number;
  scorable: boolean;
}

export type Answers = Record<string, string>;

export interface QuizState {
  answers: Answers;
  currentQuestion: number;
  completed: boolean;
  role: 'creator' | 'player';
}

export interface CompatibilityResult {
  score: number;
  matchCount: number;
  totalComparable: number;
  matches: MatchedAnswer[];
  differences: DifferentAnswer[];
  conclusion: string;
  subConclusion: string;
}

export interface MatchedAnswer {
  questionText: string;
  emoji: string;
  answer: string;
}

export interface DifferentAnswer {
  questionText: string;
  answerA: string;
  answerB: string;
  emojiA: string;
  emojiB: string;
}

export interface SharedPayload {
  v: number;
  a: Answers;
}
