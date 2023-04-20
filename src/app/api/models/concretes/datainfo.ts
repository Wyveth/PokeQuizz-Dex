import { Base } from "../abstracts/base";

export interface DataInfo extends Base {
    //Name
    Name: string;

    //DisplayName
    DisplayName: string;

    //Pokemon Description Version X
    DescriptionVx: string;

    //Pokemon Description Version Y
    DescriptionVy: string;

    //Size
    Size: string;

    //Category
    Category: string;

    //Weight
    Weight: string;

    //Skill
    Talent: string;

    //Skill Description
    DescriptionTalent: string;

    //Pokemon Type
    Types: string;

    //Pokemon Weakness
    Weakness: string;

    //Pokemon Family/Evolution
    Evolutions: string;

    //Know When Where How the pokemon evolves
    WhenEvolution: string;

    //Next Pokemon
    NextUrl: string;
}

export class DataInfoLight extends Base {
    //Name
    Name!: string;

    constructor(Id: number, Name: string) {
        super(Id);
        this.Name = Name;
    }
}
