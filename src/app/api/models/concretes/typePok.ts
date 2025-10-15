import { Base } from '../abstracts/base';

export interface TypePok extends Base {
  name: string;
  pathMiniHome: string;

  pathMiniGo: string;
  pathFondGo: string;
  pathIconHome: string;
  pathAutoHome: string;

  imgColor: string;
  infoColor: string;
  typeColor: string;
}

export class TypePokLight extends Base {
  name!: string;
  pathMiniHome!: string;

  constructor(id: number, name: string, pathMiniHome: string) {
    super(id);
    this.name = name;
    this.pathMiniHome = pathMiniHome;
  }
}
