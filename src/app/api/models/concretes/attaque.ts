import { Base } from '../abstracts/base';
import { TypeAttaque } from './typeAttaque';
import { TypePok } from './typePok';

export interface Attaque extends Base {
  name: string;
  description: string;

  typeAttaque: TypeAttaque;
  types: TypePok;

  typeLearn: string;
  level: string;
  ctcs: string;

  pp: string;
  precision: string;
  puissance: string;
}
