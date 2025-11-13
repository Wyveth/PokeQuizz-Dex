import { Base } from '../abstracts/base';

export interface DataInfo extends Base {
  //Name
  name: string | null;

  //DisplayName
  displayName: string | null;

  //Pokemon Description Version X
  descriptionVx: string | null;

  //Pokemon Description Version Y
  descriptionVy: string | null;

  //size
  size: string | null;

  //category
  category: string | null;

  //Weight
  weight: string | null;

  //Pokemon Family/Evolution
  evolutions: string | null;

  //Know When Where How the pokemon evolves
  whenEvolution: string | null;
}
