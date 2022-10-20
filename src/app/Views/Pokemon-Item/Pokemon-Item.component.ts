import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { Pokemon } from 'src/app/Shared/Models/Pokemon.model';

export class pokemonVm{
  Id!: Number;
  Number!: string;
  Name!: string;
  UrlImg!: string;
  UrlTypes: string[] = [];
}

@Component({
  selector: 'app-Pokemon-Item',
  templateUrl: './Pokemon-Item.component.html',
  styleUrls: ['./Pokemon-Item.component.css']
})
export class PokemonItemComponent implements OnInit {
  @Input() pokemon!: Pokemon;
  @Input() localisation: string = "DE";
  pokemonVm!: pokemonVm;

  constructor(private router: Router, private config: AppConfig) { 
    this.pokemonVm = new pokemonVm();
  }

  ngOnInit() {
    this.getDataByLocalisation(this.pokemonVm, this.localisation);
  }

  public goToPokemonDetails(Id: Number): void {
    this.router.navigate([`/pokedex/pokemon/${Id}`]);
  }

  private getDataByLocalisation(pokemonVm: pokemonVm, localisation: string): void{
    this.pokemonVm.Id = this.pokemon.Id;
    this.pokemonVm.Number = this.pokemon.Number;
    this.pokemonVm.UrlImg = this.config.getConfig('img_root') + this.pokemon.UrlImg;

    switch (localisation) {
      case "FR":
        this.pokemonVm.Name = this.pokemon.FR.Name;
        this.pokemon.Types.forEach(type => {
          this.pokemonVm.UrlTypes.push(this.config.getConfig('img_root') + type.typePok.UrlMiniHome_FR);
        });
        break;
      case "EN":
        this.pokemonVm.Name = this.pokemon.EN.Name;
        this.pokemon.Types.forEach(type => {
          this.pokemonVm.UrlTypes.push(this.config.getConfig('img_root') + type.typePok.UrlMiniHome_EN);
        });
        break;
      case "ES":
        this.pokemonVm.Name = this.pokemon.ES.Name;
        this.pokemon.Types.forEach(type => {
          this.pokemonVm.UrlTypes.push(this.config.getConfig('img_root') + type.typePok.UrlMiniHome_ES);
        });
        break;
      case "IT":
        this.pokemonVm.Name = this.pokemon.IT.Name;
        this.pokemon.Types.forEach(type => {
          this.pokemonVm.UrlTypes.push(this.config.getConfig('img_root') + type.typePok.UrlMiniHome_IT);
        });
        break;
      case "DE":
        this.pokemonVm.Name = this.pokemon.DE.Name;
        this.pokemon.Types.forEach(type => {
          this.pokemonVm.UrlTypes.push(this.config.getConfig('img_root') + type.typePok.UrlMiniHome_DE);
        });
        break;
      case "RU":
        this.pokemonVm.Name = this.pokemon.RU.Name;
        this.pokemon.Types.forEach(type => {
          this.pokemonVm.UrlTypes.push(this.config.getConfig('img_root') + type.typePok.UrlMiniHome_RU);
        });
        break;
      case "CO":
        this.pokemonVm.Name = this.pokemon.CO.Name;
        this.pokemon.Types.forEach(type => {
          this.pokemonVm.UrlTypes.push(this.config.getConfig('img_root') + type.typePok.UrlMiniHome_CO);
        });
        break;
      case "CN":
        this.pokemonVm.Name = this.pokemon.CN.Name;
        this.pokemon.Types.forEach(type => {
          this.pokemonVm.UrlTypes.push(this.config.getConfig('img_root') + type.typePok.UrlMiniHome_CN);
        });
        break;
      case "JP":
        this.pokemonVm.Name = this.pokemon.JP.Name;
        this.pokemon.Types.forEach(type => {
          this.pokemonVm.UrlTypes.push(this.config.getConfig('img_root') + type.typePok.UrlMiniHome_JP);
        });
        break;
      default:
        this.pokemonVm.Name = this.pokemon.FR.Name;
        this.pokemon.Types.forEach(type => {
          this.pokemonVm.UrlTypes.push(this.config.getConfig('img_root') + type.typePok.UrlMiniHome_FR);
        });
        break;
    }
  }
}
