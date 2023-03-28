import { Component, Input, OnInit } from '@angular/core';
import { PokemonEvoVM } from 'src/app/Shared/ViewModels/PokemonEvoVM.model';

@Component({
  selector: 'app-Pokemon-Evolution',
  templateUrl: './Pokemon-Evolution.component.html',
  styleUrls: ['./Pokemon-Evolution.component.css']
})
export class PokemonEvolutionComponent implements OnInit {
  @Input() pokemons!: PokemonEvoVM[];
  constructor() { }

  ngOnInit() {
  }

}
