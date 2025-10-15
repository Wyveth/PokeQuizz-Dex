import { AttackVM } from './attackVM';
import { PokemonEvoVM } from './pokemonEvoVM';
import { TalentVM } from './talentVM';
import { TypeVM } from './typeVM';

export class PokemonVM {
  id!: number;
  number!: string;
  name!: string;
  displayName!: string;
  descriptionVx!: string;
  descriptionVy!: string;
  size!: string;
  category!: string;
  weight!: string;
  talents: TalentVM[] = [];
  forms: FormVM[] = [];
  whenEvolution!: string;
  pathImg!: string;
  pathImgNormal!: string;
  pathImgShiny!: string;
  pathSprite!: string;
  pathSpriteNormal!: string;
  pathSpriteShiny!: string;
  pathAnimatedNormal!: string;
  pathAnimatedShiny!: string;
  pathSound!: string;
  types: TypeVM[] = [];
  weakness: TypeVM[] = [];
  attacks: TypeLearnAttackVM[] = [];
  stats!: number[];
  statTotal!: number;
}

export class FormVM {
  [key: string]: string | PokemonEvoVM[];
  name!: string;
  listForm: PokemonEvoVM[] = [];
}

export class TypeLearnAttackVM {
  name!: string;
  listAttack: AttackVM[] = [];
}
