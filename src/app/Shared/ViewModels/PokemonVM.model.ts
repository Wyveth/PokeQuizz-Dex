import { PokemonEvoVM } from "./PokemonEvoVM.model";
import { TalentVM } from "./TalentVM.model";
import { TypeVM } from "./TypeVM.model";

export class PokemonVM{
    Id!: Number;
    Number!: string;
    Name!: string;
    DisplayName!: string;
    DescriptionVx!: string;
    DescriptionVy!: string;
    Size!: string;
    Category!: string;
    Weight!: string;
    Talent: TalentVM[] = [];
    Evolutions: PokemonEvoVM[] = [];
    MegaEvolutions: PokemonEvoVM[] = [];
    GigaEvolutions: PokemonEvoVM[] = [];
    AlolaForms: PokemonEvoVM[] = [];
    GalarForms: PokemonEvoVM[] = [];
    HisuiForms: PokemonEvoVM[] = [];
    WhenEvolution!: string;
    UrlImg!: string;
    UrlSprite!: string;
    UrlSound!: string;
    Types: TypeVM[] = [];
    Weakness: TypeVM[] = [];
    Stats!: number[];
    StatTotal!: number;
  }