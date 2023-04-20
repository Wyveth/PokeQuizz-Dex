import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pokemon-evolution',
  templateUrl: './pokemon-evolution.component.html',
  styleUrls: ['./pokemon-evolution.component.scss']
})
export class PokemonEvolutionComponent implements OnInit {
  @Input() pokemons!: PokemonEvoVM[];
  constructor() { }

  ngOnInit() {
  }

}
