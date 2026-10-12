import { InventoryItem, MenuItem, Order, StockLedgerEntry } from '../types';

export interface ReservationResult {
  success: boolean;
  shortageItem?: string;
  availableQuantity?: number;
  updatedInventory: InventoryItem[];
  ledgerEntries: StockLedgerEntry[];
}

/**
 * Atomic inventory check and reservation (Spec Section 9.2)
 * Inside order placement: checks if (onHand - reserved) >= requiredQty for every ingredient & packaging.
 * If ANY ingredient is insufficient, rolls back and returns shortage.
 */
export function reserveStockForOrder(
  order: Order,
  menu: MenuItem[],
  currentInventory: InventoryItem[]
): ReservationResult {
  const inventoryCopy = currentInventory.map(item => ({ ...item }));
  const newLedgerEntries: StockLedgerEntry[] = [];

  // Calculate total requirements for the order
  const requirements: { [ingredientId: string]: number } = {};

  for (const orderItem of order.items) {
    const menuItem = menu.find(m => m.id === orderItem.menuItemId);
    if (!menuItem) continue;

    // Ingredients
    for (const ing of menuItem.ingredients) {
      const needed = ing.quantity * orderItem.quantity;
      requirements[ing.ingredientId] = (requirements[ing.ingredientId] || 0) + needed;
    }

    // Packaging: only for Takeaway and Pre-order (Dine-in is plated, no packaging per Spec §3.1)
    if (order.type !== 'DINE_IN') {
      for (const pkg of menuItem.packaging) {
        const needed = pkg.quantity * orderItem.quantity;
        requirements[pkg.ingredientId] = (requirements[pkg.ingredientId] || 0) + needed;
      }
    }
  }

  // Check availability
  for (const [ingredientId, neededQty] of Object.entries(requirements)) {
    const item = inventoryCopy.find(i => i.id === ingredientId);
    if (!item) continue;

    const available = item.onHandQty - item.reservedQty;
    if (available < neededQty) {
      return {
        success: false,
        shortageItem: item.name,
        availableQuantity: available,
        updatedInventory: currentInventory,
        ledgerEntries: []
      };
    }
  }

  // Atomically apply reservations
  for (const [ingredientId, neededQty] of Object.entries(requirements)) {
    const item = inventoryCopy.find(i => i.id === ingredientId);
    if (!item) continue;

    item.reservedQty += neededQty;

    // Update status
    const available = item.onHandQty - item.reservedQty;
    if (available <= 0) {
      item.status = 'Finished';
    } else if (available <= item.reorderLevel) {
      item.status = 'Low';
    } else {
      item.status = 'OK';
    }

    newLedgerEntries.push({
      id: `ledg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ingredientId: item.id,
      ingredientName: item.name,
      type: 'RESERVE',
      quantity: neededQty,
      unit: item.unit,
      orderId: order.id,
      token: order.token,
      reason: `Order ${order.token} accepted`
    });
  }

  return {
    success: true,
    updatedInventory: inventoryCopy,
    ledgerEntries: newLedgerEntries
  };
}

/**
 * Consumes stock when cook taps "Start" (Spec Section 9.1: Point of no return)
 */
export function consumeStockForTask(
  order: Order,
  orderItemId: string,
  menu: MenuItem[],
  currentInventory: InventoryItem[]
): { updatedInventory: InventoryItem[]; ledgerEntries: StockLedgerEntry[] } {
  const inventoryCopy = currentInventory.map(item => ({ ...item }));
  const newLedgerEntries: StockLedgerEntry[] = [];

  const orderItem = order.items.find(i => i.id === orderItemId);
  if (!orderItem) return { updatedInventory: currentInventory, ledgerEntries: [] };

  const menuItem = menu.find(m => m.id === orderItem.menuItemId);
  if (!menuItem) return { updatedInventory: currentInventory, ledgerEntries: [] };

  // Ingredients consumed at start of cooking
  for (const ing of menuItem.ingredients) {
    const consumedQty = ing.quantity * orderItem.quantity;
    const item = inventoryCopy.find(i => i.id === ing.ingredientId);
    if (!item) continue;

    item.onHandQty = Math.max(0, item.onHandQty - consumedQty);
    item.reservedQty = Math.max(0, item.reservedQty - consumedQty);

    const available = item.onHandQty - item.reservedQty;
    item.status = available <= 0 ? 'Finished' : available <= item.reorderLevel ? 'Low' : 'OK';

    newLedgerEntries.push({
      id: `ledg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ingredientId: item.id,
      ingredientName: item.name,
      type: 'CONSUME',
      quantity: consumedQty,
      unit: item.unit,
      orderId: order.id,
      token: order.token,
      reason: `Cook started ${menuItem.name} for ${order.token}`
    });
  }

  return { updatedInventory: inventoryCopy, ledgerEntries: newLedgerEntries };
}

/**
 * Release reserved stock on cancellation before cooking (Spec Section 9.1)
 */
export function releaseStockOnCancel(
  order: Order,
  menu: MenuItem[],
  currentInventory: InventoryItem[]
): { updatedInventory: InventoryItem[]; ledgerEntries: StockLedgerEntry[] } {
  const inventoryCopy = currentInventory.map(item => ({ ...item }));
  const newLedgerEntries: StockLedgerEntry[] = [];

  for (const orderItem of order.items) {
    const menuItem = menu.find(m => m.id === orderItem.menuItemId);
    if (!menuItem) continue;

    for (const ing of menuItem.ingredients) {
      const reservedAmount = ing.quantity * orderItem.quantity;
      const item = inventoryCopy.find(i => i.id === ing.ingredientId);
      if (!item) continue;

      item.reservedQty = Math.max(0, item.reservedQty - reservedAmount);

      const available = item.onHandQty - item.reservedQty;
      item.status = available <= 0 ? 'Finished' : available <= item.reorderLevel ? 'Low' : 'OK';

      newLedgerEntries.push({
        id: `ledg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ingredientId: item.id,
        ingredientName: item.name,
        type: 'RELEASE',
        quantity: reservedAmount,
        unit: item.unit,
        orderId: order.id,
        token: order.token,
        reason: `Order ${order.token} cancelled before cooking`
      });
    }
  }

  return { updatedInventory: inventoryCopy, ledgerEntries: newLedgerEntries };
}
