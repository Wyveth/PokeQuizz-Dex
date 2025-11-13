import { Base } from '../abstracts/base';

export interface EvolvesTo extends Base {
  name: string | null;
  whenEvolution: string | null;
  pathImage: string | null;
}
