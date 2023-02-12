import { Base } from "../Abstract/Base.model";
import { DataInfo } from "./DataInfo.model";
import { Talent } from "./Talent.model";
import { TypePok } from "./TypePok.model";

export class Pokemon extends Base {
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

    //Talents
    Talents!: Talent[];

    //Types
    Types!: TypePok[];

    //Weaknesses
    Weaknesses!: TypePok[];

    //Attack
    Attaques!: any[];

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

    //Picture Url
    UrlImg!: string;
    PathImg!: string;

    //Sprite Url
    PathSprite!: string;
    UrlSprite!: string;

    //Sound Url
    PathSound!: string;

    /**
     *
     */
    constructor() {
        super();
        
    }
}