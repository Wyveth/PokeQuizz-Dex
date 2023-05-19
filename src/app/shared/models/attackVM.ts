export class AttackVM {
  Name!: string;
  Description!: string;
  UrlTypeAttack!: string;
  UrlTypePok!: string;

  constructor(
    Name: string,
    Description: string,
    UrlTypeAttack: string,
    UrlTypePok: string
  ) {
    this.Name = Name;
    this.Description = Description;
    this.UrlTypeAttack = UrlTypeAttack;
    this.UrlTypePok = UrlTypePok;
  }
}
