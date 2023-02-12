export class TypeVM{
    Name!: string;
    PathImg!: string;
    PathFondGo!: string;
    ImgColor!: string;
    InfoColor!: string;
    TypeColor!: string;
  
    constructor(Name: string, PathImg: string, PathFondGo: string, ImgColor: string, InfoColor: string, TypeColor: string){
      this.Name = Name;
      this.PathImg = PathImg;
      this.PathFondGo = PathFondGo;
      this.ImgColor = ImgColor;
      this.InfoColor = InfoColor;
      this.TypeColor = TypeColor;
    }
  }