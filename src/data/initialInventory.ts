import { InventoryItem, StockLedgerEntry } from '../types';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'ing-burger-bun',
    name: 'Burger Buns',
    category: 'Ingredient',
    onHandQty: 40,
    reservedQty: 0,
    unit: 'pcs',
    reorderLevel: 15,
    status: 'OK',
    costPerUnit: 8
  },
  {
    id: 'ing-burger-patty',
    name: 'Burger Patties',
    category: 'Ingredient',
    onHandQty: 18,
    reservedQty: 0,
    unit: 'pcs',
    reorderLevel: 12,
    status: 'Low',
    costPerUnit: 25
  },
  {
    id: 'ing-cheese-slice',
    name: 'Cheese Slices',
    category: 'Ingredient',
    onHandQty: 45,
    reservedQty: 0,
    unit: 'pcs',
    reorderLevel: 15,
    status: 'OK',
    costPerUnit: 12
  },
  {
    id: 'ing-fries-potato',
    name: 'Fries (Frozen Cut)',
    category: 'Ingredient',
    onHandQty: 12000, // in grams (12 kg)
    reservedQty: 0,
    unit: 'g',
    reorderLevel: 4000,
    status: 'OK',
    costPerUnit: 0.1
  },
  {
    id: 'ing-cooking-oil',
    name: 'Cooking Oil',
    category: 'Ingredient',
    onHandQty: 15000, // in ml (15 L)
    reservedQty: 0,
    unit: 'ml',
    reorderLevel: 5000,
    status: 'OK',
    costPerUnit: 0.15
  },
  {
    id: 'ing-noodles',
    name: 'Noodles (Pre-boiled)',
    category: 'Ingredient',
    onHandQty: 4500, // in grams
    reservedQty: 0,
    unit: 'g',
    reorderLevel: 2000,
    status: 'OK',
    costPerUnit: 0.08
  },
  {
    id: 'ing-capsicum',
    name: 'Capsicum & Veggies',
    category: 'Ingredient',
    onHandQty: 2500,
    reservedQty: 0,
    unit: 'g',
    reorderLevel: 1000,
    status: 'OK',
    costPerUnit: 0.06
  },
  {
    id: 'ing-onions',
    name: 'Fresh Onions',
    category: 'Ingredient',
    onHandQty: 4000,
    reservedQty: 0,
    unit: 'g',
    reorderLevel: 1500,
    status: 'Low',
    costPerUnit: 0.04
  },
  {
    id: 'ing-tomatoes',
    name: 'Fresh Tomatoes',
    category: 'Ingredient',
    onHandQty: 6000,
    reservedQty: 0,
    unit: 'g',
    reorderLevel: 2000,
    status: 'OK',
    costPerUnit: 0.05
  },
  {
    id: 'ing-milk',
    name: 'Fresh Milk',
    category: 'Ingredient',
    onHandQty: 8000, // ml
    reservedQty: 0,
    unit: 'ml',
    reorderLevel: 3000,
    status: 'OK',
    costPerUnit: 0.06
  },
  {
    id: 'ing-chai-leaves',
    name: 'Chai Tea Leaves',
    category: 'Ingredient',
    onHandQty: 850,
    reservedQty: 0,
    unit: 'g',
    reorderLevel: 200,
    status: 'OK',
    costPerUnit: 0.4
  },
  {
    id: 'ing-sugar',
    name: 'Refined Sugar',
    category: 'Ingredient',
    onHandQty: 3000,
    reservedQty: 0,
    unit: 'g',
    reorderLevel: 1000,
    status: 'OK',
    costPerUnit: 0.05
  },
  {
    id: 'ing-sauce',
    name: 'Special Sauces',
    category: 'Ingredient',
    onHandQty: 2400,
    reservedQty: 0,
    unit: 'g',
    reorderLevel: 800,
    status: 'OK',
    costPerUnit: 0.12
  },
  {
    id: 'ing-peri-masala',
    name: 'Peri Peri Masala',
    category: 'Ingredient',
    onHandQty: 500,
    reservedQty: 0,
    unit: 'g',
    reorderLevel: 100,
    status: 'OK',
    costPerUnit: 0.3
  },
  {
    id: 'ing-papdi',
    name: 'Crisp Papdi',
    category: 'Ingredient',
    onHandQty: 120,
    reservedQty: 0,
    unit: 'pcs',
    reorderLevel: 40,
    status: 'OK',
    costPerUnit: 1.5
  },
  {
    id: 'ing-curd',
    name: 'Sweet Chilled Dahi',
    category: 'Ingredient',
    onHandQty: 2000,
    reservedQty: 0,
    unit: 'g',
    reorderLevel: 800,
    status: 'OK',
    costPerUnit: 0.08
  },
  {
    id: 'ing-chutney',
    name: 'Mint & Tamarind Chutney',
    category: 'Ingredient',
    onHandQty: 1500,
    reservedQty: 0,
    unit: 'g',
    reorderLevel: 500,
    status: 'OK',
    costPerUnit: 0.1
  },
  // Packaging items (Spec Section 9: Packaging counted as ingredient!)
  {
    id: 'pkg-burger-box',
    name: 'Vented Burger Box',
    category: 'Packaging',
    onHandQty: 85,
    reservedQty: 0,
    unit: 'pcs',
    reorderLevel: 25,
    status: 'OK',
    costPerUnit: 4
  },
  {
    id: 'pkg-fries-carton',
    name: 'Crinkle Fries Carton',
    category: 'Packaging',
    onHandQty: 90,
    reservedQty: 0,
    unit: 'pcs',
    reorderLevel: 30,
    status: 'OK',
    costPerUnit: 3
  },
  {
    id: 'pkg-vented-bag',
    name: 'Vented Steam-Release Bag',
    category: 'Packaging',
    onHandQty: 110,
    reservedQty: 0,
    unit: 'pcs',
    reorderLevel: 40,
    status: 'OK',
    costPerUnit: 2
  },
  {
    id: 'pkg-meal-container',
    name: 'Microwave Safe Food Box',
    category: 'Packaging',
    onHandQty: 65,
    reservedQty: 0,
    unit: 'pcs',
    reorderLevel: 20,
    status: 'OK',
    costPerUnit: 5
  },
  {
    id: 'pkg-tea-cup',
    name: 'Insulated Paper Tea Cups',
    category: 'Packaging',
    onHandQty: 140,
    reservedQty: 0,
    unit: 'pcs',
    reorderLevel: 50,
    status: 'OK',
    costPerUnit: 2.5
  },
  {
    id: 'pkg-cup-lid',
    name: 'Sip-Through Cup Lids',
    category: 'Packaging',
    onHandQty: 135,
    reservedQty: 0,
    unit: 'pcs',
    reorderLevel: 50,
    status: 'OK',
    costPerUnit: 1.2
  },
  {
    id: 'pkg-drink-glass',
    name: 'Clear Cold Drink Tumbler',
    category: 'Packaging',
    onHandQty: 80,
    reservedQty: 0,
    unit: 'pcs',
    reorderLevel: 30,
    status: 'OK',
    costPerUnit: 4.5
  }
];

export const INITIAL_LEDGER: StockLedgerEntry[] = [
  {
    id: 'ledg-001',
    timestamp: '10:00 AM',
    ingredientId: 'ing-burger-bun',
    ingredientName: 'Burger Buns',
    type: 'RECEIPT',
    quantity: 50,
    unit: 'pcs',
    reason: 'Morning bakery delivery'
  },
  {
    id: 'ledg-002',
    timestamp: '10:05 AM',
    ingredientId: 'ing-milk',
    ingredientName: 'Fresh Milk',
    type: 'RECEIPT',
    quantity: 10000,
    unit: 'ml',
    reason: 'Dairy delivery'
  }
];
