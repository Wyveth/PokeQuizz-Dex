import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';
import { LayoutComponent } from '../components/layout/layout.component';

const routes: Routes = [
  {
    path: ':loc',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('src/app/views/home/home.component').then(
            (m) => m.HomeComponent
          ),
        canActivate: [AuthGuardService],
      },
      {
        path: 'pokedex',
        loadComponent: () =>
          import('src/app/views/pokedex/pokedex.component').then(
            (m) => m.PokedexComponent
          ),
      },
      {
        path: 'pokemon/:id',
        loadComponent: () =>
          import(
            'src/app/views/pokemon-details/pokemon-details.component'
          ).then((m) => m.PokemonDetailsComponent),
      },
      {
        path: 'game',
        loadComponent: () =>
          import('src/app/views/game/game.component').then(
            (m) => m.GameComponent
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('src/app/views/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('src/app/views/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },
  { path: '', redirectTo: 'EN/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
