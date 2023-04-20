import { AttackVM } from "./attackVM";
import { PokemonEvoVM } from "./pokemonEvoVM";
import { TalentVM } from "./talentVM";
import { TypeVM } from "./typeVM";

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
    Talents: TalentVM[] = [];
    Evolutions: PokemonEvoVM[] = [];
    MegaEvolutions: PokemonEvoVM[] = [];
    GigaEvolutions: PokemonEvoVM[] = [];
    AlolaForms: PokemonEvoVM[] = [];
    GalarForms: PokemonEvoVM[] = [];
    HisuiForms: PokemonEvoVM[] = [];
    PaldeaForms: PokemonEvoVM[] = [];
    WhenEvolution!: string;
    PathImg!: string;
    PathSprite!: string;
    PathSound!: string;
    Types: TypeVM[] = [];
    Weakness: TypeVM[] = [];
    Attacks: AttackVM[] = [];
    Stats!: number[];
    StatTotal!: number;
  }