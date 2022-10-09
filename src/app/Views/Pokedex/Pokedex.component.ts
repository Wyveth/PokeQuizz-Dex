import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private pokemonService: PokemonService, private config: AppConfig) { }
  
  ngOnInit() {
    this.waiting = true;
    this.pokemonSubscription = this.pokemonService.getPokemons(false, 10).subscribe(
      (pokemons: Pokemon[]) => {
        this.pokemons = pokemons;
        pokemons.forEach(pokemon => {
          pokemon.UrlImg = this.config.getConfig('img_root') + pokemon.UrlImg,
          pokemon.UrlSprite = this.config.getConfig('img_root') + pokemon.UrlSprite
        });
        this.waiting = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.pokemonSubscription.unsubscribe();
  }
}
