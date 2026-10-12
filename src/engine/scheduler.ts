import {
  KitchenStationId,
  KitchenTask,
  MenuItem,
  Order,
  StationLoad,
  EtaRange
} from '../types';

export interface SchedulerDecision {
  tasksToRelease: string[]; // task IDs
  batchesFormed: { batchId: string; item: string; taskIds: string[]; station: KitchenStationId }[];
  etaSnapshots: { [orderId: string]: EtaRange };
  stationLoads: StationLoad[];
  isSafeMode: boolean;
}

const STATION_NAMES: { [key in KitchenStationId]: string } = {
  grill: 'Grill / Tawa',
  fryer: 'Deep Fryer',
  wok: 'Wok Burner',
  cold: 'Cold / Chaat',
  beverage: 'Tea & Beverage',
  packing: 'Packing & Expo'
};

/**
 * Creates individual kitchen tasks for an order's items (Spec Section 5)
 */
export function createTasksForOrder(order: Order, menu: MenuItem[]): KitchenTask[] {
  const tasks: KitchenTask[] = [];
  const now = new Date().toISOString();

  for (const item of order.items) {
    const menuItem = menu.find(m => m.id === item.menuItemId);
    const cookMinutes = menuItem ? menuItem.cookTimeMinutes : 5;
    const holdLimit = menuItem ? menuItem.holdLimitMinutes : 8;
    const station = menuItem ? menuItem.station : 'grill';

    const taskId = `task-${order.id}-${item.id}`;

    // Priority based on customer type (Spec Section 7.3-E: Standing walk-in = 2, Dine-in = 1, Pre-order = 1)
    let priorityWeight = order.type === 'TAKEAWAY' ? 2 : 1;
    if (order.customerLocation?.hasArrived) {
      priorityWeight = 2; // Pre-order customer arrived -> becomes weight 2
    }

    tasks.push({
      id: taskId,
      orderId: order.id,
      token: order.token,
      orderItemId: item.id,
      itemName: item.name,
      quantity: item.quantity,
      station,
      status: 'PLANNED',
      priority: priorityWeight,
      plannedStartMinutes: 0,
      plannedFinishMinutes: cookMinutes,
      holdLimitMinutes: holdLimit,
      dependencies: [],
      orderType: order.type,
      createdAt: now,
      updatedAt: now
    });
  }

  return tasks;
}

/**
 * Calculates honest ETA range (Spec Section 7.6)
 * Customers see [P50, P80] rounded to whole minutes ("ready in 8–11 min")
 */
