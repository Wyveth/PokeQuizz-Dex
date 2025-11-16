import { Base } from '../abstracts/base';
import { Attack } from './attack';
import { DataInfo } from './datainfo';
import { Ability } from './ability';
import { TypePok } from './typePok';
import { EvolvesTo } from './evolvesTo';

export interface Pokemon extends Base {
  //Pokemon number
  number: string | null;

  //Data Info
  dataInfo: DataInfo;

  //types
  typePoks: TypePok[];

  //weaknesses
  weaknesses: TypePok[] | null;

  //Abilities
  abilities: Ability[] | null;

  //Attack
  attacks: Attack[] | null;

  //Type Evolution : Normal, Méga, Gigamax, Alola, Galar, Hisui
  typeEvolution: string | null;

  evolvesFrom: EvolvesTo[] | null;

  evolvesTo: EvolvesTo[] | null;

  evolutionChainId: number;

  evolutionStage: number | null;

  //Stastistic HP
  statPv: number;

  //Stastistic Attack
  statAttack: number;

  //Stastistic Defense
  statDefense: number;

  //Stastistic Sp. Attack
  statAttackSpe: number;

  //Stastistic Sp. Defense
  statDefenseSpe: number;

  //Stastistic Speed
  statSpeed: number;

  //Stastistic Global
  statTotal: number;

  //Egg Moves
  eggMoves: string | null;

  //Capture Rate
  captureRate: string | null;

  //Base Happiness
  basicHappiness: string | null;

  //Generation number
  generation: number;

  //Picture Url
  pathImgLegacy: string | null;
  pathImgNormal: string | null;
  pathImgShiny: string | null;

  //Sprite Url
  pathSpriteLegacy: string | null;
  pathSpriteNormal: string | null;
  pathSpriteShiny: string | null;

  //Sound Url
  pathSound: string | null;
  pathSoundLegacy: string | null;
  pathSoundCurrent: string | null;

  pathAnimatedImg: string | null;
  pathAnimatedImgShiny: string | null;
}
