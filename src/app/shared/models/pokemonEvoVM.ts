import { TypeVM } from "./typeVM";

export class PokemonEvoVM{
    Id!: Number;
    Number!: string;
    Name!: string;
    Type: TypeVM[] = [];
    UrlImg!: string;
    UrlSprite!: string;
    WhenEvolution!: string;

    constructor(Id: Number, Number: string, Name: string, Type: TypeVM[], UrlImg: string, UrlSprite: string, WhenEvolution: string){
      this.Id = Id;
      this.Number = Number;
      this.Name = Name;
      this.Type = Type;
      this.UrlImg = UrlImg;
      this.UrlSprite = UrlSprite;
      this.WhenEvolution = WhenEvolution;
    }
  }