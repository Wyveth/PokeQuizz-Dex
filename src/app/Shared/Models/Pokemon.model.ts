import { DataInfo } from "./DataInfo.model";
import { TypePok } from "./TypePok.model";

export class Pokemon {
    //Pokemon ID
    Id!: number;
    //Pokemon Number
    Number!: string;

    //French
    FR!: DataInfo;
    //English
    EN!: DataInfo;
    //Spanish
    ES!: DataInfo;
    //Italian
    IT!: DataInfo;
    //German
    DE!: DataInfo;
    //Russian
    RU!: DataInfo;
    //Korean
    CO!: DataInfo;
    //Chinese
    CN!: DataInfo;
    //Partial Japanese
    JP!: DataInfo;

    //Types
    Types!: TypePok[];

    //Weaknesses
    Weaknesses!: TypePok[];

    //Type Evolution : Normal, Méga, Gigamax, Alola, Galar, Hisui
    TypeEvolution!: string;

    //Stastistic HP
    StatPv!: number;

    //Stastistic Attack
    StatAttaque!: number;

    //Stastistic Defense
    StatDefense!: number;

    //Stastistic Sp. Attack
    StatAttaqueSpe!: number;

    //Stastistic Sp. Defense
    StatDefenseSpe!: number;

    //Stastistic Speed
    StatVitesse!: number;

    //Stastistic Global
    StatTotal!: number;

    //Generation Number
    Generation!: number;

    //Url de l'Image
    UrlImg!: string;

    //Sprite Url
    UrlSprite!: string;
}