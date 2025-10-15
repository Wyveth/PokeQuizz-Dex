import { Base } from '../abstracts/base';

export interface Talent extends Base {
  name: string;
  description: string;
  isHidden: boolean;
}
