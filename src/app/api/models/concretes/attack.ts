import { Base } from '../abstracts/base';
import { TypeAttack } from './typeAttack';
import { TypePok } from './typePok';

export interface Attack extends Base {
  name: string | null;
  description: string | null;

  typeAttack: TypeAttack | null;
  typePok: TypePok | null;

  typeLearn: string | null;
  level: string | null;
  ctcs: string | null;

  power: string | null;
  precision: string | null;
  pp: string | null;
}
