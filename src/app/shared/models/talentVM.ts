export class TalentVM {
  name!: string;
  description!: string;
  isHidden!: boolean;

  constructor(name: string, description: string, isHidden: boolean) {
    this.name = name;
    this.description = description;
    this.isHidden = isHidden;
  }
}
