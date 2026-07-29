import type { BlockMeta } from '@/lib/block-types';

export const meta: BlockMeta = {
  name: 'booking15',
  title: 'Booking Confirmation Receipt',
  description:
    'Post-booking success screen with animated check icon, confirmation number, booking summary (service, date/time, location, total), scannable QR code ticket, action buttons (calendar, receipt, directions), and email confirmation note.',
  category: 'Booking',
  isPro: false,
  registryDependencies: ["avatar", "badge", "button"],
};
