import { AttackVM } from 'src/app/shared/models/attackVM';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  styleUrls: ['./pokemon-details.component.scss'],
  standalone: true,
  imports: [CommonModule, PokemonEvolutionComponent, PokemonAttackComponent],
})
export class PokemonDetailsComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  imgRoot: string = this.config.getConfig('img_root');

  pokemon!: Pokemon;
  firstType!: TypePok;
  pokemonVm: PokemonVM = new PokemonVM();

  pokemonSubscription!: Subscription;

  key!: number;
  loc!: string;

  typesVm: TypeVM[] = [];

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

    this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
    });
  }

  ngOnInit() {
    this.key = this.route.snapshot.params['id'];

    new Promise<void>((resolve) => {
      this.pokemonSubscription = this.pokemonService
        .getPokemon(this.key)
        .subscribe((pokemon: Pokemon) => {
          this.pokemon = pokemon;
          this.getDataByLocalisation(this.pokemonVm, this.loc);

          this.pokemonService
            .getEvolChain(this.pokemon.FR.Evolutions)
            .subscribe((pokemons: Pokemon[]) => {
              pokemons.forEach((pokemon) => {
                pokemon.Types.forEach((type) => {
                  this.typesVm.push(
                    this.createTypeVMByLocation(type, this.loc)
                  );
                });

                this.populateFormsByName('Evolutions', pokemon, this.typesVm);
              });
            });

          this.pokemonService
            .getVariants(this.pokemon.Number)
            .subscribe((pokemons: Pokemon[]) => {
              this.typesVm = [];
              pokemons.forEach((pokemon) => {
                pokemon.Types.forEach((type) => {
                  this.typesVm.push(
                    this.createTypeVMByLocation(type, this.loc)
                  );
                });

                this.populateFormsByName(
                  pokemon.TypeEvolution + 'Forms',
                  pokemon,
                  this.typesVm
                );
              });
            });

          resolve();
        });
    })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    this.pokemonSubscription.unsubscribe();
  }

  private getDataByLocalisation(pokemonVm: PokemonVM, location: string): void {
    pokemonVm.Id = this.pokemon.Id;
    pokemonVm.Number = this.pokemon.Number;

    this.getDataInfo(pokemonVm, GenericUtils.getObject(this.pokemon, this.loc));

    this.pokemon.Types.forEach((type) => {
      pokemonVm.Types.push(this.createTypeVMByLocation(type.typePok, location));
    });

    this.pokemon.Weaknesses.forEach((type) => {
      pokemonVm.Weakness.push(
        this.createTypeVMByLocation(type.typePok, location)
      );
    });

    this.pokemon.Talents.forEach((talentResponse) => {
      pokemonVm.Talents.push(
        new TalentVM(
          talentResponse.talent['Name_' + this.loc],
          talentResponse.talent['Description_' + this.loc],
          talentResponse.isHidden
        )
      );
    });

    this.pokemon.Attaques.forEach((attackResponse) => {
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
      this.pokemon.StatVitesse,
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

  private createPokemonEvoVMByLocation(
    pokemon: Pokemon,
    typesVM: TypeVM[]
  ): PokemonEvoVM {
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

  private populateFormsByName(
    formName: string,
    pokemon: Pokemon,
    typesVm: TypeVM[]
  ) {
    let form = this.pokemonVm.Forms.find((x) => x.Name == formName);
    if (form)
      form.ListForm.push(this.createPokemonEvoVMByLocation(pokemon, typesVm));
  }

  private createAttackVMByLocation(attack: AttaqueResponse): AttackVM {
    return new AttackVM(
      attack.attaque['Name_' + this.loc],
      attack.attaque['Description_' + this.loc],
      this.imgRoot + attack.attaque.TypeAttaque.UrlImg,
      this.imgRoot + attack.attaque.Types.PathIconHome
    );
  }

  private populateTypeLearnByName(
    typeLearnName: string,
    attack: AttaqueResponse
  ) {
    let att = this.pokemonVm.Attacks.find((x) => x.Name == typeLearnName);
    if (att) att.ListAttack.push(this.createAttackVMByLocation(attack));
  }
  //#endregion
}
