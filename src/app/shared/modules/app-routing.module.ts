import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';
import { LayoutComponent } from '../components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/EN/home', // Redirection vers '/default-route' pour une route vide
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: ':loc/home',
        loadComponent: () =>
          import('src/app/views/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: ':loc/pokedex',
        loadComponent: () =>
          import('src/app/views/pokedex/pokedex.component').then(
            (m) => m.PokedexComponent
          ),
      },
      {
        path: ':loc/pokemon/:id',
        loadComponent: () =>
          import(
            'src/app/views/pokemon-details/pokemon-details.component'
          ).then((m) => m.PokemonDetailsComponent),
      },
      {
        path: ':loc/game',
        loadComponent: () =>
          import('src/app/views/game/game.component').then(
            (m) => m.GameComponent
          ),
      },
      {
        path: ':loc/login',
        loadComponent: () =>
          import('src/app/views/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: ':loc/register',
        loadComponent: () =>
          import('src/app/views/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
