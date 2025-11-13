import { Base } from '../abstracts/base';

export interface TypePok extends Base {
  name: string | null;
  pathMiniHome: string | null;

  pathMiniGo: string | null;
  pathFondGo: string | null;
  pathIconHome: string | null;
  pathAutoHome: string | null;

  imgColor: string | null;
  infoColor: string | null;
  typeColor: string | null;
}
