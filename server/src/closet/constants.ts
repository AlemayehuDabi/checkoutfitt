import { ClosetItemType } from '../../prisma/generated/prisma';

export const CLOSET_DETECTION_QUEUE = 'closet-detection';

/**
 * Detection calls a third-party vision API, which fails transiently often
 * enough that a single attempt would permanently mark good items FAILED.
 * Exponential backoff spaces retries at roughly 2s, 4s, 8s.
 */
export const DETECTION_JOB_OPTIONS = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 2000 },
};

export const DEFAULT_CLOSET_PAGE_SIZE = 50;
export const MAX_CLOSET_PAGE_SIZE = 100;

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