export function calculateEtaRange(
  order: Order,
  menu: MenuItem[],
  stationQueues: { [key in KitchenStationId]?: number }
): EtaRange {
  // Find longest cook duration among items + station queue delay
  let maxDuration = 4;
  for (const item of order.items) {
    const menuItem = menu.find(m => m.id === item.menuItemId);
    const cookTime = menuItem?.cookTimeMinutes || 4;
    const queueDelay = stationQueues[menuItem?.station || 'grill'] || 0;
    const itemTotal = cookTime + queueDelay;
    if (itemTotal > maxDuration) {
      maxDuration = itemTotal;
    }
  }

  // Add 1-2 min for pack and expo check
  const p50 = maxDuration + 1.5;
  const p80 = Math.ceil(p50 * 1.25);
  const p90 = Math.ceil(p50 * 1.4);

  const displayRange = `${Math.floor(p50)} - ${p80} min`;

  // Calculate "Leave at HH:MM" if pre-order
  let leaveAtTime: string | undefined;
  if (order.type === 'PRE_ORDER' && order.pickupSlot) {
    const travelTime = order.customerLocation?.travelTimeMinutes || 10;
    // Estimated arrival needed at p50 ready time
    const slotStartParts = order.pickupSlot.split(' ')[0].split(':');
    if (slotStartParts.length === 2) {
      const slotHour = parseInt(slotStartParts[0], 10);
      const slotMin = parseInt(slotStartParts[1], 10);
      let leaveMin = slotMin - travelTime;
      let leaveHour = slotHour;
      if (leaveMin < 0) {
        leaveMin += 60;
        leaveHour -= 1;
      }
      leaveAtTime = `${String(leaveHour).padStart(2, '0')}:${String(leaveMin).padStart(2, '0')}`;
    }
  }

  return {
    p50Minutes: p50,
    p80Minutes: p80,
    p90Minutes: p90,
    displayRange,
    promisedAt: new Date(Date.now() + p80 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    leaveAtTime
  };
}

/**
 * Pure Function Smart Queue Scheduler (Spec Section 7)
 * Evaluates active orders and returns release decisions, batch opportunities, and station loads.
 */
export function runSmartQueueScheduler(
  activeOrders: Order[],
  menu: MenuItem[],
  currentTimeMinutes: number = 0
): SchedulerDecision {
  const stationTaskCounts: { [key in KitchenStationId]: number } = {
    grill: 0,
    fryer: 0,
    wok: 0,
    cold: 0,
    beverage: 0,
    packing: 0
  };

  const tasksToRelease: string[] = [];
  const batchesFormed: SchedulerDecision['batchesFormed'] = [];
  const etaSnapshots: { [orderId: string]: EtaRange } = {};

  // 1. Gather all tasks
  const pendingTasks: KitchenTask[] = [];
  for (const order of activeOrders) {
    if (order.status === 'CANCELLED' || order.status === 'COMPLETED' || order.status === 'READY') {
      continue;
    }

    for (const task of order.tasks) {
      if (task.status === 'COOKING') {
        stationTaskCounts[task.station] = (stationTaskCounts[task.station] || 0) + 1;
      } else if (task.status === 'PLANNED' || task.status === 'READY') {
        pendingTasks.push(task);
      }
    }
  }

  // 2. Backward planning and release decisions (Spec Section 7.3 Rule C & D)
  for (const task of pendingTasks) {
    const parentOrder = activeOrders.find(o => o.id === task.orderId);
    if (!parentOrder) continue;

    // Rule D: Present customers (Walk-in, Dine-in, or arrived pre-orders) are released now
    const isPresentCustomer =
      parentOrder.type === 'TAKEAWAY' ||
      parentOrder.type === 'DINE_IN' ||
      Boolean(parentOrder.customerLocation?.hasArrived);

    if (isPresentCustomer) {
      tasksToRelease.push(task.id);
    } else {
      // Rule C: Pre-order customer - backward plan from pickup deadline (Spec §7.3-C)
      // D is deadline in minutes from order placement (e.g. 14 min for 13:14 slot)
      const travelMins = parentOrder.customerLocation?.travelTimeMinutes || 10;
      const targetDeadlineMinutes = parentOrder.type === 'PRE_ORDER' ? travelMins + 4 : 14;
      const menuItem = menu.find(m => m.name === task.itemName);
      const duration = menuItem?.cookTimeMinutes || 5;
      const holdLimit = task.holdLimitMinutes || (menuItem?.holdLimitMinutes || 4);
      const packTime = 1;
      const buffer = 3;

      // Spec Formula: r = D - pack - duration - 0.25 * hold_limit - buffer
      const earliestRelease = targetDeadlineMinutes - packTime - duration - (0.25 * holdLimit) - buffer;

      if (currentTimeMinutes >= earliestRelease || parentOrder.customerLocation?.hasDeparted) {
        tasksToRelease.push(task.id);
      }
    }
  }

  // 3. Safe Batching detection (Spec Section 8: Group same items e.g. 2 fries into 1 basket)
  const releasedPendingTasks = pendingTasks.filter(t => tasksToRelease.includes(t.id));
  const groupedByItem: { [itemName: string]: KitchenTask[] } = {};

  for (const task of releasedPendingTasks) {
    if (!groupedByItem[task.itemName]) {
      groupedByItem[task.itemName] = [];
    }
    groupedByItem[task.itemName].push(task);
  }

  for (const [itemName, tasks] of Object.entries(groupedByItem)) {
    if (tasks.length >= 2) {
      const sample = tasks[0];
      const batchId = `batch-${sample.station}-${Date.now().toString().slice(-4)}`;
      batchesFormed.push({
        batchId,
        item: itemName,
        taskIds: tasks.map(t => t.id),
        station: sample.station
      });
    }
  }

  // 4. Compute ETAs and Station Loads
  const stationLoads: StationLoad[] = (Object.keys(STATION_NAMES) as KitchenStationId[]).map(station => {
    const count = stationTaskCounts[station];
    const queueMinutes = count * 4.5;
    const utilizationPct = Math.min(100, Math.round((count / 3) * 100)); // assumes avg 3 units
    return {
      station,
      name: STATION_NAMES[station],
      activeTasks: count,
      queueMinutes,
      utilizationPct,
      isBottleneck: count >= 3,
      status: count >= 5 ? 'DEGRADED' : 'ONLINE'
    };
  });

  const queuesMap: { [key in KitchenStationId]?: number } = {};
  for (const sl of stationLoads) {
    queuesMap[sl.station] = sl.queueMinutes;
  }

  for (const order of activeOrders) {
    etaSnapshots[order.id] = calculateEtaRange(order, menu, queuesMap);
  }

  return {
    tasksToRelease,
    batchesFormed,
    etaSnapshots,
    stationLoads,
    isSafeMode: false
  };
}
