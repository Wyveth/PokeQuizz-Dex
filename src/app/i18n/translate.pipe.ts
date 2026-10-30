import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from './i18n.service';
import { TranslationKey } from './fr';

/**
 * Traduit une clé : {{ 'quiz.start' | t: nbQuestions }}.
 * Impur pour suivre le changement de langue sans recharger la page.
 */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(key: TranslationKey, ...params: (string | number | null | undefined)[]): string {
    return this.i18n.t(key, ...params);
  }
}
