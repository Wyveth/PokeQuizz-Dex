import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/views/home/home.component';
import { PokedexComponent } from 'src/app/views/pokedex/pokedex.component';
import { PokemonDetailsComponent } from 'src/app/views/pokemon-details/pokemon-details.component';

const routes: Routes = [
  { path: ':loc/home', component: HomeComponent },
  { path: ':loc/pokedex', component: PokedexComponent },
  { path: ':loc/pokedex/pokemon/:id', component: PokemonDetailsComponent },
  { path: '', component: HomeComponent },
  { path: 'pokedex', redirectTo: 'EN/pokedex' },
  { path: 'pokedex/pokemon/:id', redirectTo: 'pokedex/pokemon/:id' },
  { path: 'home', redirectTo: 'EN/pokedex' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
