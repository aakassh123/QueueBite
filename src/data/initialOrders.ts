import { Order } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-104',
    token: 'A104', // Matches Expo Packing screen in UI preview
    channel: 'WEB',
    type: 'TAKEAWAY',
    status: 'EXPO_CHECK',
    version: 4,
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    items: [
      {
        id: 'item-104-1',
        menuItemId: 'burger-classic',
        name: 'Classic Burger',
        quantity: 1,
        unitPrice: 149,
        totalPrice: 149,
        station: 'grill'
      },
      {
        id: 'item-104-2',
        menuItemId: 'fries-masala',
        name: 'Masala Fries',
        quantity: 1,
        unitPrice: 99,
        totalPrice: 99,
        station: 'fryer'
      },
      {
        id: 'item-104-3',
        menuItemId: 'chai-cutting',
        name: 'Cutting Chai',
        quantity: 1,
        unitPrice: 49,
        totalPrice: 49,
        station: 'beverage'
      }
    ],
    subtotal: 297,
    tax: 0,
    total: 297,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    eta: {
      p50Minutes: 15,
      p80Minutes: 20,
      p90Minutes: 22,
      displayRange: '15 - 20 min',
      promisedAt: '11:02 AM'
    },
    tasks: [
      {
        id: 'task-104-1',
        orderId: 'ord-104',
        token: 'A104',
        orderItemId: 'item-104-1',
        itemName: 'Classic Burger',
        quantity: 1,
        station: 'grill',
        status: 'DONE',
        priority: 2,
        plannedStartMinutes: 0,
        plannedFinishMinutes: 4,
        holdLimitMinutes: 8,
        dependencies: [],
        orderType: 'TAKEAWAY',
        createdAt: '10:42 AM',
        updatedAt: '10:48 AM'
      },
      {
        id: 'task-104-2',
        orderId: 'ord-104',
        token: 'A104',
        orderItemId: 'item-104-2',
        itemName: 'Masala Fries',
        quantity: 1,
        station: 'fryer',
        status: 'DONE',
        priority: 2,
        plannedStartMinutes: 2,
        plannedFinishMinutes: 7,
        holdLimitMinutes: 4,
        dependencies: [],
        orderType: 'TAKEAWAY',
        createdAt: '10:42 AM',
        updatedAt: '10:49 AM'
      },
      {
        id: 'task-104-3',
        orderId: 'ord-104',
        token: 'A104',
        orderItemId: 'item-104-3',
        itemName: 'Cutting Chai',
        quantity: 1,
        station: 'beverage',
        status: 'DONE',
        priority: 2,
        plannedStartMinutes: 3,
        plannedFinishMinutes: 7,
        holdLimitMinutes: 15,
        dependencies: [],
        orderType: 'TAKEAWAY',
        createdAt: '10:42 AM',
        updatedAt: '10:49 AM'
      }
    ],
    createdAt: '10:42 AM',
    placedTime: '10:42 AM',
    expoCheckedItemIds: ['item-104-1'] // 1 checked, 2 unchecked in Expo screenshot
  },
  {
    id: 'ord-101',
    token: 'A101', // NOW in KDS
    channel: 'COUNTER',
    type: 'TAKEAWAY',
    status: 'SCHEDULED',
    version: 2,
    customerName: 'Aman V.',
    customerPhone: '+91 98111 22334',
    items: [
      {
        id: 'item-101-1',
        menuItemId: 'burger-classic',
        name: 'Classic Burger',
        quantity: 1,
        unitPrice: 149,
        totalPrice: 149,
        station: 'grill'
      },
      {
        id: 'item-101-2',
        menuItemId: 'fries-masala',
        name: 'Masala Fries',
        quantity: 1,
        unitPrice: 99,
        totalPrice: 99,
        station: 'fryer'
      }
    ],
    subtotal: 248,
    tax: 0,
    total: 248,
    paymentMethod: 'CASH',
    paymentStatus: 'PAID',
    eta: {
      p50Minutes: 5,
      p80Minutes: 8,
      p90Minutes: 10,
      displayRange: '5 - 8 min',
      promisedAt: '10:50 AM'
    },
    tasks: [
      {
        id: 'task-101-1',
        orderId: 'ord-101',
        token: 'A101',
        orderItemId: 'item-101-1',
        itemName: 'Classic Burger',
        quantity: 1,
        station: 'grill',
        status: 'RELEASED', // Released for NOW column
        priority: 2,
        plannedStartMinutes: 0,
        plannedFinishMinutes: 4,
        holdLimitMinutes: 8,
        dependencies: [],
        orderType: 'TAKEAWAY',
        createdAt: '10:45 AM',
        updatedAt: '10:45 AM'
      },
      {
        id: 'task-101-2',
        orderId: 'ord-101',
        token: 'A101',
        orderItemId: 'item-101-2',
        itemName: 'Masala Fries',
        quantity: 1,
        station: 'fryer',
        status: 'RELEASED',
        priority: 2,
        plannedStartMinutes: 0,
        plannedFinishMinutes: 5,
        holdLimitMinutes: 4,
        dependencies: [],
        orderType: 'TAKEAWAY',
        createdAt: '10:45 AM',
        updatedAt: '10:45 AM'
      }
    ],
    createdAt: '10:45 AM',
    placedTime: '10:45 AM',
    expoCheckedItemIds: []
  },
  {
    id: 'ord-102',
    token: 'A102', // NOW column in KDS
    channel: 'QR',
    type: 'DINE_IN',
    tableNumber: 'Table 3',
    status: 'SCHEDULED',
    version: 2,
    customerName: 'Pooja K.',
    items: [
      {
        id: 'item-102-1',
        menuItemId: 'noodles-chowmein',
        name: 'Veg Chowmein',
        quantity: 2,
        unitPrice: 129,
        totalPrice: 258,
        station: 'wok'
      }
    ],
    subtotal: 258,
    tax: 0,
    total: 258,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    eta: {
      p50Minutes: 8,
      p80Minutes: 10,
      p90Minutes: 12,
      displayRange: '8 - 10 min',
      promisedAt: '10:53 AM'
    },
    tasks: [
      {
        id: 'task-102-1',
        orderId: 'ord-102',
        token: 'A102',
        orderItemId: 'item-102-1',
        itemName: 'Veg Chowmein',
        quantity: 2,
        station: 'wok',
        status: 'RELEASED',
        priority: 1,
        plannedStartMinutes: 0,
        plannedFinishMinutes: 7,
        holdLimitMinutes: 10,
        dependencies: [],
        orderType: 'DINE_IN',
        createdAt: '10:45 AM',
        updatedAt: '10:45 AM'
      }
    ],
    createdAt: '10:45 AM',
    placedTime: '10:45 AM',
    expoCheckedItemIds: []
  },
  {
    id: 'ord-099',
    token: 'A099', // COOKING column in KDS
    channel: 'APP',
    type: 'TAKEAWAY',
    status: 'COOKING',
    version: 3,
    customerName: 'Kunal R.',
    items: [
      {
        id: 'item-099-1',
        menuItemId: 'burger-classic',
        name: 'Classic Burger',
        quantity: 1,
        unitPrice: 149,
        totalPrice: 149,
        station: 'grill'
      }
    ],
    subtotal: 149,
    tax: 0,
    total: 149,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    eta: {
      p50Minutes: 3,
      p80Minutes: 5,
      p90Minutes: 6,
      displayRange: '2:30 min remaining',
      promisedAt: '10:48 AM'
    },
    tasks: [
      {
        id: 'task-099-1',
        orderId: 'ord-099',
        token: 'A099',
        orderItemId: 'item-099-1',
        itemName: 'Classic Burger',
        quantity: 1,
        station: 'grill',
        status: 'COOKING',
        priority: 2,
        plannedStartMinutes: 0,
        plannedFinishMinutes: 4,
        actualStartTime: '10:44 AM',
        holdLimitMinutes: 8,
        dependencies: [],
        orderType: 'TAKEAWAY',
        createdAt: '10:43 AM',
        updatedAt: '10:44 AM'
      }
    ],
    createdAt: '10:43 AM',
    placedTime: '10:43 AM',
    expoCheckedItemIds: []
  },
  {
    id: 'ord-100',
    token: 'A100', // COOKING column in KDS
    channel: 'WEB',
    type: 'PRE_ORDER',
    status: 'COOKING',
    version: 3,
    customerName: 'Meera S.',
    customerPhone: '+91 98222 33445',
    pickupSlot: '10:50 - 10:55 AM',
    items: [
      {
        id: 'item-100-1',
        menuItemId: 'fries-masala',
        name: 'Masala Fries',
        quantity: 2,
        unitPrice: 99,
        totalPrice: 198,
        station: 'fryer'
      }
    ],
    subtotal: 198,
    tax: 0,
    total: 198,
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    eta: {
      p50Minutes: 4,
      p80Minutes: 6,
      p90Minutes: 7,
      displayRange: '3:45 min remaining',
      promisedAt: '10:50 AM',
      leaveAtTime: '10:40 AM'
    },
    customerLocation: {
      distanceKm: 1.2,
      travelTimeMinutes: 7,
      hasDeparted: true,
      hasArrived: false
    },
    tasks: [
      {
        id: 'task-100-1',
        orderId: 'ord-100',
        token: 'A100',
        orderItemId: 'item-100-1',
        itemName: 'Masala Fries',
        quantity: 2,
        station: 'fryer',
        status: 'COOKING',
        priority: 1,
        plannedStartMinutes: 0,
        plannedFinishMinutes: 5,
        actualStartTime: '10:44 AM',
        holdLimitMinutes: 4,
        dependencies: [],
        orderType: 'PRE_ORDER',
        createdAt: '10:40 AM',
        updatedAt: '10:44 AM'
      }
    ],
    createdAt: '10:40 AM',
    placedTime: '10:40 AM',
    expoCheckedItemIds: []
  },
  {
    id: 'ord-103',
    token: 'A103', // UPCOMING column in KDS
    channel: 'WA',
    type: 'PRE_ORDER',
    status: 'SCHEDULED',
    version: 1,
    customerName: 'Sanjay D.',
    pickupSlot: '11:00 - 11:05 AM',
    items: [
      {
        id: 'item-103-1',
        menuItemId: 'burger-cheese',
        name: 'Cheese Burger',
        quantity: 1,
        unitPrice: 169,
        totalPrice: 169,
        station: 'grill'
      },
      {
        id: 'item-103-2',
        menuItemId: 'fries-masala',
        name: 'Masala Fries',
        quantity: 1,
        unitPrice: 99,
        totalPrice: 99,
        station: 'fryer'
      }
    ],
    subtotal: 268,
    tax: 0,
    total: 268,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    eta: {
      p50Minutes: 12,
      p80Minutes: 15,
      p90Minutes: 18,
      displayRange: '12 - 15 min',
      promisedAt: '11:00 AM'
    },
    tasks: [
      {
        id: 'task-103-1',
        orderId: 'ord-103',
        token: 'A103',
        orderItemId: 'item-103-1',
        itemName: 'Cheese Burger',
        quantity: 1,
        station: 'grill',
        status: 'PLANNED',
        priority: 1,
        plannedStartMinutes: 7,
        plannedFinishMinutes: 11,
        holdLimitMinutes: 8,
        dependencies: [],
        orderType: 'PRE_ORDER',
        createdAt: '10:45 AM',
        updatedAt: '10:45 AM'
      },
      {
        id: 'task-103-2',
        orderId: 'ord-103',
        token: 'A103',
        orderItemId: 'item-103-2',
        itemName: 'Masala Fries',
        quantity: 1,
        station: 'fryer',
        status: 'PLANNED',
        priority: 1,
        plannedStartMinutes: 6,
        plannedFinishMinutes: 11,
        holdLimitMinutes: 4,
        dependencies: [],
        orderType: 'PRE_ORDER',
        createdAt: '10:45 AM',
        updatedAt: '10:45 AM'
      }
    ],
    createdAt: '10:45 AM',
    placedTime: '10:45 AM',
    expoCheckedItemIds: []
  },
  {
    id: 'ord-106',
    token: 'A106', // BLOCKED column in KDS
    channel: 'WEB',
    type: 'TAKEAWAY',
    status: 'SCHEDULED',
    version: 1,
    customerName: 'Ankit T.',
    items: [
      {
        id: 'item-106-1',
        menuItemId: 'burger-classic',
        name: 'Classic Burger',
        quantity: 1,
        unitPrice: 149,
        totalPrice: 149,
        station: 'grill'
      }
    ],
    subtotal: 149,
    tax: 0,
    total: 149,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    eta: {
      p50Minutes: 20,
      p80Minutes: 25,
      p90Minutes: 28,
      displayRange: 'Station Hold',
      promisedAt: '11:10 AM'
    },
    tasks: [
      {
        id: 'task-106-1',
        orderId: 'ord-106',
        token: 'A106',
        orderItemId: 'item-106-1',
        itemName: 'Classic Burger',
        quantity: 1,
        station: 'grill',
        status: 'BLOCKED',
        priority: 1,
        plannedStartMinutes: 15,
        plannedFinishMinutes: 19,
        holdLimitMinutes: 8,
        dependencies: [],
        orderType: 'TAKEAWAY',
        createdAt: '10:45 AM',
        updatedAt: '10:45 AM'
      }
    ],
    createdAt: '10:45 AM',
    placedTime: '10:45 AM',
    expoCheckedItemIds: []
  },
  {
    id: 'ord-098',
    token: 'A098', // AT RISK column in KDS (25 min alert)
    channel: 'BOT',
    type: 'TAKEAWAY',
    status: 'COOKING',
    version: 4,
    customerName: 'Deepak M.',
    items: [
      {
        id: 'item-098-1',
        menuItemId: 'noodles-chowmein',
        name: 'Veg Chowmein',
        quantity: 3,
        unitPrice: 129,
        totalPrice: 387,
        station: 'wok'
      }
    ],
    subtotal: 387,
    tax: 0,
    total: 387,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    eta: {
      p50Minutes: 25,
      p80Minutes: 28,
      p90Minutes: 30,
      displayRange: '25 min (At Risk)',
      promisedAt: '10:45 AM'
    },
    tasks: [
      {
        id: 'task-098-1',
        orderId: 'ord-098',
        token: 'A098',
        orderItemId: 'item-098-1',
        itemName: 'Veg Chowmein',
        quantity: 3,
        station: 'wok',
        status: 'COOKING',
        priority: 3,
        plannedStartMinutes: 0,
        plannedFinishMinutes: 10,
        actualStartTime: '10:35 AM',
        holdLimitMinutes: 10,
        dependencies: [],
        orderType: 'TAKEAWAY',
        createdAt: '10:30 AM',
        updatedAt: '10:35 AM'
      }
    ],
    createdAt: '10:30 AM',
    placedTime: '10:30 AM',
    expoCheckedItemIds: []
  }
];
