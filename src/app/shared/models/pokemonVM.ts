import { AttackVM } from './attackVM';
import { PokemonEvoVM } from './pokemonEvoVM';
import { TalentVM } from './talentVM';
import { TypeVM } from './typeVM';

export class PokemonVM {
  Id!: number;
  Number!: string;
  Name!: string;
  DisplayName!: string;
  DescriptionVx!: string;
  DescriptionVy!: string;
  Size!: string;
  Category!: string;
  Weight!: string;
  Talents: TalentVM[] = [];
  Forms: FormVM[] = [];
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

export class FormVM {
  [key: string]: any;
  Name!: string;
  ListForm: PokemonEvoVM[] = [];
}
