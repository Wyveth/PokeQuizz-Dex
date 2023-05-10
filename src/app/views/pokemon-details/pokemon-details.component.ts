import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss'],
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
  location!: string;

  typesVm: TypeVM[] = [];

  constructor(
    resources: AppResource,
    private route: ActivatedRoute,
    private config: AppConfig,
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
  }

  ngOnInit() {
    this.location = this.route.snapshot.params['loc'];
    this.key = this.route.snapshot.params['id'];

    new Promise<void>((resolve) => {
      this.pokemonSubscription = this.pokemonService
        .getPokemon(this.key)
        .subscribe((pokemon: Pokemon) => {
          this.pokemon = pokemon;
          this.getDataByLocalisation(this.pokemonVm, this.location);

          this.pokemonService
            .getEvolChain(this.pokemon.FR.Evolutions)
            .subscribe((pokemons: Pokemon[]) => {
              pokemons.forEach((pokemon) => {
                pokemon.Types.forEach((type) => {
                  this.typesVm.push(
                    this.createTypeVMByLocation(type, this.location)
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
                    this.createTypeVMByLocation(type, this.location)
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

    console.log('Talents', this.pokemon.Talents);
    console.log('Attacks', this.pokemon.Attaques);

    this.getDataInfo(
      pokemonVm,
      GenericUtils.getObject(this.pokemon, this.location)
    );

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
          talentResponse.talent['Name_' + this.location],
          talentResponse.talent['Description_' + this.location],
          talentResponse.isHidden
        )
      );
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
      typePok['Name_' + this.location],
      this.imgRoot + typePok['UrlMiniHome_' + this.location],
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
      GenericUtils.getObject(this.pokemon, this.location).Name,
      typesVM,
      this.imgRoot + pokemon.PathImg,
      this.imgRoot + pokemon.PathSprite,
      GenericUtils.getObject(this.pokemon, this.location).WhenEvolution
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
  //#endregion
}
