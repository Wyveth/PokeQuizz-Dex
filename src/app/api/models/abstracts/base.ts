export interface Base {
  [key: string]: any;
  Id: number;
}

export class Base implements Base {
  Id: number;
  constructor(Id: number) {
    this.Id = Id;
  }
}
