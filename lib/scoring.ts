import { Answers, CompatibilityResult, MatchedAnswer, DifferentAnswer } from '@/types/quiz';
import { QUESTIONS } from './questions';

export function calculateCompatibility(
  answersA: Answers,
  answersB: Answers
): CompatibilityResult {
  let totalWeight = 0;
  let earnedWeight = 0;
  let matchCount = 0;
  const matches: MatchedAnswer[] = [];
  const differences: DifferentAnswer[] = [];

  for (const question of QUESTIONS) {
    if (!question.scorable) continue;
    const aAnswer = answersA[question.id];
    const bAnswer = answersB[question.id];

    if (!aAnswer || !bAnswer) continue;

    totalWeight += question.weight;

    if (aAnswer === bAnswer) {
      earnedWeight += question.weight;
      matchCount++;

      // Find the option label for display
      const option = question.options?.find((o) => o.id === aAnswer);
      matches.push({
        questionText: question.text,
        emoji: option?.emoji ?? question.emoji ?? '✨',
        answer: option?.label ?? aAnswer,
      });
    } else {
      const optionA = question.options?.find((o) => o.id === aAnswer);
      const optionB = question.options?.find((o) => o.id === bAnswer);

      // Only show max 5 differences
      if (differences.length < 5) {
        differences.push({
          questionText: question.text,
          answerA: optionA?.label ?? aAnswer,
          answerB: optionB?.label ?? bAnswer,
          emojiA: optionA?.emoji ?? '🔵',
          emojiB: optionB?.emoji ?? '🟣',
        });
      }
    }
  }

  const score =
    totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  const totalComparable = QUESTIONS.filter(
    (q) => q.scorable && answersA[q.id] && answersB[q.id]
  ).length;

  const { conclusion, subConclusion } = getConclusion(score, matchCount);

  return {
    score,
    matchCount,
    totalComparable,
    matches: matches.slice(0, 8),
    differences: differences.slice(0, 3),
    conclusion,
    subConclusion,
  };
}

function getConclusion(
  score: number,
  matchCount: number
): { conclusion: string; subConclusion: string } {
  if (score >= 90) {
    return {
      conclusion: 'This is getting suspicious. Someone explain why we agree on everything.',
      subConclusion: `${matchCount} identical answers. Either we share one brain cell or this is fate doing too much.`,
    };
  }
  if (score >= 75) {
    return {
      conclusion: 'Okayyy… we might actually work. 👀',
      subConclusion: `${matchCount} matching answers. Should we just skip the awkward first date?`,
    };
  }
  if (score >= 60) {
    return {
      conclusion: 'Not bad. Enough in common to be dangerous.',
      subConclusion: `${matchCount} answers matched. Apparently we have a type — each other.`,
    };
  }
  if (score >= 40) {
    return {
      conclusion: 'Opposites attract, apparently 😂',
      subConclusion: `Only ${matchCount} matches, but honestly that might keep things interesting.`,
    };
  }
  return {
    conclusion: "Well… at least we'll never run out of things to argue about.",
    subConclusion: `${matchCount} matching answers. This is either a challenge or a cautionary tale.`,
  };
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Suspicious Match 👀';
  if (score >= 75) return 'Great Match 💘';
  if (score >= 60) return 'Good Match ✨';
  if (score >= 40) return 'Interesting Combo 🤔';
  return 'Chaotic Duo 😂';
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'from-pink-500 to-rose-500';
  if (score >= 75) return 'from-pink-400 to-purple-500';
  if (score >= 60) return 'from-purple-400 to-indigo-500';
  if (score >= 40) return 'from-indigo-400 to-blue-500';
  return 'from-blue-400 to-cyan-500';
}
