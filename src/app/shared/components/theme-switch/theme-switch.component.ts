import { TranslatePipe } from 'src/app/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Theme, ThemeService } from 'src/app/api/services/theme.service';
import { TranslationKey } from 'src/app/i18n/fr';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  standalone: true,
  imports: [TranslatePipe, CommonModule]
})
export class ThemeSwitchComponent {
  options: Theme[] = ['light', 'dark', 'auto'];
  icons: Record<Theme, string> = {
    light: 'pi-sun',
    dark: 'pi-moon',
    auto: 'pi-desktop'
  };
  labels: Record<Theme, TranslationKey> = {
    light: 'theme.light',
    dark: 'theme.dark',
    auto: 'theme.auto'
  };

  current: Theme;

  constructor(private themeService: ThemeService) {
    this.current = this.themeService.getTheme();
  }

  /** Passe à l’option suivante avec animation */
  nextTheme() {
    const currentIndex = this.options.indexOf(this.current);
    const nextIndex = (currentIndex + 1) % this.options.length;
    this.current = this.options[nextIndex];
    this.themeService.setTheme(this.current);
  }
}
