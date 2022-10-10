import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from 'src/app/Shared/Models/Pokemon.model';
import { PokemonService } from 'src/app/Shared/Services/Pokemon.service';

@Component({
  selector: 'app-Pokemon-Details',
  templateUrl: './Pokemon-Details.component.html',
  styleUrls: ['./Pokemon-Details.component.css']
})
export class PokemonDetailsComponent implements OnInit {
  pokemon!: Pokemon;
  key!: number;
  constructor(private route: ActivatedRoute, private pokemonService: PokemonService, private router: Router) { }

  ngOnInit() {
    this.key = this.route.snapshot.params['id'];
    this.pokemonService.getPokemon(this.key).subscribe(
      (pokemon: Pokemon) => {
        this.pokemon = pokemon;
      }
    );
  }
}
