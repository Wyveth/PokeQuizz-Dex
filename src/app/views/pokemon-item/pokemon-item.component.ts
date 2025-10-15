import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonLight } from 'src/app/api/models/concretes/pokemon';
import { LocService } from 'src/app/api/services/loc.service';
import { AppConfig } from 'src/app/app.config';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { GenericUtils } from 'src/app/shared/utils/genericUtils';
import { Subscription } from 'rxjs';

export class PokemonVM {
  id!: number;
  number!: string;
  name!: string;
  pathImg!: string;
  pathImgShiny!: string;
  pathSprite!: string;
  pathSpriteShiny!: string;
  pathAnimatedImg!: string;
  pathAnimatedImgShiny!: string;
  pathTypes: string[] = [];
}

@Component({
  selector: 'app-pokemon-item',
  templateUrl: './pokemon-item.component.html',
  imports: [CommonModule]
})
export class PokemonItemComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() pokemon!: PokemonLight;

  pokemonVm: PokemonVM = new PokemonVM();
  imgRoot: string = this.config.getConfig('img_root');

  private locSub!: Subscription;
  private loc!: string;

  constructor(
    resources: AppResource,
    private locService: LocService,
    private router: Router,
    private config: AppConfig
  ) {
    super(resources);
  }

  ngOnInit() {
    // écoute la langue en continu
    this.locSub = this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
      console.log(this.pokemon);
      this.updatePokemonVm();
    });
  }

  ngOnDestroy(): void {
    if (this.locSub) {
      this.locSub.unsubscribe();
    }
  }

  public goToPokemonDetails(Id: number): void {
    this.router.navigate(['/' + this.loc + '/pokemon/' + Id]);
  }

  private updatePokemonVm(): void {
    if (!this.pokemon) return;

    console.log('Update PokemonVM for ' + this.pokemon);

    this.pokemonVm.id = this.pokemon.id;
    this.pokemonVm.number = this.pokemon.number;
    this.pokemonVm.pathImg = this.imgRoot + this.pokemon.pathImgNormal;
    this.pokemonVm.pathImgShiny = this.imgRoot + this.pokemon.pathImgShiny;
    this.pokemonVm.pathSprite = this.imgRoot + this.pokemon.pathSpriteNormal;
    this.pokemonVm.pathSpriteShiny = this.imgRoot + this.pokemon.pathSpriteShiny;
    this.pokemonVm.pathAnimatedImg = this.imgRoot + this.pokemon.pathAnimatedImg;
    this.pokemonVm.pathAnimatedImgShiny = this.imgRoot + this.pokemon.pathAnimatedImgShiny;
    // Nom traduit selon la langue active
    this.pokemonVm.name = this.pokemon.dataInfo.name;

    this.pokemonVm.pathTypes = [];
    this.pokemon.typePoks.forEach(typePok => {
      this.pokemonVm.pathTypes.push(this.imgRoot + typePok.pathMiniHome);
    });
  }
}
