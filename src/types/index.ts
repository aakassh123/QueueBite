export type OrderType = 'TAKEAWAY' | 'DINE_IN' | 'PRE_ORDER';

export type OrderChannel = 'QR' | 'WEB' | 'APP' | 'WA' | 'BOT' | 'COUNTER';

export type OrderStatus =
  | 'PLACED'
  | 'PAID'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'COOKING'
  | 'ASSEMBLY'
  | 'EXPO_CHECK'
  | 'READY'
  | 'HANDED_OVER'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'NO_SHOW'
  | 'FAILED'
  | 'REFUNDED';

export type TaskStatus =
  | 'PLANNED'
  | 'READY'
  | 'RELEASED'
  | 'COOKING'
  | 'DONE'
  | 'BLOCKED'
  | 'CANCELLED'
  | 'FAILED';

export type KitchenStationId =
  | 'grill'
  | 'fryer'
  | 'wok'
  | 'cold'
  | 'beverage'
  | 'packing';

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number; // e.g. 1 bun, 150g potato, etc.
  unit: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Burgers' | 'Fries' | 'Chai' | 'Noodles' | 'Chaat' | 'Drinks';
  description: string;
  price: number;
  image: string;
  station: KitchenStationId;
  cookTimeMinutes: number; // P50 duration
  holdLimitMinutes: number; // Max wait before quality degrades
  batchCapacity: number; // e.g. 2 for fryer basket, 4 for grill
  ingredients: RecipeIngredient[];
  packaging: RecipeIngredient[];
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  station: KitchenStationId;
  course?: 'starter' | 'main' | 'dessert';
}

export interface KitchenTask {
  id: string;
  orderId: string;
  token: string;
  orderItemId: string;
  itemName: string;
  quantity: number;
  station: KitchenStationId;
  resourceId?: string; // e.g. 'fryer-basket-1'
  status: TaskStatus;
  priority: number; // calculated slack priority
  plannedStartMinutes: number; // relative to shift/order time
  plannedFinishMinutes: number;
  actualStartTime?: string;
  actualFinishTime?: string;
  holdLimitMinutes: number;
  holdTimerStart?: number; // timestamp when marked DONE
  batchId?: string;
  dependencies: string[]; // task IDs that must be DONE first
  orderType: OrderType;
  createdAt: string;
  updatedAt: string;
}

export interface EtaRange {
  p50Minutes: number;
  p80Minutes: number;
  p90Minutes: number;
  displayRange: string; // e.g. "8 - 11 min"
  promisedAt: string;
  leaveAtTime?: string; // e.g. "13:04" for pre-orders
}

export interface Order {
  id: string;
  token: string; // P-001, T-001, W-001 or A104 format
  channel: OrderChannel;
  type: OrderType;
  status: OrderStatus;
  version: number;
  customerName?: string;
  customerPhone?: string;
  tableNumber?: string;
  pickupSlot?: string; // e.g. "13:15 - 13:20"
  pickupWindowStart?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'CASH';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  eta: EtaRange;
  customerLocation?: {
    distanceKm: number;
    travelTimeMinutes: number;
    hasDeparted: boolean; // "I'm leaving" clicked
    hasArrived: boolean; // "I'm here" clicked
  };
  tasks: KitchenTask[];
  createdAt: string;
  placedTime: string;
  readyTime?: string;
  completedTime?: string;
  expoCheckedItemIds: string[];
  expoReadyUndoDeadline?: number; // timestamp until when undo is allowed (20s)
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Ingredient' | 'Packaging';
  onHandQty: number;
  reservedQty: number;
  unit: string;
  reorderLevel: number;
  status: 'OK' | 'Low' | 'Order Now' | 'Finished';
  costPerUnit: number;
}

export interface StockLedgerEntry {
  id: string;
  timestamp: string;
  ingredientId: string;
  ingredientName: string;
  type: 'RESERVE' | 'RELEASE' | 'CONSUME' | 'WASTE' | 'ADJUST' | 'RECEIPT';
  quantity: number;
  unit: string;
  orderId?: string;
  token?: string;
  reason?: string;
}

export interface StationLoad {
  station: KitchenStationId;
  name: string;
  activeTasks: number;
  queueMinutes: number;
  utilizationPct: number;
  isBottleneck: boolean;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
}

export interface AppNotification {
  id: string;
  orderId: string;
  token: string;
  type: 'ORDER_ACCEPTED' | 'ORDER_PREPARING' | 'ORDER_READY' | 'DELAY_DETECTED';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
