import { Base } from '../abstracts/base';

export interface DataInfo extends Base {
  //Name
  name: string;

  //DisplayName
  displayName: string;

  //Pokemon Description Version X
  descriptionVx: string;

  //Pokemon Description Version Y
  descriptionVy: string;

  //size
  size: string;

  //category
  category: string;

  //Weight
  weight: string;

  //Skill
  talent: string;

  //Skill Description
  descriptionTalent: string;

  //Pokemon Family/Evolution
  evolutions: string;

  //Know When Where How the pokemon evolves
  whenEvolution: string;
}

export class DataInfoLight extends Base {
  //Name
  name!: string;

  constructor(id: number, name: string) {
    super(id);
    this.name = name;
  }
}
