import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DE } from './de';
import { EN } from './en';
import { ES } from './es';
import { FR, TranslationKey, Translations } from './fr';
import { IT } from './it';

/** Langues de l'interface (celles du sélecteur de langue). */
export const UI_LANGUAGES = ['FR', 'EN', 'ES', 'IT', 'DE'] as const;
export type UiLanguage = (typeof UI_LANGUAGES)[number];

const DICTIONARIES: Record<UiLanguage, Translations> = { FR, EN, ES, IT, DE };

/**
 * Traduction des textes de l'interface. La langue suit le premier segment de l'URL (/FR/…, /EN/…),
 * comme les données venant de l'API. Une langue de données sans traduction d'interface (RU, JP…) utilise l'anglais.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  /** Code de langue de l'URL (peut être RU, JP… pour les données). */
  readonly lang = signal<string>('FR');

  constructor(
    router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.updateFromUrl(router.url);
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.updateFromUrl((event as NavigationEnd).urlAfterRedirects));
  }

  /** Langue effectivement utilisée pour l'interface. */
  get uiLanguage(): UiLanguage {
    const lang = this.lang();
    return (UI_LANGUAGES as readonly string[]).includes(lang) ? (lang as UiLanguage) : 'EN';
  }

  t(key: TranslationKey, ...params: (string | number | null | undefined)[]): string {
    const text = DICTIONARIES[this.uiLanguage][key] ?? FR[key] ?? key;
    return params.length === 0
      ? text
      : text.replace(/\{(\d+)\}/g, (match, index) => String(params[Number(index)] ?? match));
  }

  private updateFromUrl(url: string) {
    const segment = (url.split(/[/?#]/)[1] ?? '').toUpperCase();
    if (/^[A-Z]{2}$/.test(segment)) {
      this.lang.set(segment);
      this.document.documentElement.lang = this.uiLanguage.toLowerCase();
    }
  }
}
