/** Contrat de l'API des duels (WebApiScrapingData, docs/api-jeu-web.md). */
import { DifficultyCode } from './quizz';

export type DuelMode = 'Live' | 'Async';
export type DuelStatus = 'Searching' | 'Invited' | 'InProgress' | 'Finished' | 'Declined' | 'Cancelled' | 'Expired';
export type DuelResult = 'Win' | 'Loss' | 'Draw';

export interface DuelPlayer {
  userName: string | null;
  score: number;
  answered: number;
  done: boolean;
}

export interface Duel {
  id: string;
  mode: DuelMode;
  status: DuelStatus;
  difficulty: DifficultyCode;
  generations: number[];
  isPrivate: boolean;
  isChallenger: boolean;
  me: DuelPlayer;
  opponent: DuelPlayer | null;
  total: number;
  nextOrder: number | null;
  canPlay: boolean;
  currentOrder: number;
  questionStartsAt: string | null;
  questionEndsAt: string | null;
  questionSeconds: number;
  serverTime: string;
  result: DuelResult | null;
  forfeit: boolean;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}

/** Réglages serveur des duels (appsettings.json, section Duel). */
export interface DuelSettings {
  questionSeconds: Record<string, number>;
  countdownSeconds: number;
  pauseSeconds: number;
  winPoints: Record<string, number>;
}

export type LeaderboardPeriod = 'all' | 'month';
export type LeaderboardSort = 'wins' | 'points';

export interface LeaderboardEntry {
  rank: number;
  userName: string | null;
  isMe: boolean;
  /** Connecté en ce moment. */
  isOnline: boolean;
  /** Victoires pondérées par la difficulté. */
  rankingPoints: number;
  /** Points marqués en duel, victoires et défaites comprises. */
  duelPoints: number;
  played: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface Leaderboard {
  period: LeaderboardPeriod;
  sort: LeaderboardSort;
  since: string | null;
  entries: LeaderboardEntry[];
  me: LeaderboardEntry | null;
}

export interface DuelStats {
  played: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface FriendCode {
  code: string;
}

export interface DuelChallenge {
  friendCode: string;
  mode: DuelMode;
  difficulty: DifficultyCode;
  generations: number[];
}
