import { INITIAL_MENU } from '../src/data/initialMenu.js';
import { INITIAL_INVENTORY } from '../src/data/initialInventory.js';
import { runSmartQueueScheduler, calculateEtaRange, createTasksForOrder } from '../src/engine/scheduler.js';
import { reserveStockForOrder, consumeStockForTask } from '../src/engine/inventory.js';

console.log('========================================================');
console.log('🧪 QUEUEBITE v4.0 SENIOR ENGINEERING VERIFICATION TEST');
console.log('========================================================\n');

let testsPassed = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// TEST 1: Menu and BOM definitions
assert(INITIAL_MENU.length >= 8, `Menu contains ${INITIAL_MENU.length} items (expected >= 8)`);
const burger = INITIAL_MENU.find(m => m.id === 'burger-classic');
assert(burger && burger.ingredients.length >= 5, 'Classic Burger BOM has ingredients defined');
assert(burger && burger.packaging.length >= 1, 'Classic Burger BOM has packaging defined (Spec §9)');

// TEST 2: Atomic Inventory Reservation (Spec §9.2)
const testOrder1 = {
  id: 'test-ord-1',
  token: 'A104',
  type: 'TAKEAWAY',
  items: [
    { id: 'i1', menuItemId: 'burger-classic', quantity: 2, unitPrice: 149, totalPrice: 298, station: 'grill' }
  ]
};

const reserveResult = reserveStockForOrder(testOrder1, INITIAL_MENU, INITIAL_INVENTORY);
assert(reserveResult.success === true, 'Atomic inventory reservation succeeds for available stock');
assert(reserveResult.ledgerEntries.length > 0, `Recorded ${reserveResult.ledgerEntries.length} audit ledger entries for reservation`);

// TEST 3: Shortage Rollback Test (Scenario 4: Stock shortage)
const lowInventory = INITIAL_INVENTORY.map(item =>
  item.id === 'ing-burger-bun' ? { ...item, onHandQty: 1, reservedQty: 0 } : item
);
const testOrderShortage = {
  id: 'test-ord-shortage',
  token: 'A105',
  type: 'TAKEAWAY',
  items: [
    { id: 'i1', menuItemId: 'burger-classic', quantity: 2, unitPrice: 149, totalPrice: 298, station: 'grill' }
  ]
};
const shortageResult = reserveStockForOrder(testOrderShortage, INITIAL_MENU, lowInventory);
assert(shortageResult.success === false, 'Atomic reservation correctly rejected order when buns < requested qty');
assert(shortageResult.shortageItem === 'Burger Buns', `Identified exact shortage item: ${shortageResult.shortageItem}`);

// TEST 4: Task Generation (Spec §5)
const generatedTasks = createTasksForOrder(testOrder1, INITIAL_MENU);
assert(generatedTasks.length === 1, `Generated ${generatedTasks.length} task(s) for burger item`);
assert(generatedTasks[0].station === 'grill', `Task correctly assigned to station: ${generatedTasks[0].station}`);
assert(generatedTasks[0].status === 'PLANNED', 'Initial task state is PLANNED');

// TEST 5: Honest ETA Range (Spec §7.6)
const eta = calculateEtaRange(testOrder1, INITIAL_MENU, { grill: 0 });
assert(eta.displayRange.includes('-'), `ETA is a realistic range: ${eta.displayRange} (never a single flat number)`);
assert(eta.p80Minutes > eta.p50Minutes, `P80 (${eta.p80Minutes}m) is strictly greater than P50 (${eta.p50Minutes}m)`);

// TEST 6: Smart Queue Pure Function Scheduling (Scenario 1 Validation)
const orderA = {
  id: 'scen-A',
  token: 'P-001',
  type: 'PRE_ORDER',
  status: 'SCHEDULED',
  items: [{ id: 'iA', menuItemId: 'fries-masala', quantity: 2, unitPrice: 99, totalPrice: 198, station: 'fryer' }],
  tasks: [
    { id: 'tA', orderId: 'scen-A', token: 'P-001', orderItemId: 'iA', itemName: 'Masala Fries', quantity: 2, station: 'fryer', status: 'PLANNED', priority: 1, plannedStartMinutes: 6, plannedFinishMinutes: 11, holdLimitMinutes: 4, dependencies: [], orderType: 'PRE_ORDER', createdAt: '13:00', updatedAt: '13:00' }
  ],
  customerLocation: { distanceKm: 2.0, travelTimeMinutes: 10, hasDeparted: false, hasArrived: false }
};

const orderD = {
  id: 'scen-D',
  token: 'W-001',
  type: 'TAKEAWAY',
  status: 'SCHEDULED',
  items: [{ id: 'iD', menuItemId: 'fries-masala', quantity: 1, unitPrice: 99, totalPrice: 99, station: 'fryer' }],
  tasks: [
    { id: 'tD', orderId: 'scen-D', token: 'W-001', orderItemId: 'iD', itemName: 'Masala Fries', quantity: 1, station: 'fryer', status: 'PLANNED', priority: 2, plannedStartMinutes: 0, plannedFinishMinutes: 5, holdLimitMinutes: 4, dependencies: [], orderType: 'TAKEAWAY', createdAt: '13:03', updatedAt: '13:03' }
  ]
};

const scheduleResult = runSmartQueueScheduler([orderA, orderD], INITIAL_MENU, 0);
assert(scheduleResult.tasksToRelease.includes('tD'), 'Present takeaway customer (tD) is released immediately');
assert(!scheduleResult.tasksToRelease.includes('tA'), 'Pre-order customer (tA) is held for backward planning (fries stay hot!)');

console.log(`\n========================================================`);
console.log(`🎉 TEST SUMMARY: ${testsPassed}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
console.log(`========================================================\n`);
