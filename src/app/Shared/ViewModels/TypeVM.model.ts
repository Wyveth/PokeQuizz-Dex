export class TypeVM{
    Name!: string;
    UrlImg!: string;
    UrlFondGo!: string;
    ImgColor!: string;
    InfoColor!: string;
    TypeColor!: string;
  
    constructor(Name: string, UrlImg: string, UrlFondGo: string, ImgColor: string, InfoColor: string, TypeColor: string){
      this.Name = Name;
      this.UrlImg = UrlImg;
      this.UrlFondGo = UrlFondGo;
      this.ImgColor = ImgColor;
      this.InfoColor = InfoColor;
      this.TypeColor = TypeColor;
    }
  }