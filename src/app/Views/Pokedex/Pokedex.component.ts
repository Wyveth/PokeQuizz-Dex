import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { Pokemon } from 'src/app/Shared/Models/Pokemon.model';
import { PokemonService } from 'src/app/Shared/Services/Pokemon.service';

@Component({
  selector: 'app-Pokedex',
  templateUrl: './Pokedex.component.html',
  styleUrls: ['./Pokedex.component.css']
})
export class PokedexComponent implements OnInit, OnDestroy {
  pokemons!: Pokemon[];
  pokemonSubscription!: Subscription;

  // Show a "Please wait..." message while loading
  waiting:Boolean = false;
  router: any;

  constructor(private pokemonService: PokemonService, private config: AppConfig) { }
  
  ngOnInit() {
    this.waiting = true;
    this.pokemonSubscription = this.pokemonService.getPokemonsLight(false, 10).subscribe(
      (pokemons: Pokemon[]) => {
        this.pokemons = pokemons;
        // pokemons.forEach(pokemon => {
        //   pokemon.UrlImg = this.config.getConfig('img_root') + pokemon.UrlImg,
        //   pokemon.UrlSprite = this.config.getConfig('img_root') + pokemon.UrlSprite

        //   pokemon.Types.forEach(type => {
        //     type.typePok.UrlMiniHome_FR = this.config.getConfig('img_root') + type.typePok.UrlMiniHome_FR;
        //     type.typePok.UrlMiniHome_EN = this.config.getConfig('img_root') + type.typePok.UrlMiniHome_EN;
        //     type.typePok.UrlMiniHome_ES = this.config.getConfig('img_root') + type.typePok.UrlMiniHome_ES;
        //     type.typePok.UrlMiniHome_IT = this.config.getConfig('img_root') + type.typePok.UrlMiniHome_IT;
        //     type.typePok.UrlMiniHome_DE = this.config.getConfig('img_root') + type.typePok.UrlMiniHome_DE;
        //     type.typePok.UrlMiniHome_RU = this.config.getConfig('img_root') + type.typePok.UrlMiniHome_RU;
        //     type.typePok.UrlMiniHome_CO = this.config.getConfig('img_root') + type.typePok.UrlMiniHome_CO;
        //     type.typePok.UrlMiniHome_CN = this.config.getConfig('img_root') + type.typePok.UrlMiniHome_CN;
        //     type.typePok.UrlMiniHome_JP = this.config.getConfig('img_root') + type.typePok.UrlMiniHome_JP;
        //   });
        // });
        this.waiting = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.pokemonSubscription.unsubscribe();
  }
}
