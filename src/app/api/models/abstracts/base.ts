export interface Base {
  [key: string]: any;
  id: number;
}

export class Base implements Base {
  id: number;
  constructor(id: number) {
    this.id = id;
  }
}
