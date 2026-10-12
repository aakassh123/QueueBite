import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Order,
  OrderItem,
  InventoryItem,
  StockLedgerEntry,
  MenuItem,
  OrderType,
  KitchenStationId,
  AppNotification
} from '../types';
import { INITIAL_MENU } from '../data/initialMenu';
import { INITIAL_INVENTORY, INITIAL_LEDGER } from '../data/initialInventory';
import { INITIAL_ORDERS } from '../data/initialOrders';
import { reserveStockForOrder, consumeStockForTask, releaseStockOnCancel } from '../engine/inventory';
import { createTasksForOrder, runSmartQueueScheduler } from '../engine/scheduler';

export type UserRole =
  | 'customer'
  | 'pos'
  | 'kds'
  | 'expo'
  | 'dashboard'
  | 'inventory'
  | 'reports';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface RestaurantContextType {
  // Global Data
  menu: MenuItem[];
  orders: Order[];
  inventory: InventoryItem[];
  ledger: StockLedgerEntry[];
  notifications: AppNotification[];
  role: UserRole;
  setRole: (role: UserRole) => void;

  // Customer & Cart Flow
  cart: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  pickupSlot: string;
  setPickupSlot: (slot: string) => void;
  activeCustomerOrderId: string | null;
  setActiveCustomerOrderId: (id: string | null) => void;

  addToCart: (item: MenuItem, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;

  placeOrder: (paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'CASH') => {
    success: boolean;
    order?: Order;
    error?: string;
  };

  // Staff & KDS Actions
  activeStationFilter: KitchenStationId | 'all';
  setActiveStationFilter: (station: KitchenStationId | 'all') => void;
  startKitchenTask: (taskId: string) => void;
  completeKitchenTask: (taskId: string) => void;

  // Expo Actions
  toggleExpoCheckItem: (orderId: string, itemId: string) => void;
  markOrderReadyExpo: (orderId: string) => { success: boolean; error?: string };
  undoExpoReady: (orderId: string) => void;
  handoverOrder: (orderId: string) => void;
  reFireTask: (orderId: string, itemId: string, reason: string) => void;

  // Customer Live Tracking Actions
  customerImLeaving: (orderId: string) => void;
  customerImHere: (orderId: string) => void;

  // Inventory Management
  restockIngredient: (id: string, qty: number) => void;
  recordWaste: (id: string, qty: number, reason: string) => void;

  // Scenarios Simulator
  runScenario: (scenarioNum: number) => void;
  resetAllData: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('queuebite_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('queuebite_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });
  const [ledger, setLedger] = useState<StockLedgerEntry[]>(() => {
    const saved = localStorage.getItem('queuebite_ledger');
    return saved ? JSON.parse(saved) : INITIAL_LEDGER;
  });
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      orderId: 'ord-104',
      token: 'A104',
      type: 'ORDER_PREPARING',
      title: 'Order A104 in Preparation',
      message: 'Your food is now being freshly assembled at the Expo station.',
      timestamp: '10:48 AM',
      read: false
    }
  ]);

  const [role, setRole] = useState<UserRole>('customer');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('TAKEAWAY');
  const [customerName, setCustomerName] = useState('Ananya Sen');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 12345');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [pickupSlot, setPickupSlot] = useState('ASAP (15–20 min)');
  const [activeCustomerOrderId, setActiveCustomerOrderId] = useState<string | null>('ord-104');
  const [activeStationFilter, setActiveStationFilter] = useState<KitchenStationId | 'all'>('all');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('queuebite_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('queuebite_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('queuebite_ledger', JSON.stringify(ledger));
  }, [ledger]);

  // Periodic undo countdown check for Expo Ready taps (Spec Section 10: 20-second undo window)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setOrders(prev =>
        prev.map(ord => {
          if (ord.expoReadyUndoDeadline && now >= ord.expoReadyUndoDeadline) {
            // Undo window elapsed -> finalize READY status and emit notification
            return {
              ...ord,
              status: 'READY',
              readyTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              expoReadyUndoDeadline: undefined
            };
          }
          return ord;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cart operations
  const addToCart = (item: MenuItem, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + qty } : ci
        );
      }
      return [...prev, { menuItem: item, quantity: qty }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.menuItem.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prev =>
        prev.map(ci => (ci.menuItem.id === itemId ? { ...ci, quantity: qty } : ci))
      );
    }
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0);

  // Generate unique tokens per Spec Section 3.3 (P-0xx, T-0xx, W-0xx or A1xx)
  const getNextToken = (type: OrderType): string => {
    const prefix = type === 'PRE_ORDER' ? 'P' : type === 'DINE_IN' ? 'T' : 'W';
    const count = orders.filter(o => o.type === type).length + 1;
    return `${prefix}-${String(count).padStart(3, '0')}`;
  };

  // Place Order with atomic inventory reservation and task creation
  const placeOrder = (paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'CASH') => {
    if (cart.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    const orderId = `ord-${Date.now()}`;
    const token = getNextToken(orderType);
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const orderItems: OrderItem[] = cart.map((ci, index) => ({
      id: `item-${orderId}-${index + 1}`,
      menuItemId: ci.menuItem.id,
      name: ci.menuItem.name,
      quantity: ci.quantity,
      unitPrice: ci.menuItem.price,
      totalPrice: ci.menuItem.price * ci.quantity,
      station: ci.menuItem.station
    }));

    // Build candidate order
    const candidateOrder: Order = {
      id: orderId,
      token,
      channel: role === 'pos' ? 'COUNTER' : 'WEB',
      type: orderType,
      status: 'ACCEPTED',
      version: 1,
      customerName,
      customerPhone,
      tableNumber: orderType === 'DINE_IN' ? tableNumber : undefined,
      pickupSlot: orderType === 'PRE_ORDER' ? pickupSlot : undefined,
      items: orderItems,
      subtotal: cartTotal,
      tax: 0,
      total: cartTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH' && orderType !== 'DINE_IN' ? 'PAID' : 'PAID',
      eta: {
        p50Minutes: 12,
        p80Minutes: 16,
        p90Minutes: 18,
        displayRange: '12 - 16 min',
        promisedAt: new Date(Date.now() + 16 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      customerLocation:
        orderType === 'PRE_ORDER'
          ? {
              distanceKm: 1.5,
              travelTimeMinutes: 8,
              hasDeparted: false,
              hasArrived: false
            }
          : undefined,
      tasks: [],
      createdAt: nowTimeStr,
      placedTime: nowTimeStr,
      expoCheckedItemIds: []
    };

    // 1. Atomic Stock Reservation (Spec Section 9.2)
    const reserveResult = reserveStockForOrder(candidateOrder, menu, inventory);
    if (!reserveResult.success) {
      return {
        success: false,
        error: `Shortage: Only ${reserveResult.availableQuantity || 0} left of ${reserveResult.shortageItem}`
      };
    }

    // 2. Create tasks
    const tasks = createTasksForOrder(candidateOrder, menu);
    candidateOrder.tasks = tasks;

    // 3. Update inventory, ledger & order list
    setInventory(reserveResult.updatedInventory);
    setLedger(prev => [...prev, ...reserveResult.ledgerEntries]);
    setOrders(prev => [candidateOrder, ...prev]);

    // 4. Run Smart Queue scheduler to release present customer tasks
    setTimeout(() => {
      setOrders(current => {
        const scheduleResult = runSmartQueueScheduler(current, menu, 0);
        return current.map(ord => ({
          ...ord,
          tasks: ord.tasks.map(t =>
            scheduleResult.tasksToRelease.includes(t.id) && t.status === 'PLANNED'
              ? { ...t, status: 'RELEASED' }
              : t
          )
        }));
      });
    }, 100);

    // 5. Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        orderId,
        token,
        type: 'ORDER_ACCEPTED',
        title: `Order Confirmed: ${token}`,
        message: `Your order has been placed. Estimated ready in 12 - 16 min.`,
        timestamp: nowTimeStr,
        read: false
      },
      ...prev
    ]);

    setActiveCustomerOrderId(orderId);
    clearCart();

    return { success: true, order: candidateOrder };
  };

  // KDS Task: Cook taps Start
  const startKitchenTask = (taskId: string) => {
    setOrders(prev => {
      let updatedInventory = inventory;
      let newLedger = ledger;

      const newOrders = prev.map(order => {
        const hasTask = order.tasks.some(t => t.id === taskId);
        if (!hasTask) return order;

        const updatedTasks = order.tasks.map(t => {
          if (t.id === taskId) {
            // Consume stock on Start (Spec Section 9.1: Point of no return)
            const consumeRes = consumeStockForTask(order, t.orderItemId, menu, updatedInventory);
            updatedInventory = consumeRes.updatedInventory;
            newLedger = [...newLedger, ...consumeRes.ledgerEntries];

            return {
              ...t,
              status: 'COOKING' as const,
              actualStartTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return t;
        });

        return {
          ...order,
          status: (order.status === 'SCHEDULED' || order.status === 'ACCEPTED' ? 'COOKING' : order.status) as any,
          tasks: updatedTasks
        };
      });

      setInventory(updatedInventory);
      setLedger(newLedger);
      return newOrders;
    });
  };

  // KDS Task: Cook taps Done
  const completeKitchenTask = (taskId: string) => {
    setOrders(prev =>
      prev.map(order => {
        const hasTask = order.tasks.some(t => t.id === taskId);
        if (!hasTask) return order;

        const updatedTasks = order.tasks.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              status: 'DONE' as const,
              actualFinishTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              holdTimerStart: Date.now()
            };
          }
          return t;
        });

        // Check if all tasks for this order are DONE
        const allTasksDone = updatedTasks.every(t => t.status === 'DONE');
        const nextOrderStatus = allTasksDone ? 'EXPO_CHECK' : order.status;

        return {
          ...order,
          status: nextOrderStatus as any,
          tasks: updatedTasks
        };
      })
    );
  };

  // Expo item checklist toggle
  const toggleExpoCheckItem = (orderId: string, itemId: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        const exists = order.expoCheckedItemIds.includes(itemId);
        const newChecked = exists
          ? order.expoCheckedItemIds.filter(id => id !== itemId)
          : [...order.expoCheckedItemIds, itemId];
        return {
          ...order,
          expoCheckedItemIds: newChecked
        };
      })
    );
  };

  // Expo: Mark as Ready with 20s undo window (Spec Section 10)
  const markOrderReadyExpo = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found' };

    // Safety guard: all items must be checked
    const allChecked = order.items.every(item => order.expoCheckedItemIds.includes(item.id));
    if (!allChecked) {
      return { success: false, error: 'Please check off all items before marking ready' };
    }

    // Set 20s undo window
    const undoDeadline = Date.now() + 20000;
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, expoReadyUndoDeadline: undoDeadline } : o))
    );

    return { success: true };
  };

  // Cancel the Ready tap within 20 seconds
  const undoExpoReady = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, expoReadyUndoDeadline: undefined } : o))
    );
  };

  // Counter / Waiter Handover
  const handoverOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'COMPLETED',
              completedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : o
      )
    );
  };

  // Re-fire a task if Expo rejects or burnt/dropped
  const reFireTask = (orderId: string, itemId: string, reason: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;

        const updatedTasks = order.tasks.map(t => {
          if (t.orderItemId === itemId) {
            return {
              ...t,
              status: 'RELEASED' as const, // send back to cook NOW
              actualStartTime: undefined,
              actualFinishTime: undefined
            };
          }
          return t;
        });

        // Record waste for the discarded portion
        const item = order.items.find(i => i.id === itemId);
        if (item) {
          const menuItem = menu.find(m => m.id === item.menuItemId);
          if (menuItem && menuItem.ingredients[0]) {
            setLedger(l => [
              ...l,
              {
                id: `ledg-waste-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                ingredientId: menuItem.ingredients[0].ingredientId,
                ingredientName: menuItem.name,
                type: 'WASTE',
                quantity: item.quantity,
                unit: 'portions',
                orderId,
                token: order.token,
                reason: `Re-fire requested at Expo: ${reason}`
              }
            ]);
          }
        }

        return {
          ...order,
          status: 'COOKING',
          tasks: updatedTasks,
          expoCheckedItemIds: order.expoCheckedItemIds.filter(id => id !== itemId)
        };
      })
    );
  };

  // Customer: "I'm leaving"
  const customerImLeaving = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          customerLocation: {
            distanceKm: o.customerLocation?.distanceKm || 1.5,
            travelTimeMinutes: o.customerLocation?.travelTimeMinutes || 8,
            hasDeparted: true,
            hasArrived: false
          }
        };
      })
    );

    // Re-evaluate scheduler to release backward-planned tasks
    setTimeout(() => {
      setOrders(current => {
        const schedule = runSmartQueueScheduler(current, menu, 0);
        return current.map(ord => ({
          ...ord,
          tasks: ord.tasks.map(t =>
            schedule.tasksToRelease.includes(t.id) && t.status === 'PLANNED'
              ? { ...t, status: 'RELEASED' }
              : t
          )
        }));
      });
    }, 50);
  };

  // Customer: "I'm here" (Weight promotes to 2, alerts KDS & Expo per Spec Section 12.1)
  const customerImHere = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          customerLocation: {
            distanceKm: 0,
            travelTimeMinutes: 0,
            hasDeparted: true,
            hasArrived: true
          },
          tasks: o.tasks.map(t => ({
            ...t,
            priority: 2, // promoted weight
            status: t.status === 'PLANNED' ? 'RELEASED' : t.status
          }))
        };
      })
    );
  };

  // Inventory Restock
  const restockIngredient = (id: string, qty: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const newOnHand = item.onHandQty + qty;
        return {
          ...item,
          onHandQty: newOnHand,
          status: newOnHand - item.reservedQty > item.reorderLevel ? 'OK' : 'Low'
        };
      })
    );

    const target = inventory.find(i => i.id === id);
    if (target) {
      setLedger(l => [
        ...l,
        {
          id: `ledg-restock-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ingredientId: target.id,
          ingredientName: target.name,
          type: 'RECEIPT',
          quantity: qty,
          unit: target.unit,
          reason: 'Manual manager restock'
        }
      ]);
    }
  };

  // Record Waste
  const recordWaste = (id: string, qty: number, reason: string) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const newOnHand = Math.max(0, item.onHandQty - qty);
        return {
          ...item,
          onHandQty: newOnHand,
          status: newOnHand - item.reservedQty <= item.reorderLevel ? 'Low' : 'OK'
        };
      })
    );

    const target = inventory.find(i => i.id === id);
    if (target) {
      setLedger(l => [
        ...l,
        {
          id: `ledg-waste-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ingredientId: target.id,
          ingredientName: target.name,
          type: 'WASTE',
          quantity: qty,
          unit: target.unit,
          reason
        }
      ]);
    }
  };

  // Spec Section 24: Worked Scenarios
  const runScenario = (scenarioNum: number) => {
    if (scenarioNum === 1) {
      // Scenario 1: Four customers at once (Combo pre-order 2km, Chinese pre-order 1km, Dine-in Table 4, Walk-in counter)
      const orderA: Order = {
        id: 'scen-A',
        token: 'P-001',
        channel: 'WEB',
        type: 'PRE_ORDER',
        status: 'SCHEDULED',
        version: 1,
        customerName: 'Customer A (2 km away)',
        pickupSlot: '13:14',
        items: [
          { id: 'iA1', menuItemId: 'burger-classic', name: 'Classic Burger', quantity: 2, unitPrice: 149, totalPrice: 298, station: 'grill' },
          { id: 'iA2', menuItemId: 'fries-masala', name: 'Masala Fries', quantity: 2, unitPrice: 99, totalPrice: 198, station: 'fryer' }
        ],
        subtotal: 496,
        tax: 0,
        total: 496,
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        eta: { p50Minutes: 12, p80Minutes: 14, p90Minutes: 16, displayRange: '12 - 14 min', promisedAt: '13:14', leaveAtTime: '13:02' },
        customerLocation: { distanceKm: 2.0, travelTimeMinutes: 10, hasDeparted: false, hasArrived: false },
        tasks: [
          { id: 'tA1', orderId: 'scen-A', token: 'P-001', orderItemId: 'iA1', itemName: 'Classic Burger', quantity: 2, station: 'grill', status: 'PLANNED', priority: 1, plannedStartMinutes: 7, plannedFinishMinutes: 11, holdLimitMinutes: 8, dependencies: [], orderType: 'PRE_ORDER', createdAt: '13:00', updatedAt: '13:00' },
          { id: 'tA2', orderId: 'scen-A', token: 'P-001', orderItemId: 'iA2', itemName: 'Masala Fries', quantity: 2, station: 'fryer', status: 'PLANNED', priority: 1, plannedStartMinutes: 6, plannedFinishMinutes: 11, holdLimitMinutes: 4, dependencies: [], orderType: 'PRE_ORDER', createdAt: '13:00', updatedAt: '13:00' }
        ],
        createdAt: '13:00',
        placedTime: '13:00',
        expoCheckedItemIds: []
      };

      const orderB: Order = {
        id: 'scen-B',
        token: 'P-002',
        channel: 'WA',
        type: 'PRE_ORDER',
        status: 'SCHEDULED',
        version: 1,
        customerName: 'Customer B (1 km away)',
        pickupSlot: '13:11',
        items: [
          { id: 'iB1', menuItemId: 'noodles-chowmein', name: 'Veg Chowmein', quantity: 1, unitPrice: 129, totalPrice: 129, station: 'wok' },
          { id: 'iB2', menuItemId: 'snack-chilli-potato', name: 'Chilli Potato', quantity: 1, unitPrice: 139, totalPrice: 139, station: 'wok' }
        ],
        subtotal: 268,
        tax: 0,
        total: 268,
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        eta: { p50Minutes: 9, p80Minutes: 11, p90Minutes: 13, displayRange: '9 - 11 min', promisedAt: '13:11', leaveAtTime: '13:04' },
        customerLocation: { distanceKm: 1.0, travelTimeMinutes: 6, hasDeparted: false, hasArrived: false },
        tasks: [
          { id: 'tB1', orderId: 'scen-B', token: 'P-002', orderItemId: 'iB1', itemName: 'Veg Chowmein', quantity: 1, station: 'wok', status: 'RELEASED', priority: 1, plannedStartMinutes: 2, plannedFinishMinutes: 9, holdLimitMinutes: 10, dependencies: [], orderType: 'PRE_ORDER', createdAt: '13:01', updatedAt: '13:01' },
          { id: 'tB2', orderId: 'scen-B', token: 'P-002', orderItemId: 'iB2', itemName: 'Chilli Potato (Batched)', quantity: 1, station: 'wok', status: 'RELEASED', priority: 1, plannedStartMinutes: 2, plannedFinishMinutes: 8, holdLimitMinutes: 10, dependencies: [], orderType: 'PRE_ORDER', createdAt: '13:01', updatedAt: '13:01' }
        ],
        createdAt: '13:01',
        placedTime: '13:01',
        expoCheckedItemIds: []
      };

      const orderC: Order = {
        id: 'scen-C',
        token: 'T-001',
        channel: 'QR',
        type: 'DINE_IN',
        tableNumber: 'Table 4',
        status: 'SCHEDULED',
        version: 1,
        customerName: 'Customer C (Table 4)',
        items: [
          { id: 'iC1', menuItemId: 'chai-cutting', name: 'Cutting Chai', quantity: 2, unitPrice: 49, totalPrice: 98, station: 'beverage' },
          { id: 'iC2', menuItemId: 'snack-chilli-potato', name: 'Chilli Potato', quantity: 1, unitPrice: 139, totalPrice: 139, station: 'wok' },
          { id: 'iC3', menuItemId: 'chaat-dahi-papdi', name: 'Dahi Papdi Chaat', quantity: 1, unitPrice: 119, totalPrice: 119, station: 'cold' }
        ],
        subtotal: 356,
        tax: 0,
        total: 356,
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        eta: { p50Minutes: 7, p80Minutes: 9, p90Minutes: 11, displayRange: '6 - 9 min', promisedAt: '13:09' },
        tasks: [
          { id: 'tC1', orderId: 'scen-C', token: 'T-001', orderItemId: 'iC1', itemName: 'Cutting Chai', quantity: 2, station: 'beverage', status: 'RELEASED', priority: 1, plannedStartMinutes: 4, plannedFinishMinutes: 8, holdLimitMinutes: 15, dependencies: [], orderType: 'DINE_IN', createdAt: '13:02', updatedAt: '13:02' },
          { id: 'tC2', orderId: 'scen-C', token: 'T-001', orderItemId: 'iC2', itemName: 'Chilli Potato (Batched)', quantity: 1, station: 'wok', status: 'RELEASED', priority: 1, plannedStartMinutes: 2, plannedFinishMinutes: 8, holdLimitMinutes: 10, dependencies: [], orderType: 'DINE_IN', createdAt: '13:02', updatedAt: '13:02' },
          { id: 'tC3', orderId: 'scen-C', token: 'T-001', orderItemId: 'iC3', itemName: 'Dahi Papdi Chaat', quantity: 1, station: 'cold', status: 'RELEASED', priority: 1, plannedStartMinutes: 5, plannedFinishMinutes: 8, holdLimitMinutes: 15, dependencies: [], orderType: 'DINE_IN', createdAt: '13:02', updatedAt: '13:02' }
        ],
        createdAt: '13:02',
        placedTime: '13:02',
        expoCheckedItemIds: []
      };

      const orderD: Order = {
        id: 'scen-D',
        token: 'W-001',
        channel: 'COUNTER',
        type: 'TAKEAWAY',
        status: 'SCHEDULED',
        version: 1,
        customerName: 'Customer D (Walk-in Counter)',
        items: [
          { id: 'iD1', menuItemId: 'burger-classic', name: 'Classic Burger', quantity: 1, unitPrice: 149, totalPrice: 149, station: 'grill' },
          { id: 'iD2', menuItemId: 'fries-masala', name: 'Masala Fries', quantity: 1, unitPrice: 99, totalPrice: 99, station: 'fryer' }
        ],
        subtotal: 248,
        tax: 0,
        total: 248,
        paymentMethod: 'CASH',
        paymentStatus: 'PAID',
        eta: { p50Minutes: 6, p80Minutes: 8, p90Minutes: 10, displayRange: '6 - 8 min', promisedAt: '13:09' },
        tasks: [
          { id: 'tD1', orderId: 'scen-D', token: 'W-001', orderItemId: 'iD1', itemName: 'Classic Burger', quantity: 1, station: 'grill', status: 'RELEASED', priority: 2, plannedStartMinutes: 3, plannedFinishMinutes: 7, holdLimitMinutes: 8, dependencies: [], orderType: 'TAKEAWAY', createdAt: '13:03', updatedAt: '13:03' },
          { id: 'tD2', orderId: 'scen-D', token: 'W-001', orderItemId: 'iD1', itemName: 'Masala Fries', quantity: 1, station: 'fryer', status: 'RELEASED', priority: 2, plannedStartMinutes: 3, plannedFinishMinutes: 8, holdLimitMinutes: 4, dependencies: [], orderType: 'TAKEAWAY', createdAt: '13:03', updatedAt: '13:03' }
        ],
        createdAt: '13:03',
        placedTime: '13:03',
        expoCheckedItemIds: []
      };

      setOrders([orderA, orderB, orderC, orderD, ...INITIAL_ORDERS]);
      setActiveCustomerOrderId('scen-A');
      setRole('kds');
    }
  };

  const resetAllData = () => {
    localStorage.removeItem('queuebite_orders');
    localStorage.removeItem('queuebite_inventory');
    localStorage.removeItem('queuebite_ledger');
    setOrders(INITIAL_ORDERS);
    setInventory(INITIAL_INVENTORY);
    setLedger(INITIAL_LEDGER);
    setActiveCustomerOrderId('ord-104');
    setCart([]);
  };

  return (
    <RestaurantContext.Provider
      value={{
        menu,
        orders,
        inventory,
        ledger,
        notifications,
        role,
        setRole,
        cart,
        orderType,
        setOrderType,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        tableNumber,
        setTableNumber,
        pickupSlot,
        setPickupSlot,
        activeCustomerOrderId,
        setActiveCustomerOrderId,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        placeOrder,
        activeStationFilter,
        setActiveStationFilter,
        startKitchenTask,
        completeKitchenTask,
        toggleExpoCheckItem,
        markOrderReadyExpo,
        undoExpoReady,
        handoverOrder,
        reFireTask,
        customerImLeaving,
        customerImHere,
        restockIngredient,
        recordWaste,
        runScenario,
        resetAllData
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
