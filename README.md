# 🍔 QueueBite v4.0 — High-Velocity QSR Kitchen Display & Smart Queue Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> **QueueBite** is a production-grade, human-engineered restaurant operating system designed specifically for high-velocity Quick Service Restaurants (QSRs) serving dry food items (Burgers, Fries, Chowmein, Chai, Rolls). It eliminates the classic flaws of traditional FIFO queuing through backward planning, safe batching, atomic BOM inventory reservations, and an interactive 5-column Kitchen Display System (KDS).

---

## 🌟 Key Modules

### 1. 🍳 Kitchen Display System (KDS)
- **5-Column Pipeline Layout**: Light-themed, pastel-colored columns engineered to minimize kitchen eye strain:
  - 🟢 **NOW** (Mint green): Orders ready to begin cooking immediately.
  - 🔵 **COOKING** (Soft blue): Active preparation items with live elapsed timers.
  - 🟣 **UPCOMING** (Lavender): Next orders in queue backward-planned for arrival.
  - 🟠 **BLOCKED** (Peach): Held tasks with explicit ingredient or station blockers (e.g., *No Buns*).
  - 🔴 **AT RISK** (Soft red): Delayed orders flagging SLA breach thresholds (e.g., *25 min 🔺*).
- **Order Token Cards**: Clean white cards displaying Token ID (`A101`), Table number (`Table 1` to `Table 9`), itemized bill of materials, and direct touch buttons (`► Start Cooking`, `✔ Mark Done`).
- **Footer KPI Bar**: Real-time kitchen throughput tracking (Total orders, Cooking count, Upcoming count, Blocked, At-risk, Avg. prep time, On-time rate).
- **Device-Friendly**: Responsive on mobile phones (quick column pill filters), tablets/iPads (smooth momentum swiping), and desktop kitchen monitors.

### 2. 🧠 Smart Queue Scheduling Engine (Pure Function)
- **Backward Planning**: Automatically delays pre-orders so fried and toasted items are completed right as the customer arrives—preventing soggy, cold food.
- **Safe Batching**: Automatically identifies identical fryer tasks (e.g., Fries, Chilli Potato) and batches up to 2 portions per fryer basket without exceeding hold limits.
- **Forward-Only State Machine**: Order tasks transition strictly: `PLANNED` ➔ `QUEUED` ➔ `IN_PROGRESS` ➔ `DONE` ➔ `EXPO_CHECK` ➔ `READY` ➔ `COMPLETED`.

### 3. ⏱️ Realistic Multi-Factor ETA Engine
- **Honest Range Delivery**: Never quotes unrealistic flat estimates. Calculates honest ranges (P50, P80, P90) based on active station queue depths, fryer basket contention, and preparation times.
- **Location-Aware Lead Times**: Adjusts pickup schedules based on customer travel time and departure alerts (`I'm leaving`, `I'm here`).

### 4. 📦 Atomic Inventory & BOM Stock Ledger
- **PostgreSQL-Style Atomic Reservation**: Deducts and locks ingredients from the recipe Bill of Materials (BOM) at the moment of order placement.
- **Race Condition Prevention**: Prevents overselling when stock runs low (e.g., the last 3 burger buns requested by two simultaneous orders).
- **Audit Ledger**: Complete audit trail recording every `RESERVE`, `CONSUME`, `RESTOCK`, and `WASTE` transaction with timestamp, token, and reason.

### 5. 🏪 Counter POS Terminal
- **Multi-Mode Support**: Counter cashiers can quickly switch between **Dine-In** (with Table assignment), **Takeaway**, and **Pre-order**.
- **Instant Payment Gateway**: Supports **Cash Paid** and **Counter UPI** with single-tap token generation.
- **Mobile POS Mode**: On mobile and tablet screens, provides a clean tab switch between the menu catalog and the order cart, complete with a floating sticky checkout pill.

### 6. 📱 Customer Self-Ordering & Kiosk App
- **6 Fluid Views**:
  1. *Landing Page* (Clean brand hero & order mode selector).
  2. *Menu Catalog* (Category filters, search, allergen badges).
  3. *Order Cart* (Item quantity controls, order type selection, honest ETA estimate).
  4. *Pickup Slot Picker* (Time windows for pre-order pickup).
  5. *Simulated Fast Checkout* (Instant UPI QR, Card, Net Banking).
  6. *Live Order Tracking* (Token tracking, real-time status steps, and arrival notifications).
