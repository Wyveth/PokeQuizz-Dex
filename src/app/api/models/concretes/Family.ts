import { Base } from '../abstracts/base';
import { DataInfo } from './datainfo';
import { TypePokLight } from './typePokLight';

export interface Family extends Base {
  number: string | null;
  dataInfo: DataInfo;
  typePoks: TypePokLight[] | null;
  typeEvolution: string;
  whenEvolution: string | null;
  pathImgNormal: string | null;
  pathSpriteNormal: string | null;
}
