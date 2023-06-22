import { NgModule } from '@angular/core';
import { PokedexComponent } from './pokedex.component';
import { SearchComponent } from '../search/search.component';
import { PokemonItemComponent } from '../pokemon-item/pokemon-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: PokedexComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule],
  declarations: [PokedexComponent, SearchComponent, PokemonItemComponent],
})
export class PokedexModule {}
