/** Contrat de l'API du jeu (WebApiScrapingData, docs/api-jeu-web.md). */

export type DifficultyCode = 'Easy' | 'Normal' | 'Hard';

export interface QuizzCreate {
  /** 1 à 9, 0 pour Hisui. Vide = toutes. */
  generations: number[];
  difficulties: DifficultyCode[];
}

export interface QuizzSummary {
  id: string;
  createdAt: string;
  generations: number[];
  difficulties: DifficultyCode[];
  nbQuestions: number;
  nbAnswered: number;
  nbCorrect: number;
  done: boolean;
  nextOrder: number | null;
  isOwned: boolean;
}

export type SubjectKind =
  | 'Pokemon'
  | 'PokemonDescription'
  | 'Type'
  | 'Ability'
  | 'AbilityDescription';

export interface QuestionSubject {
  kind: SubjectKind;
  name: string | null;
  description: string | null;
  hasImage: boolean;
  hasSound: boolean;
}

export interface AnswerChoice {
  id: number;
  order: number;
  label: string | null;
}

export interface AnswerResult {
  isCorrect: boolean;
  alreadyAnswered: boolean;
  correctAnswerIds: number[];
  selectedAnswerIds: number[];
  quizzDone: boolean;
  nextOrder: number | null;
}

export interface Question {
  quizzId: string;
  order: number;
  total: number;
  code: string;
  label: string | null;
  difficultyCode: DifficultyCode | null;
  isMultipleAnswers: boolean;
  isBlurred: boolean;
  isGrayscale: boolean;
  isHide: boolean;
  subject: QuestionSubject;
  answers: AnswerChoice[];
  done: boolean;
  result: AnswerResult | null;
}

export interface QuestionResult {
  order: number;
  code: string;
  label: string | null;
  subjectName: string | null;
  done: boolean;
  isCorrect: boolean;
  correctAnswers: (string | null)[];
  selectedAnswers: (string | null)[];
}

export interface QuizzResult {
  summary: QuizzSummary;
  questions: QuestionResult[];
}

export const GENERATIONS: { value: number; label: string }[] = [
  { value: 1, label: 'Gen 1' },
  { value: 2, label: 'Gen 2' },
  { value: 3, label: 'Gen 3' },
  { value: 4, label: 'Gen 4' },
  { value: 5, label: 'Gen 5' },
  { value: 6, label: 'Gen 6' },
  { value: 7, label: 'Gen 7' },
  { value: 8, label: 'Gen 8' },
  { value: 9, label: 'Gen 9' },
  { value: 0, label: 'Hisui' }
];

export const DIFFICULTIES: { value: DifficultyCode; label: string; questions: number }[] = [
  { value: 'Easy', label: 'Facile', questions: 10 },
  { value: 'Normal', label: 'Normal', questions: 15 },
  { value: 'Hard', label: 'Difficile', questions: 20 }
];
