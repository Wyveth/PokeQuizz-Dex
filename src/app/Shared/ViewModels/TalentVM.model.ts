export class TalentVM{
    Name!: string;
    Description!: string;
  
    constructor(Name: string, Description: string){
      this.Name = Name;
      this.Description = Description;
    }
  }