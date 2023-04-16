import { Base } from "../Abstract/Base.model";

export class DataInfo extends Base {
    //Name
    Name!: string;

    //DisplayName
    DisplayName!: string;

    //Pokemon Description Version X
    DescriptionVx!: string;

    //Pokemon Description Version Y
    DescriptionVy!: string;

    //Size
    Size!: string;

    //Category
    Category!: string;

    //Weight
    Weight!: string;

    //Skill
    Talent!: string;

    //Skill Description
    DescriptionTalent!: string;

    //Pokemon Type
    Types!: string;

    //Pokemon Weakness
    Weakness!: string;

    //Pokemon Family/Evolution
    Evolutions!: string;

    //Know When Where How the pokemon evolves
    WhenEvolution!: string;

    //Next Pokemon
    NextUrl!: string;
}

export class DataInfoLight extends Base {
    //Name
    Name!: string;

    constructor(Name: string) {
        super();
        this.Name = Name;
    }
}
