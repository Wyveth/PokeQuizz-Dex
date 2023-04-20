export interface Base {
    Id: number;
}

export class Base implements Base {
    Id: number;
    constructor(Id: number) {
        this.Id = Id;
    }
}
