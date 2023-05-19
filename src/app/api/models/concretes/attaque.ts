import { Base } from '../abstracts/base';
import { TypeAttaque } from './typeAttaque';
import { TypePok } from './typePok';

export interface AttaqueResponse extends Base {
  ctcs: string;
  level: string;
  typeLearn: string;
  attaque: Attaque;
}

export interface Attaque extends Base {
  [key: string]: any;
  Name_FR: string;
  Description_FR: string;

  Name_EN: string;
  Description_EN: string;

  Name_ES: string;
  Description_ES: string;

  Name_IT: string;
  Description_IT: string;

  Name_DE: string;
  Description_DE: string;

  Name_RU: string;
  Description_RU: string;

  Name_CO: string;
  Description_CO: string;

  Name_CN: string;
  Description_CN: string;

  Name_JP: string;
  Description_JP: string;

  PP: string;
  Precision: string;
  Puissance: string;
  TypeAttaque: TypeAttaque;
  Types: TypePok;
}
