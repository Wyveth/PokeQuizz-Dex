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
  PathImgNormal!: string;
  PathImgShiny!: string;
  PathSprite!: string;
  PathSpriteNormal!: string;
  PathSpriteShiny!: string;
  PathAnimatedNormal!: string;
  PathAnimatedShiny!: string;
  PathSound!: string;
  Types: TypeVM[] = [];
  Weakness: TypeVM[] = [];
  Attacks: TypeLearnAttackVM[] = [];
  Stats!: number[];
  StatTotal!: number;
}

export class FormVM {
  [key: string]: string | PokemonEvoVM[];
  Name!: string;
  ListForm: PokemonEvoVM[] = [];
}

export class TypeLearnAttackVM {
  Name!: string;
  ListAttack: AttackVM[] = [];
}
