import { Base } from '../abstracts/base';
import { DataInfo } from './datainfo';
import { TypePokLight } from './typePokLight';

export interface PokemonLight extends Base {
  number: string | null;
  dataInfo: DataInfo;
  typePoks: TypePokLight[] | null;
  typeEvolution: string | null;
  pathImgLegacy: string | null;
  pathImgNormal: string | null;
  pathImgShiny: string | null;
  pathSpriteLegacy: string | null;
  pathSpriteNormal: string | null;
  pathSpriteShiny: string | null;
  pathAnimatedImg: string | null;
  pathAnimatedImgShiny: string | null;
}
