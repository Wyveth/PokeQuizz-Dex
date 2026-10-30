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
        loadComponent: () =>
          import('src/app/views/pokedex/pokedex.component').then(m => m.PokedexComponent)
      },
      {
        path: ':loc/pokemon/:id',
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
        loadComponent: () =>
          import('src/app/views/quiz/quiz-play/quiz-play.component').then(m => m.QuizPlayComponent)
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
