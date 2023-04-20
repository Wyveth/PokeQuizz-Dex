export class TalentVM{
    Name!: string;
    Description!: string;
    IsHidden!: boolean;
  
    constructor(Name: string, Description: string, IsHidden: boolean){
      this.Name = Name;
      this.Description = Description;
      this.IsHidden = IsHidden;
    }
  }