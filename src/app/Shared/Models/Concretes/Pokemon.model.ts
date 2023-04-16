import { Base } from "../Abstract/Base.model";
import { DataInfo, DataInfoLight } from "./DataInfo.model";
import { Talent, TalentResponse } from "./Talent.model";
import { TypePok, TypePokLight } from "./TypePok.model";

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
    //Japanese
    JP!: DataInfo;

    //Talents
    Talents!: TalentResponse[];

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
}

export class PokemonLight extends Base {
    //Pokemon Number
    Number!: string;

    //French
    FR!: DataInfoLight;
    //English
    EN!: DataInfoLight;
    //Spanish
    ES!: DataInfoLight;
    //Italian
    IT!: DataInfoLight;
    //German
    DE!: DataInfoLight;
    //Russian
    RU!: DataInfoLight;
    //Korean
    CO!: DataInfoLight;
    //Chinese
    CN!: DataInfoLight;
    //Japanese
    JP!: DataInfoLight;

    //Types
    Types!: TypePokLight[];

    PathImg!: string;

    constructor(Id: number, Number: string, FR: DataInfoLight, EN: DataInfoLight, ES: DataInfoLight, IT: DataInfoLight, DE: DataInfoLight, RU: DataInfoLight, CO: DataInfoLight, CN: DataInfoLight, JP: DataInfoLight, Types: TypePokLight[], PathImg: string) {
        super();
        this.Id = Id;
        this.Number = Number;
        this.FR = FR;
        this.EN = EN;
        this.ES = ES;
        this.IT = IT;
        this.DE = DE;
        this.RU = RU;
        this.CO = CO;
        this.CN = CN;
        this.JP = JP;
        this.Types = Types;
        this.PathImg = PathImg;
    }
}
