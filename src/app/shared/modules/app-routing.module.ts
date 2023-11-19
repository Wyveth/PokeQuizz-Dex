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
        loadChildren: () =>
          import('src/app/views/home/home.component').then(
            (m) => m.HomeComponent
          ),
        canActivate: [AuthGuardService],
      },
      {
        path: ':loc/pokedex',
        loadChildren: () =>
          import('src/app/views/pokedex/pokedex.component').then(
            (m) => m.PokedexComponent
          ),
      },
      {
        path: ':loc/pokemon/:id',
        loadChildren: () =>
          import(
            'src/app/views/pokemon-details/pokemon-details.component'
          ).then((m) => m.PokemonDetailsComponent),
      },
      {
        path: ':loc/game',
        loadChildren: () =>
          import(
            'src/app/views/pokemon-details/pokemon-details.component'
          ).then((m) => m.PokemonDetailsComponent),
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
