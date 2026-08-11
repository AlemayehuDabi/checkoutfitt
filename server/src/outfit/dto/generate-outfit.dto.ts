import { IsIn } from 'class-validator';
import { OUTFIT_CONTEXTS } from '../constants';
import type { OutfitContextValue } from '../constants';

export class GenerateOutfitDto {
  @IsIn(OUTFIT_CONTEXTS)
  context: OutfitContextValue;
}
