import { Base } from "../abstracts/base";

export interface TypePok extends Base {
    //French Name
    Name_FR: string;
    UrlMiniHome_FR: string;

    //English Name
    Name_EN: string;
    UrlMiniHome_EN: string;

    //Spanish Name
    Name_ES: string;
    UrlMiniHome_ES: string;

    //Italian Name
    Name_IT: string;
    UrlMiniHome_IT: string;

    //German Name
    Name_DE: string;
    UrlMiniHome_DE: string;

    //Russian Name
    Name_RU: string;
    UrlMiniHome_RU: string;

    //Korean Name
    Name_CO: string;
    UrlMiniHome_CO: string;

    //Chinese Name
    Name_CN: string;
    UrlMiniHome_CN: string;

    //Japanese Name
    Name_JP: string;
    UrlMiniHome_JP: string;

    PathMiniGo: string;
    
    PathFondGo: string;

    PathIconHome: string;

    PathAutoHome: string;

    ImgColor: string;
    InfoColor: string;
    TypeColor: string;

    typePok: any;
}

export class TypePokLight extends Base {
    //French Name
    Name_FR!: string;
    UrlMiniHome_FR!: string;

    //English Name
    Name_EN!: string;
    UrlMiniHome_EN!: string;

    //Spanish Name
    Name_ES!: string;
    UrlMiniHome_ES!: string;

    //Italian Name
    Name_IT!: string;
    UrlMiniHome_IT!: string;

    //German Name
    Name_DE!: string;
    UrlMiniHome_DE!: string;

    //Russian Name
    Name_RU!: string;
    UrlMiniHome_RU!: string;

    //Korean Name
    Name_CO!: string;
    UrlMiniHome_CO!: string;

    //Chinese Name
    Name_CN!: string;
    UrlMiniHome_CN!: string;

    //Japanese Name
    Name_JP!: string;
    UrlMiniHome_JP!: string;

    typePok!: any;

    constructor(Id: number,Name_FR: string, UrlMiniHome_FR: string, Name_EN: string, UrlMiniHome_EN: string, Name_ES: string, UrlMiniHome_ES: string, Name_IT: string, UrlMiniHome_IT: string, Name_DE: string, UrlMiniHome_DE: string, Name_RU: string, UrlMiniHome_RU: string, Name_CO: string, UrlMiniHome_CO: string, Name_CN: string, UrlMiniHome_CN: string, Name_JP: string, UrlMiniHome_JP: string) {
        super(Id);
        this.Name_FR = Name_FR;
        this.UrlMiniHome_FR = UrlMiniHome_FR;
        this.Name_EN = Name_EN;
        this.UrlMiniHome_EN = UrlMiniHome_EN;
        this.Name_ES = Name_ES;
        this.UrlMiniHome_ES = UrlMiniHome_ES;
        this.Name_IT = Name_IT;
        this.UrlMiniHome_IT = UrlMiniHome_IT;
        this.Name_DE = Name_DE;
        this.UrlMiniHome_DE = UrlMiniHome_DE;
        this.Name_RU = Name_RU;
        this.UrlMiniHome_RU = UrlMiniHome_RU;
        this.Name_CO = Name_CO;
        this.UrlMiniHome_CO = UrlMiniHome_CO;
        this.Name_CN = Name_CN;
        this.UrlMiniHome_CN = UrlMiniHome_CN;
        this.Name_JP = Name_JP;
        this.UrlMiniHome_JP = UrlMiniHome_JP;
    }
}
