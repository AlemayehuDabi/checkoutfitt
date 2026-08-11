import { ClosetItemType } from '../../prisma/generated/prisma';

export const CLOSET_DETECTION_QUEUE = 'closet-detection';

export const CLOSET_ITEM_TYPES = [
  'top',
  'bottom',
  'outerwear',
  'dress',
  'footwear',
  'accessory',
  'bag',
  'other',
] as const;
export type ClosetItemTypeValue = (typeof CLOSET_ITEM_TYPES)[number];

export function toClosetItemType(value: ClosetItemTypeValue): ClosetItemType {
  return value.toUpperCase() as ClosetItemType;
}
