import { TypeVM } from './typeVM';

export class PokemonEvoVM {
  Id!: number;
  number!: string;
  Name!: string;
  Type: TypeVM[] = [];
  UrlImg!: string;
  UrlSprite!: string;
  WhenEvolution!: string;

  constructor(
    Id: number,
    number: string,
    Name: string,
    Type: TypeVM[],
    UrlImg: string,
    UrlSprite: string,
    WhenEvolution: string
  ) {
    this.Id = Id;
    this.number = number;
    this.Name = Name;
    this.Type = Type;
    this.UrlImg = UrlImg;
    this.UrlSprite = UrlSprite;
    this.WhenEvolution = WhenEvolution;
  }
}
