import { Base } from '../abstracts/base';
import { Attaque } from './attaque';
import { DataInfo, DataInfoLight } from './datainfo';
import { Talent } from './talent';
import { TypePok, TypePokLight } from './typePok';

export interface Pokemon extends Base {
  //Pokemon number
  number: string;

  //French
  dataInfo: DataInfo;

  //Talents
  talents: Talent[];

  //types
  types: TypePok[];

  //weaknesses
  weaknesses: TypePok[];

  //Attack
  attaques: Attaque[];

  //Type Evolution : Normal, Méga, Gigamax, Alola, Galar, Hisui
  typeEvolution: string;

  //Stastistic HP
  statPv: number;

  //Stastistic Attack
  statAttaque: number;

  //Stastistic Defense
  statDefense: number;

  //Stastistic Sp. Attack
  statAttaqueSpe: number;

  //Stastistic Sp. Defense
  statDefenseSpe: number;

  //Stastistic Speed
  statVitesse: number;

  //Stastistic Global
  statTotal: number;

  //Generation number
  generation: number;

  //Picture Url
  pathImgLegacy: string;
  pathImgNormal: string;
  pathImgShiny: string;

  pathAnimatedImg: string;
  pathAnimatedImgShiny: string;

  //Sprite Url
  pathSpriteLegacy: string;
  pathSpriteNormal: string;
  pathSpriteShiny: string;

  //Sound Url
  pathSound: string;
  pathSoundLegacy: string;
  pathSoundCurrent: string;
}

export class PokemonLight extends Base {
  //Pokemon number
  number!: string;

  dataInfo!: DataInfoLight;

  //types
  typePoks!: TypePokLight[];

  pathImgLegacy!: string;
  pathImgNormal!: string;
  pathImgShiny!: string;

  pathSpriteLegacy!: string;
  pathSpriteNormal!: string;
  pathSpriteShiny!: string;

  pathAnimatedImg!: string;
  pathAnimatedImgShiny!: string;

  constructor(
    id: number,
    number: string,
    dataInfo: DataInfoLight,
    typePoks: TypePokLight[],
    pathImgLegacy: string,
    pathImgNormal: string,
    pathImgShiny: string,
    pathSpriteLegacy: string,
    pathSpriteNormal: string,
    pathSpriteShiny: string,
    pathAnimatedImg: string,
    pathAnimatedImgShiny: string
  ) {
    super(id);
    this.id = id;
    this.number = number;
    this.dataInfo = dataInfo;
    this.typePoks = typePoks;
    this.pathImgLegacy = pathImgLegacy;
    this.pathImgNormal = pathImgNormal;
    this.pathImgShiny = pathImgShiny;
    this.pathSpriteLegacy = pathSpriteLegacy;
    this.pathSpriteNormal = pathSpriteNormal;
    this.pathSpriteShiny = pathSpriteShiny;
    this.pathAnimatedImg = pathAnimatedImg;
    this.pathAnimatedImgShiny = pathAnimatedImgShiny;
  }
}
