/** Contrat de l'API du jeu (WebApiScrapingData, docs/api-jeu-web.md). */
import { TranslationKey } from 'src/app/i18n/fr';
import { I18nService } from 'src/app/i18n/i18n.service';

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

/** Générations proposées (0 = Hisui). Le libellé se traduit avec generationLabel. */
export const GENERATIONS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export const DIFFICULTIES: { value: DifficultyCode; label: TranslationKey; questions: number }[] = [
  { value: 'Easy', label: 'difficulty.easy', questions: 10 },
  { value: 'Normal', label: 'difficulty.normal', questions: 15 },
  { value: 'Hard', label: 'difficulty.hard', questions: 20 }
];

export function difficultyKey(code: DifficultyCode | string | null | undefined): TranslationKey {
  return DIFFICULTIES.find(d => d.value === code)?.label ?? 'difficulty.normal';
}

/** Libellé traduit d'une génération. */
export function generationLabel(i18n: I18nService, value: number): string {
  return value === 0 ? i18n.t('generation.hisui') : i18n.t('generation.short', value);
}

/** Libellé traduit des réglages d'un quiz : générations · difficultés. */
export function settingsLabels(i18n: I18nService, quizz: QuizzSummary): { generations: string; difficulties: string } {
  const generations =
    quizz.generations.length === 0
      ? i18n.t('generation.all')
      : GENERATIONS.filter(g => quizz.generations.includes(g))
          .map(g => generationLabel(i18n, g))
          .join(', ');
  const difficulties = DIFFICULTIES.filter(d => quizz.difficulties.includes(d.value))
    .map(d => i18n.t(d.label))
    .join(' + ');
  return { generations, difficulties };
}
