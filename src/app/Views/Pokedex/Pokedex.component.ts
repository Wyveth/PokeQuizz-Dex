import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { DataInfoLight } from 'src/app/Shared/Models/Concretes/DataInfo.model';
import { PokemonLight } from 'src/app/Shared/Models/Concretes/Pokemon.model';
import { PokemonService } from 'src/app/Shared/Services/Pokemon.service';

@Component({
  selector: 'app-Pokedex',
  templateUrl: './Pokedex.component.html',
  styleUrls: ['./Pokedex.component.scss']
})
export class PokedexComponent implements OnInit, OnDestroy {
  pokemons!: PokemonLight[];
  pokemonSubscription!: Subscription;
  loc!: string;
  
  // Show a "Please wait..." message while loading
  waiting:Boolean = false;

  constructor(private pokemonService: PokemonService, private config: AppConfig, private route: ActivatedRoute) { 
    this.loc = this.route.snapshot.params['loc'];
  }
  
  ngOnInit() {
    this.waiting = true;

    let pokedexOK = localStorage.getItem('pokedex');
    if(!pokedexOK) 
    this.pokemonSubscription = this.pokemonService.getPokemonsLight(false, 10).subscribe(
      (pokemons: PokemonLight[]) => {
        this.pokemons = pokemons;

        pokemons.forEach(pokemon => {
          localStorage.setItem(pokemon.Id.toString(), JSON.stringify(new PokemonLight(
            pokemon.Id, 
            pokemon.Number,
            new DataInfoLight(pokemon.FR.Name), 
            new DataInfoLight(pokemon.EN.Name), 
            new DataInfoLight(pokemon.ES.Name), 
            new DataInfoLight(pokemon.IT.Name), 
            new DataInfoLight(pokemon.DE.Name),
            new DataInfoLight(pokemon.RU.Name),
            new DataInfoLight(pokemon.CO.Name), 
            new DataInfoLight(pokemon.CN.Name), 
            new DataInfoLight(pokemon.JP.Name),
            pokemon.Types,
            pokemon.PathImg 
            )));
        });

        localStorage.setItem('pokedex', 'true');
        
        this.waiting = false;
      }
    );
    else{
      this.pokemons = [];
      for(let i = 1; i < 1250; i++){
        let pokemon = JSON.parse(localStorage.getItem(i.toString())!);
        this.pokemons.push(pokemon);
      }
      this.waiting = false;
    }
    
  }

  ngOnDestroy(): void {
    if(this.pokemonSubscription)
    this.pokemonSubscription.unsubscribe();
  }
}
