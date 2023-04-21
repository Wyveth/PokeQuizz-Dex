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

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss'],
})
export class PokemonDetailsComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
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
  }

  ngOnInit() {
    this.location = this.route.snapshot.params['loc'];
    this.key = this.route.snapshot.params['id'];

    new Promise<void>((resolve, reject) => {
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
                this.pokemonVm.Evolutions.push(
                  this.createPokemonEvoVMByLocation(
                    pokemon,
                    this.typesVm,
                    this.location
                  )
                );
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

                switch (pokemon.TypeEvolution) {
                  case 'Mega':
                    this.pokemonVm.MegaEvolutions.push(
                      this.createPokemonEvoVMByLocation(
                        pokemon,
                        this.typesVm,
                        this.location
                      )
                    );
                    break;
                  case 'Gigamax':
                    this.pokemonVm.GigaEvolutions.push(
                      this.createPokemonEvoVMByLocation(
                        pokemon,
                        this.typesVm,
                        this.location
                      )
                    );
                    break;
                  case 'Alola':
                    this.pokemonVm.AlolaForms.push(
                      this.createPokemonEvoVMByLocation(
                        pokemon,
                        this.typesVm,
                        this.location
                      )
                    );
                    break;
                  case 'Galar':
                    this.pokemonVm.GalarForms.push(
                      this.createPokemonEvoVMByLocation(
                        pokemon,
                        this.typesVm,
                        this.location
                      )
                    );
                    break;
                  case 'Hisui':
                    this.pokemonVm.HisuiForms.push(
                      this.createPokemonEvoVMByLocation(
                        pokemon,
                        this.typesVm,
                        this.location
                      )
                    );
                    break;
                  case 'Paldea':
                    this.pokemonVm.PaldeaForms.push(
                      this.createPokemonEvoVMByLocation(
                        pokemon,
                        this.typesVm,
                        this.location
                      )
                    );
                    break;
                }
              });
            });

          resolve();
        });
    });
  }

  ngOnDestroy(): void {
    this.pokemonSubscription.unsubscribe();
  }

  private getDataByLocalisation(pokemonVm: PokemonVM, location: string): void {
    this.pokemonVm.Id = this.pokemon.Id;
    this.pokemonVm.Number = this.pokemon.Number;

    console.log('Talents', this.pokemon.Talents);
    console.log('Attacks', this.pokemon.Attaques);

    switch (location) {
      case 'FR':
        this.getDataInfo(pokemonVm, this.pokemon.FR);

        this.pokemon.Types.forEach((type) => {
          this.pokemonVm.Types.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Weaknesses.forEach((type) => {
          this.pokemonVm.Weakness.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Talents.forEach((talentResponse) => {
          this.pokemonVm.Talents.push(
            new TalentVM(
              talentResponse.talent.Name_FR,
              talentResponse.talent.Description_FR,
              talentResponse.isHidden
            )
          );
        });
        break;
      case 'EN':
        this.getDataInfo(pokemonVm, this.pokemon.EN);

        this.pokemon.Types.forEach((type) => {
          this.pokemonVm.Types.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Weaknesses.forEach((type) => {
          this.pokemonVm.Weakness.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Talents.forEach((talentResponse) => {
          this.pokemonVm.Talents.push(
            new TalentVM(
              talentResponse.talent.Name_EN,
              talentResponse.talent.Description_EN,
              talentResponse.isHidden
            )
          );
        });
        break;
      case 'ES':
        this.getDataInfo(pokemonVm, this.pokemon.ES);

        this.pokemon.Types.forEach((type) => {
          this.pokemonVm.Types.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Weaknesses.forEach((type) => {
          this.pokemonVm.Weakness.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Talents.forEach((talentResponse) => {
          this.pokemonVm.Talents.push(
            new TalentVM(
              talentResponse.talent.Name_ES,
              talentResponse.talent.Description_ES,
              talentResponse.isHidden
            )
          );
        });
        break;
      case 'IT':
        this.getDataInfo(pokemonVm, this.pokemon.IT);

        this.pokemon.Types.forEach((type) => {
          this.pokemonVm.Types.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Weaknesses.forEach((type) => {
          this.pokemonVm.Weakness.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Talents.forEach((talentResponse) => {
          this.pokemonVm.Talents.push(
            new TalentVM(
              talentResponse.talent.Name_IT,
              talentResponse.talent.Description_IT,
              talentResponse.isHidden
            )
          );
        });
        break;
      case 'DE':
        this.getDataInfo(pokemonVm, this.pokemon.DE);

        this.pokemon.Types.forEach((type) => {
          this.pokemonVm.Types.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Weaknesses.forEach((type) => {
          this.pokemonVm.Weakness.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Talents.forEach((talentResponse) => {
          this.pokemonVm.Talents.push(
            new TalentVM(
              talentResponse.talent.Name_DE,
              talentResponse.talent.Description_DE,
              talentResponse.isHidden
            )
          );
        });
        break;
      case 'RU':
        this.getDataInfo(pokemonVm, this.pokemon.RU);

        this.pokemon.Types.forEach((type) => {
          this.pokemonVm.Types.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Weaknesses.forEach((type) => {
          this.pokemonVm.Weakness.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Talents.forEach((talentResponse) => {
          this.pokemonVm.Talents.push(
            new TalentVM(
              talentResponse.talent.Name_RU,
              talentResponse.talent.Description_RU,
              talentResponse.isHidden
            )
          );
        });
        break;
      case 'CO':
        this.getDataInfo(pokemonVm, this.pokemon.CO);

        this.pokemon.Types.forEach((type) => {
          this.pokemonVm.Types.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Weaknesses.forEach((type) => {
          this.pokemonVm.Weakness.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Talents.forEach((talentResponse) => {
          this.pokemonVm.Talents.push(
            new TalentVM(
              talentResponse.talent.Name_CO,
              talentResponse.talent.Description_CO,
              talentResponse.isHidden
            )
          );
        });
        break;
      case 'CN':
        this.getDataInfo(pokemonVm, this.pokemon.CN);

        this.pokemon.Types.forEach((type) => {
          this.pokemonVm.Types.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Weaknesses.forEach((type) => {
          this.pokemonVm.Weakness.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Talents.forEach((talentResponse) => {
          this.pokemonVm.Talents.push(
            new TalentVM(
              talentResponse.talent.Name_CN,
              talentResponse.talent.Description_CN,
              talentResponse.isHidden
            )
          );
        });
        break;
      case 'JP':
        this.getDataInfo(pokemonVm, this.pokemon.JP);
        this.pokemon.Types.forEach((type) => {
          this.pokemonVm.Types.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Weaknesses.forEach((type) => {
          this.pokemonVm.Weakness.push(
            this.createTypeVMByLocation(type.typePok, location)
          );
        });

        this.pokemon.Talents.forEach((talentResponse) => {
          this.pokemonVm.Talents.push(
            new TalentVM(
              talentResponse.talent.Name_JP,
              talentResponse.talent.Description_JP,
              talentResponse.isHidden
            )
          );
        });
        break;
    }

    this.pokemonVm.PathImg =
      this.config.getConfig('img_root') + this.pokemon.PathImg;
    this.pokemonVm.PathSprite =
      this.config.getConfig('img_root') + this.pokemon.PathSprite;
    this.pokemonVm.PathSound =
      this.config.getConfig('img_root') + this.pokemon.PathSound;
    this.pokemonVm.Stats = [
      this.pokemon.StatPv,
      this.pokemon.StatAttaque,
      this.pokemon.StatDefense,
      this.pokemon.StatAttaqueSpe,
      this.pokemon.StatDefenseSpe,
      this.pokemon.StatVitesse,
    ];
    this.pokemonVm.StatTotal =
      this.config.getConfig('img_root') + this.pokemon.StatTotal;

    console.log('Talents', this.pokemonVm.Talents);
  }

  //#region Private Methods
  private getDataInfo(pokemonVm: PokemonVM, dataInfo: DataInfo): void {
    this.pokemonVm.Name = dataInfo.Name;
    this.pokemonVm.DisplayName = dataInfo.DisplayName;
    this.pokemonVm.DescriptionVx = dataInfo.DescriptionVx;
    this.pokemonVm.DescriptionVy = dataInfo.DescriptionVy;
    this.pokemonVm.Size = dataInfo.Size;
    this.pokemonVm.Category = dataInfo.Category;
    this.pokemonVm.Weight = dataInfo.Weight;
    this.pokemonVm.WhenEvolution = dataInfo.WhenEvolution;
  }

  private createTypeVMByLocation(typePok: TypePok, location: string): TypeVM {
    switch (location) {
      case 'FR':
        return new TypeVM(
          typePok.Name_FR,
          this.config.getConfig('img_root') + typePok.UrlMiniHome_FR,
          this.config.getConfig('img_root') + typePok.PathFondGo,
          typePok.ImgColor,
          typePok.InfoColor,
          typePok.TypeColor
        );
      case 'EN':
        return new TypeVM(
          typePok.Name_EN,
          this.config.getConfig('img_root') + typePok.UrlMiniHome_EN,
          this.config.getConfig('img_root') + typePok.PathFondGo,
          typePok.ImgColor,
          typePok.InfoColor,
          typePok.TypeColor
        );
      case 'ES':
        return new TypeVM(
          typePok.Name_ES,
          this.config.getConfig('img_root') + typePok.UrlMiniHome_ES,
          this.config.getConfig('img_root') + typePok.PathFondGo,
          typePok.ImgColor,
          typePok.InfoColor,
          typePok.TypeColor
        );
      case 'IT':
        return new TypeVM(
          typePok.Name_IT,
          this.config.getConfig('img_root') + typePok.UrlMiniHome_IT,
          this.config.getConfig('img_root') + typePok.PathFondGo,
          typePok.ImgColor,
          typePok.InfoColor,
          typePok.TypeColor
        );
      case 'DE':
        return new TypeVM(
          typePok.Name_DE,
          this.config.getConfig('img_root') + typePok.UrlMiniHome_DE,
          this.config.getConfig('img_root') + typePok.PathFondGo,
          typePok.ImgColor,
          typePok.InfoColor,
          typePok.TypeColor
        );
      case 'RU':
        return new TypeVM(
          typePok.Name_RU,
          this.config.getConfig('img_root') + typePok.UrlMiniHome_RU,
          this.config.getConfig('img_root') + typePok.PathFondGo,
          typePok.ImgColor,
          typePok.InfoColor,
          typePok.TypeColor
        );
      case 'CO':
        return new TypeVM(
          typePok.Name_CO,
          this.config.getConfig('img_root') + typePok.UrlMiniHome_CO,
          this.config.getConfig('img_root') + typePok.PathFondGo,
          typePok.ImgColor,
          typePok.InfoColor,
          typePok.TypeColor
        );
      case 'CN':
        return new TypeVM(
          typePok.Name_CN,
          this.config.getConfig('img_root') + typePok.UrlMiniHome_CN,
          this.config.getConfig('img_root') + typePok.PathFondGo,
          typePok.ImgColor,
          typePok.InfoColor,
          typePok.TypeColor
        );
      case 'JP':
        return new TypeVM(
          typePok.Name_JP,
          this.config.getConfig('img_root') + typePok.UrlMiniHome_JP,
          this.config.getConfig('img_root') + typePok.PathFondGo,
          typePok.ImgColor,
          typePok.InfoColor,
          typePok.TypeColor
        );
      default:
        return new TypeVM(
          typePok.Name_EN,
          this.config.getConfig('img_root') + typePok.UrlMiniHome_EN,
          this.config.getConfig('img_root') + typePok.PathFondGo,
          typePok.ImgColor,
          typePok.InfoColor,
          typePok.TypeColor
        );
    }
  }

  private createPokemonEvoVMByLocation(
    pokemon: Pokemon,
    typesVM: TypeVM[],
    location: string
  ): PokemonEvoVM {
    switch (location) {
      case 'FR':
        return new PokemonEvoVM(
          pokemon.Id,
          pokemon.Number,
          pokemon.FR.Name,
          typesVM,
          this.config.getConfig('img_root') + pokemon.PathImg,
          this.config.getConfig('img_root') + pokemon.PathSprite,
          pokemon.FR.WhenEvolution
        );
      case 'EN':
        return new PokemonEvoVM(
          pokemon.Id,
          pokemon.Number,
          pokemon.EN.Name,
          typesVM,
          this.config.getConfig('img_root') + pokemon.PathImg,
          this.config.getConfig('img_root') + pokemon.PathSprite,
          pokemon.EN.WhenEvolution
        );
      case 'ES':
        return new PokemonEvoVM(
          pokemon.Id,
          pokemon.Number,
          pokemon.ES.Name,
          typesVM,
          this.config.getConfig('img_root') + pokemon.PathImg,
          this.config.getConfig('img_root') + pokemon.PathSprite,
          pokemon.ES.WhenEvolution
        );
      case 'IT':
        return new PokemonEvoVM(
          pokemon.Id,
          pokemon.Number,
          pokemon.IT.Name,
          typesVM,
          this.config.getConfig('img_root') + pokemon.PathImg,
          this.config.getConfig('img_root') + pokemon.PathSprite,
          pokemon.IT.WhenEvolution
        );
      case 'DE':
        return new PokemonEvoVM(
          pokemon.Id,
          pokemon.Number,
          pokemon.DE.Name,
          typesVM,
          this.config.getConfig('img_root') + pokemon.PathImg,
          this.config.getConfig('img_root') + pokemon.PathSprite,
          pokemon.DE.WhenEvolution
        );
      case 'RU':
        return new PokemonEvoVM(
          pokemon.Id,
          pokemon.Number,
          pokemon.RU.Name,
          typesVM,
          this.config.getConfig('img_root') + pokemon.PathImg,
          this.config.getConfig('img_root') + pokemon.PathSprite,
          pokemon.RU.WhenEvolution
        );
      case 'CO':
        return new PokemonEvoVM(
          pokemon.Id,
          pokemon.Number,
          pokemon.CO.Name,
          typesVM,
          this.config.getConfig('img_root') + pokemon.PathImg,
          this.config.getConfig('img_root') + pokemon.PathSprite,
          pokemon.CO.WhenEvolution
        );
      case 'CN':
        return new PokemonEvoVM(
          pokemon.Id,
          pokemon.Number,
          pokemon.CN.Name,
          typesVM,
          this.config.getConfig('img_root') + pokemon.PathImg,
          this.config.getConfig('img_root') + pokemon.PathSprite,
          pokemon.CN.WhenEvolution
        );
      case 'JP':
        return new PokemonEvoVM(
          pokemon.Id,
          pokemon.Number,
          pokemon.JP.Name,
          typesVM,
          this.config.getConfig('img_root') + pokemon.PathImg,
          this.config.getConfig('img_root') + pokemon.PathSprite,
          pokemon.JP.WhenEvolution
        );
      default:
        return new PokemonEvoVM(
          pokemon.Id,
          pokemon.Number,
          pokemon.EN.Name,
          typesVM,
          this.config.getConfig('img_root') + pokemon.PathImg,
          this.config.getConfig('img_root') + pokemon.PathSprite,
          pokemon.EN.WhenEvolution
        );
    }
  }
  //#endregion
}