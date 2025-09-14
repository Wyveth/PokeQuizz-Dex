import { AttackVM } from 'src/app/shared/models/attackVM';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Attaque, AttaqueResponse } from 'src/app/api/models/concretes/attaque';
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
import { GenericUtils } from 'src/app/shared/utils/genericUtils';
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

    this.pokemonVm.Forms.push(
      { Name: 'Evolutions', ListForm: [] },
      { Name: 'MegaForms', ListForm: [] },
      { Name: 'GigamaxForms', ListForm: [] },
      { Name: 'AlolaForms', ListForm: [] },
      { Name: 'GalarForms', ListForm: [] },
      { Name: 'HisuiForms', ListForm: [] },
      { Name: 'PaldeaForms', ListForm: [] }
    );

    this.pokemonVm.Attacks.push(
      { Name: 'Niveau', ListAttack: [] },
      { Name: 'Evolution', ListAttack: [] },
      { Name: 'CT/CS', ListAttack: [] },
      { Name: 'Reproduction', ListAttack: [] },
      { Name: 'Maître des Capacités', ListAttack: [] }
    );
  }

  ngOnInit() {
    // Écoute les changements de langue et d'ID du Pokémon
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      const newLoc = params['loc'] || 'FR';
      const newKey = +params['id'];

      // Recharge uniquement si la langue ou le Pokémon change
      if (this.loc !== newLoc || this.key !== newKey) {
        this.loc = newLoc;
        this.key = newKey;

        // met à jour le service de localisation
        this.locService.setLoc(this.loc);

        // recharge le Pokémon
        this.loadPokemon();
      }
    });
  }

  private loadPokemon() {
    this.pokemonService
      .getPokemon(this.key)
      .pipe(takeUntil(this.destroy$))
      .subscribe(pokemon => {
        this.pokemon = pokemon;
        this.pokemonVm = new PokemonVM(); // reset
        this.typesVm = [];

        this.getDataByLocalisation(this.pokemonVm, this.loc);

        // Evolutions
        this.pokemonService
          .getEvolChain(this.pokemon.FR.Evolutions)
          .pipe(takeUntil(this.destroy$))
          .subscribe((pokemons: Pokemon[]) => {
            pokemons.forEach(pokemon => {
              pokemon.Types.forEach(type => {
                this.typesVm.push(this.createTypeVMByLocation(type, this.loc));
              });
              this.populateFormsByName('Evolutions', pokemon, this.typesVm);
            });
          });

        // Variants
        this.pokemonService
          .getVariants(this.pokemon.Number)
          .pipe(takeUntil(this.destroy$))
          .subscribe((pokemons: Pokemon[]) => {
            this.typesVm = [];
            pokemons.forEach(pokemon => {
              pokemon.Types.forEach(type => {
                this.typesVm.push(this.createTypeVMByLocation(type.typePok, this.loc));
              });
              this.populateFormsByName(pokemon.TypeEvolution + 'Forms', pokemon, this.typesVm);
            });
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getDataByLocalisation(pokemonVm: PokemonVM, location: string): void {
    pokemonVm.Id = this.pokemon.Id;
    pokemonVm.Number = this.pokemon.Number;

    this.getDataInfo(pokemonVm, GenericUtils.getObject(this.pokemon, this.loc));

    this.pokemon.Types.forEach(type => {
      pokemonVm.Types.push(this.createTypeVMByLocation(type.typePok, location));
    });

    this.pokemon.Weaknesses.forEach(type => {
      pokemonVm.Weakness.push(this.createTypeVMByLocation(type.typePok, location));
    });

    this.pokemon.Talents.forEach(talentResponse => {
      pokemonVm.Talents.push(
        new TalentVM(
          talentResponse.talent['Name_' + this.loc],
          talentResponse.talent['Description_' + this.loc],
          talentResponse.isHidden
        )
      );
    });

    this.pokemon.Attaques.forEach(attackResponse => {
      this.populateTypeLearnByName(attackResponse.typeLearn, attackResponse);
    });

    pokemonVm.PathImg = this.imgRoot + this.pokemon.PathImg;
    pokemonVm.PathSprite = this.imgRoot + this.pokemon.PathSprite;
    pokemonVm.PathSound = this.imgRoot + this.pokemon.PathSound;
    pokemonVm.Stats = [
      this.pokemon.StatPv,
      this.pokemon.StatAttaque,
      this.pokemon.StatDefense,
      this.pokemon.StatAttaqueSpe,
      this.pokemon.StatDefenseSpe,
      this.pokemon.StatVitesse
    ];
    pokemonVm.StatTotal = this.pokemon.StatTotal;
  }

  //#region Private Methods
  private getDataInfo(pokemonVm: PokemonVM, dataInfo: DataInfo): void {
    pokemonVm.Name = dataInfo.Name;
    pokemonVm.DisplayName = dataInfo.DisplayName;
    pokemonVm.DescriptionVx = dataInfo.DescriptionVx;
    pokemonVm.DescriptionVy = dataInfo.DescriptionVy;
    pokemonVm.Size = dataInfo.Size;
    pokemonVm.Category = dataInfo.Category;
    pokemonVm.Weight = dataInfo.Weight;
    pokemonVm.WhenEvolution = dataInfo.WhenEvolution;
  }

  private createTypeVMByLocation(typePok: TypePok, location: string): TypeVM {
    return new TypeVM(
      typePok['Name_' + this.loc],
      this.imgRoot + typePok['UrlMiniHome_' + this.loc],
      this.imgRoot + typePok.PathFondGo,
      typePok.ImgColor,
      typePok.InfoColor,
      typePok.TypeColor
    );
  }

  private createPokemonEvoVMByLocation(pokemon: Pokemon, typesVM: TypeVM[]): PokemonEvoVM {
    return new PokemonEvoVM(
      pokemon.Id,
      pokemon.Number,
      GenericUtils.getObject(pokemon, this.loc).Name,
      typesVM,
      this.imgRoot + pokemon.PathImg,
      this.imgRoot + pokemon.PathSprite,
      GenericUtils.getObject(pokemon, this.loc).WhenEvolution
    );
  }

  private populateFormsByName(formName: string, pokemon: Pokemon, typesVm: TypeVM[]) {
    let form = this.pokemonVm.Forms.find(x => x.Name == formName);
    if (form) form.ListForm.push(this.createPokemonEvoVMByLocation(pokemon, typesVm));
  }

  private createAttackVMByLocation(attack: AttaqueResponse): AttackVM {
    return new AttackVM(
      attack.attaque['Name_' + this.loc],
      attack.attaque['Description_' + this.loc],
      this.imgRoot + attack.attaque.TypeAttaque.UrlImg,
      this.imgRoot + attack.attaque.Types.PathIconHome
    );
  }

  private populateTypeLearnByName(typeLearnName: string, attack: AttaqueResponse) {
    let att = this.pokemonVm.Attacks.find(x => x.Name == typeLearnName);
    if (!att) {
      att = { Name: typeLearnName, ListAttack: [] };
      this.pokemonVm.Attacks.push(att);
    }

    att.ListAttack.push(this.createAttackVMByLocation(attack));
  }
  //#endregion
}
