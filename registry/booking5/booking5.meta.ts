import type { BlockMeta } from '@/lib/block-types';

export const meta: BlockMeta = {
  name: 'booking5',
  title: 'Provider Picker',
  description:
    'Staff/provider selection cards with avatar, name, specialty, star rating, review count, availability badge, experience years, and selected state. Grid layout with "Any Provider" option.',
  category: 'Booking',
  isPro: false,
  registryDependencies: ['badge', 'button', 'avatar'],
};
