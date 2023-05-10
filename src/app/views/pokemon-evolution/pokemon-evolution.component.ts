import { Component, Input, OnInit } from '@angular/core';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { PokemonEvoVM } from 'src/app/shared/models/pokemonEvoVM';

@Component({
  selector: 'app-pokemon-evolution',
  templateUrl: './pokemon-evolution.component.html',
  styleUrls: ['./pokemon-evolution.component.scss'],
})
export class PokemonEvolutionComponent extends BaseComponent implements OnInit {
  @Input() pokemons!: PokemonEvoVM[];
  constructor(resources: AppResource) {
    super(resources);
  }

  ngOnInit() {}
}
