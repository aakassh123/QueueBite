export interface HourlyData {
  hour: string;
  orders: number;
}

export interface ChannelBreakdown {
  channel: string;
  percentage: number;
  orders: number;
  color: string;
}

export const HOURLY_ORDERS_TODAY: HourlyData[] = [
  { hour: '8am', orders: 4 },
  { hour: '10am', orders: 11 },
  { hour: '12pm', orders: 24 },
  { hour: '2pm', orders: 19 },
  { hour: '4pm', orders: 12 },
  { hour: '6pm', orders: 26 },
  { hour: '8pm', orders: 34 },
  { hour: '10pm', orders: 14 }
];

export const PEAK_HOURS_WEEK: HourlyData[] = [
  { hour: '9am', orders: 22 },
  { hour: '11am', orders: 58 },
  { hour: '1pm', orders: 115 },
  { hour: '3pm', orders: 42 },
  { hour: '5pm', orders: 68 },
  { hour: '7pm', orders: 138 },
  { hour: '8pm', orders: 144 },
  { hour: '9pm', orders: 95 }
];

export const CHANNEL_DISTRIBUTION: ChannelBreakdown[] = [
  { channel: 'Takeaway', percentage: 52, orders: 445, color: '#3B82F6' },
  { channel: 'Dine-in', percentage: 28, orders: 240, color: '#F97316' },
  { channel: 'Pre-order', percentage: 20, orders: 171, color: '#10B981' }
];

export const TOP_SELLING_ITEMS = [
  { name: 'Classic Burger', count: 48, revenue: 7152 },
  { name: 'Masala Fries', count: 36, revenue: 3564 },
  { name: 'Cutting Chai', count: 28, revenue: 1372 },
  { name: 'Veg Chowmein', count: 24, revenue: 3096 },
  { name: 'Cheese Burger', count: 22, revenue: 3718 }
];
