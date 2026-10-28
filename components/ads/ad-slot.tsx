import { site } from '@/data/site';
import { AdSlotClient, type AdPlacement } from './ad-slot-client';

export type { AdPlacement } from './ad-slot-client';

export function AdSlot({ placement }: { placement: AdPlacement }) {
  if (!site.features.ads) return null;
  return <AdSlotClient placement={placement} />;
}
