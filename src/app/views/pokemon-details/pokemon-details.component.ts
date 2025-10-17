import { AttackVM } from 'src/app/shared/models/attackVM';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Attaque } from 'src/app/api/models/concretes/attaque';
import { DataInfo } from 'src/app/api/models/concretes/datainfo';
import { Pokemon } from 'src/app/api/models/concretes/pokemon';
import { TypePok } from 'src/app/api/models/concretes/typePok';
import { PokemonService } from 'src/app/api/services/pokemon.service';
import { AppConfig } from 'src/app/app.config';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { PokemonEvoVM } from 'src/app/shared/models/pokemonEvoVM';
import { PokemonVM } from 'src/app/shared/models/pokemonVM';
import { TalentVM } from 'src/app/shared/models/talentVM';
import { TypeVM } from 'src/app/shared/models/typeVM';
import { CommonModule } from '@angular/common';
import { PokemonEvolutionComponent } from '../pokemon-evolution/pokemon-evolution.component';
import { PokemonAttackComponent } from '../pokemon-attack/pokemon-attack.component';
import { LocService } from 'src/app/api/services/loc.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  imports: [CommonModule, PokemonEvolutionComponent, PokemonAttackComponent]
})
export class PokemonDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  imgRoot: string = this.config.getConfig('img_root');

  pokemon!: Pokemon;
  pokemonVm: PokemonVM = new PokemonVM();
  typesVm: TypeVM[] = [];

  key!: number;
  loc!: string;

  private destroy$ = new Subject<void>();

  constructor(
    resources: AppResource,
    private route: ActivatedRoute,
    private config: AppConfig,
    private locService: LocService,
    private pokemonService: PokemonService
  ) {
    super(resources);

    this.pokemonVm.forms.push(
      { name: 'Evolutions', listForm: [] },
      { name: 'MegaForms', listForm: [] },
      { name: 'GigamaxForms', listForm: [] },
      { name: 'AlolaForms', listForm: [] },
      { name: 'GalarForms', listForm: [] },
      { name: 'HisuiForms', listForm: [] },
      { name: 'PaldeaForms', listForm: [] }
    );

    this.pokemonVm.attacks.push(
      { name: 'Niveau', listAttack: [] },
      { name: 'Evolution', listAttack: [] },
      { name: 'CT/CS', listAttack: [] },
      { name: 'Reproduction', listAttack: [] },
      { name: 'Maître des Capacités', listAttack: [] }
    );
  }

  ngOnInit() {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        map((params: Params) => ({
          loc: params['loc'] || 'FR',
          id: +params['id'] || null
        })),
        distinctUntilChanged((prev, curr) => prev.loc === curr.loc && prev.id === curr.id)
      )
      .subscribe(({ loc, id }) => {
        if (this.loc !== loc || this.key !== id) {
          this.loc = loc;
          if (id !== null) this.key = id;

          // 🔁 Relance la requête API avec la nouvelle localisation
          this.loadPokemon();
        }
      });
  }

  private loadPokemon() {
    this.pokemonService
      .getPokemon(this.key, this.loc)
      .pipe(takeUntil(this.destroy$))
      .subscribe(pokemon => {
        this.pokemon = pokemon;
        this.pokemonVm = new PokemonVM(); // reset
        this.typesVm = [];

        this.getDataByLocalisation(this.pokemonVm, this.loc);

        // Evolutions
        this.pokemonService
          .getEvolChain(this.pokemon.dataInfo.evolutions, this.loc)
          .pipe(takeUntil(this.destroy$))
          .subscribe((pokemons: Pokemon[]) => {
            pokemons.forEach(pokemon => {
              pokemon.typePoks.forEach(typePok => {
                this.typesVm.push(this.createTypeVMByLocation(typePok));
              });
              this.populateFormsByName('Evolutions', pokemon, this.typesVm);
            });
          });

        // Variants
        this.pokemonService
          .getVariants(this.pokemon.number, this.loc)
          .pipe(takeUntil(this.destroy$))
          .subscribe((pokemons: Pokemon[]) => {
            this.typesVm = [];
            pokemons.forEach(pokemon => {
              pokemon.typePoks.forEach(typePok => {
                this.typesVm.push(this.createTypeVMByLocation(typePok));
              });
              this.populateFormsByName(pokemon.typeEvolution + 'Forms', pokemon, this.typesVm);
            });
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getDataByLocalisation(pokemonVm: PokemonVM, location: string): void {
    pokemonVm.id = this.pokemon.id;
    pokemonVm.number = this.pokemon.number;

    this.getDataInfo(pokemonVm, this.pokemon.dataInfo);

    this.pokemon.typePoks.forEach(typePok => {
      pokemonVm.types.push(this.createTypeVMByLocation(typePok));
    });

    this.pokemon.weaknesses.forEach(typePok => {
      pokemonVm.weakness.push(this.createTypeVMByLocation(typePok));
    });

    this.pokemon.talents.forEach(talent => {
      pokemonVm.talents.push(new TalentVM(talent.name, talent.Description, talent.isHidden));
    });

    this.pokemon.attaques.forEach(attackResponse => {
      this.populateTypeLearnByName(attackResponse.typeLearn, attackResponse);
    });

    pokemonVm.pathImg = this.imgRoot + this.pokemon.pathImgLegacy;
    pokemonVm.pathImgNormal = this.imgRoot + this.pokemon.pathImgNormal;
    pokemonVm.pathImgShiny = this.imgRoot + this.pokemon.pathImgShiny;
    pokemonVm.pathSprite = this.imgRoot + this.pokemon.pathSpriteLegacy;
    pokemonVm.pathSpriteNormal = this.imgRoot + this.pokemon.pathSpriteNormal;
    pokemonVm.pathSpriteShiny = this.imgRoot + this.pokemon.pathSpriteShiny;
    pokemonVm.pathAnimatedNormal = this.imgRoot + this.pokemon.pathAnimatedImg;
    pokemonVm.pathAnimatedShiny = this.imgRoot + this.pokemon.pathAnimatedImgShiny;
    pokemonVm.pathSound = this.imgRoot + this.pokemon.pathSound;
    pokemonVm.stats = [
      this.pokemon.statPv,
      this.pokemon.statAttaque,
      this.pokemon.statDefense,
      this.pokemon.statAttaqueSpe,
      this.pokemon.statDefenseSpe,
      this.pokemon.statVitesse
    ];
    pokemonVm.statTotal = this.pokemon.statTotal;
  }

  //#region Private Methods
  private getDataInfo(pokemonVm: PokemonVM, dataInfo: DataInfo): void {
    pokemonVm.name = dataInfo.name;
    pokemonVm.displayName = dataInfo.displayName;
    pokemonVm.descriptionVx = dataInfo.descriptionVx;
    pokemonVm.descriptionVy = dataInfo.descriptionVy;
    pokemonVm.size = dataInfo.size;
    pokemonVm.category = dataInfo.category;
    pokemonVm.weight = dataInfo.weight;
    pokemonVm.whenEvolution = dataInfo.whenEvolution;
  }

  private createTypeVMByLocation(typePok: TypePok): TypeVM {
    return new TypeVM(
      typePok.name,
      this.imgRoot + typePok.pathMiniHome,
      this.imgRoot + typePok.pathFondGo,
      typePok.imgColor,
      typePok.infoColor,
      typePok.typeColor
    );
  }

  private createPokemonEvoVMByLocation(pokemon: Pokemon, typesVM: TypeVM[]): PokemonEvoVM {
    return new PokemonEvoVM(
      pokemon.id,
      pokemon.number,
      pokemon.dataInfo.name,
      typesVM,
      this.imgRoot + pokemon.pathImgLegacy,
      this.imgRoot + pokemon.pathSpriteLegacy,
      pokemon.dataInfo.whenEvolution
    );
  }

  private populateFormsByName(formName: string, pokemon: Pokemon, typesVm: TypeVM[]) {
    let form = this.pokemonVm.forms.find(x => x.name == formName);
    if (!form) {
      form = { name: formName, listForm: [] };
      this.pokemonVm.forms.push(form);
    }
    if (form) form.listForm.push(this.createPokemonEvoVMByLocation(pokemon, typesVm));
  }

  private createAttackVMByLocation(attack: Attaque): AttackVM {
    return new AttackVM(
      attack.name,
      attack.description,
      this.imgRoot + attack.typeAttaque.pathImg,
      this.imgRoot + attack.typePok.pathIconHome
    );
  }

  private populateTypeLearnByName(typeLearnName: string, attack: Attaque) {
    let att = this.pokemonVm.attacks.find(x => x.name == typeLearnName);
    if (!att) {
      att = { name: typeLearnName, listAttack: [] };
      this.pokemonVm.attacks.push(att);
    }

    att.listAttack.push(this.createAttackVMByLocation(attack));
  }
  //#endregion
}
