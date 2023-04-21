import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataInfoLight } from 'src/app/api/models/concretes/datainfo';
import { PokemonLight } from 'src/app/api/models/concretes/pokemon';
import { PokemonService } from 'src/app/api/services/pokemon.service';
import { AppConfig } from 'src/app/app.config';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
})
export class PokedexComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  pokemons!: PokemonLight[];
  pokemonSubscription!: Subscription;
  loc!: string;

  // Show a "Please wait..." message while loading
  waiting = false;

  constructor(
    resources: AppResource,
    private pokemonService: PokemonService,
    private config: AppConfig,
    private route: ActivatedRoute
  ) {
    super(resources);
    this.loc = this.route.snapshot.params['loc'];
  }

  ngOnInit() {
    this.waiting = true;

    const pokedexOK = localStorage.getItem('pokedex');
    if (!pokedexOK) {
      this.pokemonSubscription = this.pokemonService
        .getPokemonsLight(false, 10)
        .subscribe((pokemons: PokemonLight[]) => {
          this.pokemons = pokemons;

          pokemons.forEach((pokemon) => {
            localStorage.setItem(
              pokemon.Id.toString(),
              JSON.stringify(
                new PokemonLight(
                  pokemon.Id,
                  pokemon.Number,
                  new DataInfoLight(pokemon.Id, pokemon.FR.Name),
                  new DataInfoLight(pokemon.Id, pokemon.EN.Name),
                  new DataInfoLight(pokemon.Id, pokemon.ES.Name),
                  new DataInfoLight(pokemon.Id, pokemon.IT.Name),
                  new DataInfoLight(pokemon.Id, pokemon.DE.Name),
                  new DataInfoLight(pokemon.Id, pokemon.RU.Name),
                  new DataInfoLight(pokemon.Id, pokemon.CO.Name),
                  new DataInfoLight(pokemon.Id, pokemon.CN.Name),
                  new DataInfoLight(pokemon.Id, pokemon.JP.Name),
                  pokemon.Types,
                  pokemon.PathImg
                )
              )
            );
          });
        });

      localStorage.setItem('pokedex', 'true');

      this.waiting = false;
    } else {
      this.pokemons = [];
      for (let i = 1; i < 1250; i++) {
        const pokemon = JSON.parse(localStorage.getItem(i.toString())!);
        this.pokemons.push(pokemon);
      }
      this.waiting = false;
    }
  }

  ngOnDestroy(): void {
    if (this.pokemonSubscription) this.pokemonSubscription.unsubscribe();
  }
}