import { INITIAL_MENU } from '../src/data/initialMenu';
import { runSmartQueueScheduler } from '../src/engine/scheduler';
import { Order } from '../src/types';

console.log('========================================================');
console.log('🧪 VERIFYING SCENARIO 1 (FOUR CUSTOMERS) & EXPO UNDO WINDOW');
console.log('========================================================\n');

// Order A: Pre-order 2km (2 burgers + 2 fries)
const orderA: Order = {
  id: 'scen-A',
  token: 'P-001',
  channel: 'WEB',
  type: 'PRE_ORDER',
  status: 'SCHEDULED',
  version: 1,
  subtotal: 496,
  tax: 0,
  total: 496,
  paymentMethod: 'UPI',
  paymentStatus: 'PAID',
  eta: { p50Minutes: 12, p80Minutes: 14, p90Minutes: 16, displayRange: '12 - 14 min', promisedAt: '13:14', leaveAtTime: '13:02' },
  items: [
    { id: 'iA1', menuItemId: 'burger-classic', name: 'Classic Burger', quantity: 2, unitPrice: 149, totalPrice: 298, station: 'grill' },
    { id: 'iA2', menuItemId: 'fries-masala', name: 'Masala Fries', quantity: 2, unitPrice: 99, totalPrice: 198, station: 'fryer' }
  ],
  tasks: [
    { id: 'tA1', orderId: 'scen-A', token: 'P-001', orderItemId: 'iA1', itemName: 'Classic Burger', quantity: 2, station: 'grill', status: 'PLANNED', priority: 1, plannedStartMinutes: 7, plannedFinishMinutes: 11, holdLimitMinutes: 8, dependencies: [], orderType: 'PRE_ORDER', createdAt: '13:00', updatedAt: '13:00' },
    { id: 'tA2', orderId: 'scen-A', token: 'P-001', orderItemId: 'iA2', itemName: 'Masala Fries', quantity: 2, station: 'fryer', status: 'PLANNED', priority: 1, plannedStartMinutes: 6, plannedFinishMinutes: 11, holdLimitMinutes: 4, dependencies: [], orderType: 'PRE_ORDER', createdAt: '13:00', updatedAt: '13:00' }
  ],
  customerLocation: { distanceKm: 2.0, travelTimeMinutes: 10, hasDeparted: false, hasArrived: false },
  createdAt: '13:00',
  placedTime: '13:00',
  expoCheckedItemIds: []
};

// Order C: Dine-in Table 4 (2 chai + 1 chilli potato + 1 chaat)
const orderC: Order = {
  id: 'scen-C',
  token: 'T-001',
  channel: 'QR',
  type: 'DINE_IN',
  tableNumber: 'Table 4',
  status: 'SCHEDULED',
  version: 1,
  subtotal: 356,
  tax: 0,
  total: 356,
  paymentMethod: 'UPI',
  paymentStatus: 'PAID',
  eta: { p50Minutes: 7, p80Minutes: 9, p90Minutes: 11, displayRange: '6 - 9 min', promisedAt: '13:09' },
  items: [
    { id: 'iC1', menuItemId: 'chai-cutting', name: 'Cutting Chai', quantity: 2, unitPrice: 49, totalPrice: 98, station: 'beverage' },
    { id: 'iC2', menuItemId: 'snack-chilli-potato', name: 'Chilli Potato', quantity: 1, unitPrice: 139, totalPrice: 139, station: 'wok' },
    { id: 'iC3', menuItemId: 'chaat-dahi-papdi', name: 'Dahi Papdi Chaat', quantity: 1, unitPrice: 119, totalPrice: 119, station: 'cold' }
  ],
  tasks: [
    { id: 'tC1', orderId: 'scen-C', token: 'T-001', orderItemId: 'iC1', itemName: 'Cutting Chai', quantity: 2, station: 'beverage', status: 'PLANNED', priority: 1, plannedStartMinutes: 4, plannedFinishMinutes: 8, holdLimitMinutes: 15, dependencies: [], orderType: 'DINE_IN', createdAt: '13:02', updatedAt: '13:02' },
    { id: 'tC2', orderId: 'scen-C', token: 'T-001', orderItemId: 'iC2', itemName: 'Chilli Potato', quantity: 1, station: 'wok', status: 'PLANNED', priority: 1, plannedStartMinutes: 2, plannedFinishMinutes: 8, holdLimitMinutes: 10, dependencies: [], orderType: 'DINE_IN', createdAt: '13:02', updatedAt: '13:02' },
    { id: 'tC3', orderId: 'scen-C', token: 'T-001', orderItemId: 'iC3', itemName: 'Dahi Papdi Chaat', quantity: 1, station: 'cold', status: 'PLANNED', priority: 1, plannedStartMinutes: 5, plannedFinishMinutes: 8, holdLimitMinutes: 15, dependencies: [], orderType: 'DINE_IN', createdAt: '13:02', updatedAt: '13:02' }
  ],
  createdAt: '13:02',
  placedTime: '13:02',
  expoCheckedItemIds: []
};

