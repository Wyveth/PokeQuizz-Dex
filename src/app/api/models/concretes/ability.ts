import { Base } from '../abstracts/base';

export interface Ability extends Base {
  name: string | null;
  description: string | null;
  isHidden: boolean | null;
}
