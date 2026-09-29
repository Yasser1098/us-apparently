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
      conclusion: 'Nesrine… this is getting suspicious 😂',
      subConclusion: 'You two agree on way too many things. Should we skip the awkward first date and start discussing wedding seating arrangements? 👀',
    };
  }
  if (score >= 75) {
    return {
      conclusion: 'Okayyy… that\'s actually pretty convincing 👀',
      subConclusion: 'Someone might want to investigate this further.',
    };
  }
  if (score >= 60) {
    return {
      conclusion: 'Not bad at all 😌',
      subConclusion: 'Enough similarities to make things interesting… and enough differences to keep us entertained.',
    };
  }
  if (score >= 40) {
    return {
      conclusion: 'Well… this could be interesting 😂',
      subConclusion: 'Clearly we\'re going to have things to debate.',
    };
  }
  return {
    conclusion: 'Okay, apparently you enjoy disagreeing with me 😂',
    subConclusion: 'Which is either terrible news… or exactly what makes this interesting.',
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
