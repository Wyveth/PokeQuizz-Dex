export class AttackVM {
  name!: string;
  description!: string;
  pathTypeAttack!: string;
  pathTypePok!: string;

  constructor(name: string, description: string, pathTypeAttack: string, pathTypePok: string) {
    this.name = name;
    this.description = description;
    this.pathTypeAttack = pathTypeAttack;
    this.pathTypePok = pathTypePok;
  }
}
