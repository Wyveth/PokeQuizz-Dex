import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { Pokemon } from 'src/app/Shared/Models/Concretes/Pokemon.model';
import { PokemonService } from 'src/app/Shared/Services/Pokemon.service';

@Component({
  selector: 'app-Pokedex',
  templateUrl: './Pokedex.component.html',
  styleUrls: ['./Pokedex.component.css']
})
export class PokedexComponent implements OnInit, OnDestroy {
  pokemons!: Pokemon[];
  pokemonSubscription!: Subscription;
  loc!: string;
  
  // Show a "Please wait..." message while loading
  waiting:Boolean = false;

  constructor(private pokemonService: PokemonService, private config: AppConfig, private route: ActivatedRoute) { 
    this.loc = this.route.snapshot.params['loc'];
  }
  
  ngOnInit() {
    this.waiting = true;
    this.pokemonSubscription = this.pokemonService.getPokemonsLight(false, 10).subscribe(
      (pokemons: Pokemon[]) => {
        this.pokemons = pokemons;
        this.waiting = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.pokemonSubscription.unsubscribe();
  }
}
