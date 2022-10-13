import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataInfo } from 'src/app/Shared/Models/DataInfo.model';
import { Pokemon } from 'src/app/Shared/Models/Pokemon.model';
import { TypePok } from 'src/app/Shared/Models/TypePok.model';
import { PokemonService } from 'src/app/Shared/Services/Pokemon.service';

@Component({
  selector: 'app-Pokemon-Details',
  templateUrl: './Pokemon-Details.component.html',
  styleUrls: ['./Pokemon-Details.component.css']
})
export class PokemonDetailsComponent implements OnInit, OnDestroy {
  pokemon!: Pokemon;
  firstTypes!: TypePok;

  pokemonSubscription!: Subscription;
  
  key!: number;

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService, private router: Router) { }

  ngOnInit() {
    this.key = this.route.snapshot.params['id'];
    this.pokemonSubscription = this.pokemonService.getPokemon(this.key).subscribe(
      (pokemon: Pokemon) => {
        this.pokemon = pokemon;
        this.firstTypes = this.pokemon.Types[0].typePok;
      }
    );
  }

  ngOnDestroy(): void {
    this.pokemonSubscription.unsubscribe();
  }
}
