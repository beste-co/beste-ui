import type { BlockMeta } from '@/lib/block-types';

export const meta: BlockMeta = {
  name: 'booking4',
  title: 'Service Selector',
  description:
    'Service selection grid with category filter tabs, service cards showing icon, name, description, duration, price, and selected state. Ideal for spa, salon, clinic, and fitness booking flows.',
  category: 'Booking',
  isPro: false,
  registryDependencies: ['badge', 'button'],
};
