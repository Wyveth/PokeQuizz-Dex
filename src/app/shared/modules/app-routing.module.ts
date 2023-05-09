import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/views/home/home.component';
import { PokedexComponent } from 'src/app/views/pokedex/pokedex.component';
import { PokemonDetailsComponent } from 'src/app/views/pokemon-details/pokemon-details.component';
import { AuthGuardService } from '../guards/auth-guard.service';

const routes: Routes = [
  { path: ':loc/home', component: HomeComponent, canActivate : [AuthGuardService] },
  { path: ':loc/pokedex', component: PokedexComponent },
  { path: ':loc/pokedex/pokemon/:id', component: PokemonDetailsComponent },
  { path: '', component: HomeComponent, canActivate : [AuthGuardService] },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
