import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonLight } from 'src/app/api/models/concretes/pokemon';
import { AppConfig } from 'src/app/app.config';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { GenericUtils } from 'src/app/shared/utils/genericUtils';

export class PokemonVM{
  Id!: number;
  Number!: string;
  Name!: string;
  PathImg!: string;
  PathTypes: string[] = [];
}

@Component({
  selector: 'app-pokemon-item',
  templateUrl: './pokemon-item.component.html',
  styleUrls: ['./pokemon-item.component.scss']
})
export class PokemonItemComponent extends BaseComponent implements OnInit {
  @Input() pokemon!: PokemonLight;
  @Input() location!: string;
  pokemonVm: PokemonVM = new PokemonVM();

  imgRoot: string = this.config.getConfig('img_root');

  constructor(resources: AppResource, private router: Router, private config: AppConfig) { 
    super(resources);
  }

  ngOnInit() {
    this.getDataByLocalisation(this.pokemonVm);
  }

  public goToPokemonDetails(Id: number): void {
    this.router.navigate(['/'+ this.location + '/pokedex/pokemon/' + Id]);
  }

  private getDataByLocalisation(pokemonVm: PokemonVM): void{
    pokemonVm.Id = this.pokemon.Id;
    pokemonVm.Number = this.pokemon.Number;
    pokemonVm.PathImg = this.imgRoot + this.pokemon.PathImg;

    pokemonVm.Name = GenericUtils.getObject(this.pokemon, this.location).Name;
        this.pokemon.Types.forEach(type => {
          pokemonVm.PathTypes.push(this.imgRoot + type.typePok['UrlMiniHome_' + this.location]);
        });
  }
}
