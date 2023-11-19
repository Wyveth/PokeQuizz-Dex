import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';
import { LayoutComponent } from '../components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: ':loc/home',
        loadComponent: () =>
          import('src/app/views/home/home.component').then(
            (m) => m.HomeComponent
          ),
        canActivate: [AuthGuardService],
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
      { path: '**', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