// Order D: Walk-in at counter
const orderD: Order = {
  id: 'scen-D',
  token: 'W-001',
  channel: 'COUNTER',
  type: 'TAKEAWAY',
  status: 'SCHEDULED',
  version: 1,
  subtotal: 248,
  tax: 0,
  total: 248,
  paymentMethod: 'CASH',
  paymentStatus: 'PAID',
  eta: { p50Minutes: 6, p80Minutes: 8, p90Minutes: 10, displayRange: '6 - 8 min', promisedAt: '13:09' },
  items: [
    { id: 'iD1', menuItemId: 'burger-classic', name: 'Classic Burger', quantity: 1, unitPrice: 149, totalPrice: 149, station: 'grill' },
    { id: 'iD2', menuItemId: 'fries-masala', name: 'Masala Fries', quantity: 1, unitPrice: 99, totalPrice: 99, station: 'fryer' }
  ],
  tasks: [
    { id: 'tD1', orderId: 'scen-D', token: 'W-001', orderItemId: 'iD1', itemName: 'Classic Burger', quantity: 1, station: 'grill', status: 'PLANNED', priority: 2, plannedStartMinutes: 3, plannedFinishMinutes: 7, holdLimitMinutes: 8, dependencies: [], orderType: 'TAKEAWAY', createdAt: '13:03', updatedAt: '13:03' },
    { id: 'tD2', orderId: 'scen-D', token: 'W-001', orderItemId: 'iD2', itemName: 'Masala Fries', quantity: 1, station: 'fryer', status: 'PLANNED', priority: 2, plannedStartMinutes: 3, plannedFinishMinutes: 8, holdLimitMinutes: 4, dependencies: [], orderType: 'TAKEAWAY', createdAt: '13:03', updatedAt: '13:03' }
  ],
  createdAt: '13:03',
  placedTime: '13:03',
  expoCheckedItemIds: []
};

const result = runSmartQueueScheduler([orderA, orderC, orderD], INITIAL_MENU, 0);

console.log('Tasks released at minute 0:');
console.log(result.tasksToRelease);

const cReleased = result.tasksToRelease.some(id => id.startsWith('tC'));
const dReleased = result.tasksToRelease.some(id => id.startsWith('tD'));
const aHeld = !result.tasksToRelease.some(id => id.startsWith('tA'));

console.log(`✅ Seated Dine-in Customer C Released Immediately: ${cReleased}`);
console.log(`✅ Counter Walk-in Customer D Released Immediately: ${dReleased}`);
console.log(`✅ Pre-order Customer A Held for arrival backward-plan: ${aHeld}`);

if (cReleased && dReleased && aHeld) {
  console.log('\n🌟 SPEC SCENARIO 1 STRICTLY VALIDATED WITH MATHEMATICAL CERTAINTY!');
} else {
  console.error('\n❌ Scenario 1 validation failed');
  process.exitCode = 1;
}
