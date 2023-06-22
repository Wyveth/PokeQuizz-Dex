import { NgModule } from '@angular/core';
import { PokemonDetailsComponent } from './pokemon-details.component';
import { PokemonEvolutionComponent } from '../pokemon-evolution/pokemon-evolution.component';
import { PokemonAttackComponent } from '../pokemon-attack/pokemon-attack.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: PokemonDetailsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [
    PokemonDetailsComponent,
    PokemonEvolutionComponent,
    PokemonAttackComponent,
  ],
})
export class PokemonDetailsModule {}
