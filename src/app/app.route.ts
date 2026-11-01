import { notInDuelGuard } from './shared/guards/not-in-duel.guard';
import { loggedInGuard } from './shared/guards/logged-in.guard';
import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { AuthGuardService } from './shared/guards/auth-guard.service';

export const routes: Routes = [
  {
    path: 'pokedex',
    redirectTo: 'FR/pokedex',
    pathMatch: 'full'
  },
  { path: '', redirectTo: 'FR/pokedex', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: ':loc/home',
        loadComponent: () => import('src/app/views/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: ':loc/pokedex',
        canActivate: [notInDuelGuard],
        loadComponent: () =>
          import('src/app/views/pokedex/pokedex.component').then(m => m.PokedexComponent)
      },
      {
        path: ':loc/pokemon/:id',
        canActivate: [notInDuelGuard],
        // Sur mobile, menu masqué pour laisser la place à la fiche
        data: { immersive: true },
        loadComponent: () =>
          import('src/app/views/pokemon-details/pokemon-details.component').then(
            m => m.PokemonDetailsComponent
          )
      },
      // Ancienne page "jeux" : le quiz la remplace
      { path: ':loc/game', redirectTo: ':loc/quiz', pathMatch: 'full' },
      {
        path: ':loc/quiz',
        loadComponent: () =>
          import('src/app/views/quiz/quiz-setup/quiz-setup.component').then(m => m.QuizSetupComponent)
      },
      {
        path: ':loc/quiz/:id/result',
        loadComponent: () =>
          import('src/app/views/quiz/quiz-result/quiz-result.component').then(
            m => m.QuizResultComponent
          )
      },
      {
        path: ':loc/quiz/:id/:order',
        // Sur mobile, la question occupe tout l'écran sans défilement
        data: { immersive: true },
        loadComponent: () =>
          import('src/app/views/quiz/quiz-play/quiz-play.component').then(m => m.QuizPlayComponent)
      },
      {
        path: ':loc/leaderboard',
        loadComponent: () =>
          import('src/app/views/duel/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)
      },
      {
        path: ':loc/duel',
        canActivate: [loggedInGuard],
        loadComponent: () =>
          import('src/app/views/duel/duel-lobby/duel-lobby.component').then(m => m.DuelLobbyComponent)
      },
      {
        path: ':loc/duel/:id',
        canActivate: [loggedInGuard],
        // Sur mobile, la partie occupe tout l'écran sans défilement
        data: { immersive: true },
        loadComponent: () =>
          import('src/app/views/duel/duel-play/duel-play.component').then(m => m.DuelPlayComponent)
      },
      {
        path: ':loc/hangman',
        loadComponent: () =>
          import('src/app/views/hangman/hangman-home/hangman-home.component').then(m => m.HangmanHomeComponent)
      },
      {
        path: ':loc/hangman/:id',
        // Sur mobile, la partie occupe tout l'écran (clavier en bas)
        data: { immersive: true },
        loadComponent: () =>
          import('src/app/views/hangman/hangman-play/hangman-play.component').then(m => m.HangmanPlayComponent)
      },
      {
        path: ':loc/admin',
        canActivate: [loggedInGuard],
        loadComponent: () => import('src/app/views/admin/admin.component').then(m => m.AdminComponent)
      },
      {
        path: ':loc/forgot-password',
        loadComponent: () =>
          import('src/app/views/password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: ':loc/reset-password',
        loadComponent: () =>
          import('src/app/views/password/reset-password.component').then(m => m.ResetPasswordComponent)
      },
      {
        path: ':loc/login',
        loadComponent: () =>
          import('src/app/views/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: ':loc/register',
        loadComponent: () =>
          import('src/app/views/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  }
];
