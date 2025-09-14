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
  Id!: number;
  Number!: string;
  Name!: string;
  PathImg!: string;
  PathTypes: string[] = [];
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

    this.pokemonVm.Id = this.pokemon.Id;
    this.pokemonVm.Number = this.pokemon.Number;
    this.pokemonVm.PathImg = this.imgRoot + this.pokemon.PathImg;

    // Nom traduit selon la langue active
    this.pokemonVm.Name = GenericUtils.getObject(this.pokemon, this.loc).Name;

    this.pokemonVm.PathTypes = [];
    this.pokemon.Types.forEach(type => {
      this.pokemonVm.PathTypes.push(this.imgRoot + type.typePok['UrlMiniHome_' + this.loc]);
    });
  }
}
