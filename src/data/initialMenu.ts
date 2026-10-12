import { MenuItem } from '../types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 'burger-classic',
    name: 'Classic Burger',
    category: 'Burgers',
    description: 'Juicy crispy patty, fresh crisp veggies & signature house sauce',
    price: 149,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    station: 'grill',
    cookTimeMinutes: 4,
    holdLimitMinutes: 8,
    batchCapacity: 4,
    ingredients: [
      { ingredientId: 'ing-burger-bun', quantity: 1, unit: 'pcs' },
      { ingredientId: 'ing-burger-patty', quantity: 1, unit: 'pcs' },
      { ingredientId: 'ing-sauce', quantity: 20, unit: 'g' },
      { ingredientId: 'ing-onions', quantity: 15, unit: 'g' },
      { ingredientId: 'ing-tomatoes', quantity: 20, unit: 'g' }
    ],
    packaging: [
      { ingredientId: 'pkg-burger-box', quantity: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'burger-cheese',
    name: 'Cheese Burger',
    category: 'Burgers',
    description: 'Crispy patty smothered in rich melted cheddar slice & sauce',
    price: 169,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    station: 'grill',
    cookTimeMinutes: 4,
    holdLimitMinutes: 8,
    batchCapacity: 4,
    ingredients: [
      { ingredientId: 'ing-burger-bun', quantity: 1, unit: 'pcs' },
      { ingredientId: 'ing-burger-patty', quantity: 1, unit: 'pcs' },
      { ingredientId: 'ing-cheese-slice', quantity: 1, unit: 'pcs' },
      { ingredientId: 'ing-sauce', quantity: 25, unit: 'g' }
    ],
    packaging: [
      { ingredientId: 'pkg-burger-box', quantity: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'fries-masala',
    name: 'Masala Fries',
    category: 'Fries',
    description: 'Golden crispy crinkle fries dusted with fiery chatpata spice',
    price: 99,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    station: 'fryer',
    cookTimeMinutes: 5,
    holdLimitMinutes: 4, // Shortest hold limit in dry food!
    batchCapacity: 2,
    ingredients: [
      { ingredientId: 'ing-fries-potato', quantity: 150, unit: 'g' },
      { ingredientId: 'ing-cooking-oil', quantity: 10, unit: 'ml' },
      { ingredientId: 'ing-peri-masala', quantity: 5, unit: 'g' }
    ],
    packaging: [
      { ingredientId: 'pkg-fries-carton', quantity: 1, unit: 'pcs' },
      { ingredientId: 'pkg-vented-bag', quantity: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'noodles-chowmein',
    name: 'Veg Chowmein',
    category: 'Noodles',
    description: 'Wok-tossed noodles with shredded cabbage, bell pepper & dark soy',
    price: 129,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    station: 'wok',
    cookTimeMinutes: 7,
    holdLimitMinutes: 10,
    batchCapacity: 2,
    ingredients: [
      { ingredientId: 'ing-noodles', quantity: 150, unit: 'g' },
      { ingredientId: 'ing-capsicum', quantity: 30, unit: 'g' },
      { ingredientId: 'ing-onions', quantity: 25, unit: 'g' },
      { ingredientId: 'ing-sauce', quantity: 25, unit: 'g' },
      { ingredientId: 'ing-cooking-oil', quantity: 15, unit: 'ml' }
    ],
    packaging: [
      { ingredientId: 'pkg-meal-container', quantity: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'snack-chilli-potato',
    name: 'Chilli Potato',
    category: 'Fries',
    description: 'Crispy fried potato fingers coated in spicy garlicky wok reduction',
    price: 139,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
    station: 'wok',
    cookTimeMinutes: 6,
    holdLimitMinutes: 10,
    batchCapacity: 2,
    ingredients: [
      { ingredientId: 'ing-fries-potato', quantity: 150, unit: 'g' },
      { ingredientId: 'ing-capsicum', quantity: 30, unit: 'g' },
      { ingredientId: 'ing-sauce', quantity: 25, unit: 'g' },
      { ingredientId: 'ing-cooking-oil', quantity: 10, unit: 'ml' }
    ],
    packaging: [
      { ingredientId: 'pkg-meal-container', quantity: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'chai-cutting',
    name: 'Cutting Chai',
    category: 'Chai',
    description: 'Hot, kadak adrak-elaichi brewed Indian street tea',
    price: 49,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    station: 'beverage',
    cookTimeMinutes: 4,
    holdLimitMinutes: 15,
    batchCapacity: 4,
    ingredients: [
      { ingredientId: 'ing-milk', quantity: 80, unit: 'ml' },
      { ingredientId: 'ing-chai-leaves', quantity: 3, unit: 'g' },
      { ingredientId: 'ing-sugar', quantity: 8, unit: 'g' }
    ],
    packaging: [
      { ingredientId: 'pkg-tea-cup', quantity: 1, unit: 'pcs' },
      { ingredientId: 'pkg-cup-lid', quantity: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'drink-cold-coffee',
    name: 'Cold Coffee',
    category: 'Drinks',
    description: 'Thick, creamy chilled espresso blend with rich chocolate drizzle',
    price: 89,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    station: 'beverage',
    cookTimeMinutes: 3,
    holdLimitMinutes: 20,
    batchCapacity: 2,
    ingredients: [
      { ingredientId: 'ing-milk', quantity: 160, unit: 'ml' },
      { ingredientId: 'ing-sugar', quantity: 15, unit: 'g' }
    ],
    packaging: [
      { ingredientId: 'pkg-drink-glass', quantity: 1, unit: 'pcs' },
      { ingredientId: 'pkg-cup-lid', quantity: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'chaat-dahi-papdi',
    name: 'Dahi Papdi Chaat',
    category: 'Chaat',
    description: 'Crisp flour crackers with potato, chilled sweet curd & tamarind chutneys',
    price: 119,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    station: 'cold',
    cookTimeMinutes: 3,
    holdLimitMinutes: 15,
    batchCapacity: 2,
    ingredients: [
      { ingredientId: 'ing-papdi', quantity: 6, unit: 'pcs' },
      { ingredientId: 'ing-curd', quantity: 100, unit: 'g' },
      { ingredientId: 'ing-chutney', quantity: 30, unit: 'g' }
    ],
    packaging: [
      { ingredientId: 'pkg-meal-container', quantity: 1, unit: 'pcs' }
    ]
  }
];
