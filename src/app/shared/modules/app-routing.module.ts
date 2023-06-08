import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/views/home/home.component';
import { AuthGuardService } from '../guards/auth-guard.service';

const routes: Routes = [
  {
    path: ':loc/home',
    component: HomeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: ':loc/pokedex',
    loadChildren: () =>
      import('src/app/views/pokedex/pokedex.module').then(
        (m) => m.PokedexModule
      ),
  },
  {
    path: ':loc/pokedex/pokemon/:id',
    loadChildren: () =>
      import('src/app/views/pokemon-details/pokemon-details.module').then(
        (m) => m.PokemonDetailsModule
      ),
  },
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