- **Tablet Kiosk Toggle**: Toggle between standard phone preview (440px) and full-width tablet self-ordering kiosk mode.

### 7. 🎁 Expo & Packing Station
- **Itemized Verification Checklist**: Packers must verify every item before bagging to ensure zero missing items.
- **20-Second Undo Grace Window**: Staff can undo an accidental "Mark as Ready" tap within 20 seconds before customer notifications are dispatched.
- **Packaging Specifications**: Displays venting instructions (steam-release bags vs. warm cabinet hold limits) and bag label printing.

### 8. 📊 Owner Dashboard & Analytics
- **Single-Outlet Performance**: Total orders, gross revenue, average prep time (14 min), and on-time rate (96%).
- **Peak Hour Visualizer**: Hourly volume tracking peak lunch (1:00 PM) and dinner surges (8:00 PM).
- **Top velocity dry-food preparations**: Classic Burger, Masala Fries, Veg Chowmein, Desi Chai.

### 9. 🧪 Interactive Specification Simulator (Section 24)
Includes a built-in test runner for the 4 core scenarios from the specification:
- **Scenario 1**: Four Customers at Once (FIFO failure vs. Smart Queue backward planning).
- **Scenario 3**: Fryer Bottleneck (6 orders in 1 min with 2-portion batching).
- **Scenario 4**: Stock Shortage Race Condition (Last 3 buns atomic guard).
- **Scenario 12**: Accidental Expo Ready tap with 20s undo recovery.

---

## 💻 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Tailored HSL design system, zero generic neon/AI tropes)
- **State Management**: Reactive React Context with LocalStorage persistence

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- `npm` or `yarn`

### Installation

```bash
# Clone the repository
git clone https://github.com/aakassh123/QueueBite.git

# Navigate to project folder
cd QueueBite

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Verification Tests

QueueBite includes an automated verification test suite checking scheduler backward planning, safe batching, atomic reservations, and ETA calculations:

```bash
npx tsx scripts/verify-queuebite.ts
```

Output:
```text
========================================================
🧪 QUEUEBITE v4.0 SENIOR ENGINEERING VERIFICATION TEST
========================================================

✅ [PASS] Menu contains 8 items (expected >= 8)
✅ [PASS] Classic Burger BOM has ingredients defined
✅ [PASS] Classic Burger BOM has packaging defined (Spec §9)
✅ [PASS] Atomic inventory reservation succeeds for available stock
✅ [PASS] Recorded 6 audit ledger entries for reservation
✅ [PASS] Atomic reservation correctly rejected order when buns < requested qty
✅ [PASS] Identified exact shortage item: Burger Buns
✅ [PASS] Generated 1 task(s) for burger item
✅ [PASS] Task correctly assigned to station: grill
✅ [PASS] Initial task state is PLANNED
✅ [PASS] ETA is a realistic range: 5 - 7 min (never a single flat number)
✅ [PASS] P80 (7m) is strictly greater than P50 (5.5m)
✅ [PASS] Present takeaway customer (tD) is released immediately
✅ [PASS] Pre-order customer (tA) is held for backward planning (fries stay hot!)

========================================================
🎉 TEST SUMMARY: 14/14 TESTS PASSED SUCCESSFULLY!
========================================================
```

### Production Build

```bash
npm run build
```

---

## 📱 Device Compatibility

QueueBite is fully responsive and touch-optimized:
| Device Type | Viewport | Optimized Layout |
| :--- | :--- | :--- |
| **Mobile Phones** | `< 768px` | Quick pill column filters, fluid edge-to-edge screens, sticky bottom cart banners |
| **iPads & Tablets** | `768px - 1120px` | 250px momentum-scrolling KDS columns, collapsed 64px icon sidebar, 2-column POS |
| **Kitchen Displays / Desktop** | `> 1120px` | Full 5-column pastel KDS, 190px sidebar, expanded analytics charts |

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
