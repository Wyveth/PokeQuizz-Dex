/** Contrat de l'API du pendu (WebApiScrapingData, docs/api-jeu-web.md). */

export type HangmanMode = 'Solo' | 'Coop';
/** Facile : indices progressifs ; Normal : aucun indice. */
export type HangmanDifficulty = 'Easy' | 'Normal';
export type HangmanStatus = 'Invited' | 'InProgress' | 'Finished' | 'Declined' | 'Cancelled';

export interface HangmanLetter {
  letter: string;
  correct: boolean;
}

export interface HangmanHints {
  types: { name: string | null; image: string | null }[] | null;
  generation: number | null;
  description: string | null;
  silhouette: boolean;
}

export interface HangmanReveal {
  name: string | null;
  image: string | null;
  found: boolean;
}

export interface Hangman {
  id: string;
  mode: HangmanMode;
  difficulty: HangmanDifficulty;
  status: HangmanStatus;
  lang: string;
  generations: number[];
  lives: number;
  maxLives: number;
  found: number;
  /** Lettres trouvées, "_" pour les lettres cachées. */
  mask: string | null;
  letters: HangmanLetter[];
  wrongCount: number;
  hints: HangmanHints;
  nextHintAt: number | null;
  last: HangmanReveal | null;
  isMyTurn: boolean;
  turnUserName: string | null;
  partner: string | null;
  isInviter: boolean;
  bestScore: number | null;
  createdAt: string;
  finishedAt: string | null;
}
