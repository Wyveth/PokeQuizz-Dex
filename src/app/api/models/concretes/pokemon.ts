import { Base } from '../abstracts/base';
import { AttaqueResponse } from './attaque';
import { DataInfo, DataInfoLight } from './datainfo';
import { TalentResponse } from './talent';
import { TypePok, TypePokLight } from './typePok';

export interface Pokemon extends Base {
  //Pokemon Number
  Number: string;

  //French
  FR: DataInfo;
  //English
  EN: DataInfo;
  //Spanish
  ES: DataInfo;
  //Italian
  IT: DataInfo;
  //German
  DE: DataInfo;
  //Russian
  RU: DataInfo;
  //Korean
  CO: DataInfo;
  //Chinese
  CN: DataInfo;
  //Japanese
  JP: DataInfo;

  //Talents
  Talents: TalentResponse[];

  //Types
  Types: TypePok[];

  //Weaknesses
  Weaknesses: TypePok[];

  //Attack
  Attaques: AttaqueResponse[];

  //Type Evolution : Normal, Méga, Gigamax, Alola, Galar, Hisui
  TypeEvolution: string;

  //Stastistic HP
  StatPv: number;

  //Stastistic Attack
  StatAttaque: number;

  //Stastistic Defense
  StatDefense: number;

  //Stastistic Sp. Attack
  StatAttaqueSpe: number;

  //Stastistic Sp. Defense
  StatDefenseSpe: number;

  //Stastistic Speed
  StatVitesse: number;

  //Stastistic Global
  StatTotal: number;

  //Generation Number
  Generation: number;

  //Picture Url
  UrlImg: string;
  PathImgLegacy: string;
  PathImgNormal: string;
  PathImgShiny: string;

  PathAnimatedImg: string;
  PathAnimatedImgShiny: string;

  //Sprite Url
  UrlSprite: string;
  PathSpriteLegacy: string;
  PathSpriteNormal: string;
  PathSpriteShiny: string;

  //Sound Url
  PathSound: string;
  PathSoundLegacy: string;
  PathSoundCurrent: string;
}

export class PokemonLight extends Base {
  //Pokemon Number
  Number!: string;

  //French
  FR!: DataInfoLight;
  //English
  EN!: DataInfoLight;
  //Spanish
  ES!: DataInfoLight;
  //Italian
  IT!: DataInfoLight;
  //German
  DE!: DataInfoLight;
  //Russian
  RU!: DataInfoLight;
  //Korean
  CO!: DataInfoLight;
  //Chinese
  CN!: DataInfoLight;
  //Japanese
  JP!: DataInfoLight;

  //Types
  Types!: TypePokLight[];

  PathImgLegacy!: string;
  PathImgNormal!: string;
  PathImgShiny!: string;

  PathSpriteLegacy!: string;
  PathSpriteNormal!: string;
  PathSpriteShiny!: string;

  constructor(
    Id: number,
    Number: string,
    FR: DataInfoLight,
    EN: DataInfoLight,
    ES: DataInfoLight,
    IT: DataInfoLight,
    DE: DataInfoLight,
    RU: DataInfoLight,
    CO: DataInfoLight,
    CN: DataInfoLight,
    JP: DataInfoLight,
    Types: TypePokLight[],
    PathImgLegacy: string,
    PathImgNormal: string,
    PathImgShiny: string,
    PathSpriteLegacy: string,
    PathSpriteNormal: string,
    PathSpriteShiny: string
  ) {
    super(Id);
    this.Id = Id;
    this.Number = Number;
    this.FR = FR;
    this.EN = EN;
    this.ES = ES;
    this.IT = IT;
    this.DE = DE;
    this.RU = RU;
    this.CO = CO;
    this.CN = CN;
    this.JP = JP;
    this.Types = Types;
    this.PathImgLegacy = PathImgLegacy;
    this.PathImgNormal = PathImgNormal;
    this.PathImgShiny = PathImgShiny;
    this.PathSpriteLegacy = PathImgLegacy;
    this.PathSpriteNormal = PathSpriteNormal;
    this.PathSpriteShiny = PathSpriteShiny;
  }
}
