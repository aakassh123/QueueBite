import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/layout/Navbar';
import { CustomerView } from './components/customer/CustomerView';
import { PosTerminal } from './components/pos/PosTerminal';
import { KitchenDisplay } from './components/kds/KitchenDisplay';
import { ExpoStation } from './components/expo/ExpoStation';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import { InventoryView } from './components/inventory/InventoryView';
import { ReportsView } from './components/reports/ReportsView';
import { ScenarioModal } from './components/simulator/ScenarioModal';

const AppContent: React.FC = () => {
  const { role } = useRestaurant();
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: role === 'expo' ? '#0B1120' : '#F8FAFC' }}>
      {/* Top Navbar */}
      <Navbar onOpenScenarioModal={() => setIsScenarioModalOpen(true)} />

      {/* Main Role Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {role === 'customer' && <CustomerView />}
        {role === 'pos' && <PosTerminal />}
        {role === 'kds' && <KitchenDisplay onOpenScenarioModal={() => setIsScenarioModalOpen(true)} />}
        {role === 'expo' && <ExpoStation />}
        {role === 'dashboard' && <OwnerDashboard />}
        {role === 'inventory' && <InventoryView />}
        {role === 'reports' && <ReportsView />}
      </main>

      {/* Spec Section 24 Scenarios Simulator Modal */}
      <ScenarioModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}

export default App;
