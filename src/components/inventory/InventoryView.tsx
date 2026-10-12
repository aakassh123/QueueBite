import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Boxes,
  AlertTriangle,
  Plus,
  Search,
  Package,
  Layers,
  CheckCircle,
  Clock,
  ArrowUpRight,
  History
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, ledger, restockIngredient, recordWaste } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'All' | 'Low' | 'Packaging' | 'Ledger'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [restockModalItem, setRestockModalItem] = useState<{ id: string; name: string; unit: string } | null>(null);
  const [restockQty, setRestockQty] = useState(10);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'Low') return matchesSearch && (item.status === 'Low' || item.status === 'Finished');
    if (activeTab === 'Packaging') return matchesSearch && item.category === 'Packaging';
    return matchesSearch;
  });

  const handleConfirmRestock = () => {
    if (!restockModalItem) return;
    restockIngredient(restockModalItem.id, restockQty);
    setRestockModalItem(null);
  };

  return (
    <div style={{
      maxWidth: 1400,
      margin: '0 auto',
      padding: isMobile ? '12px' : '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? 14 : 20
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Inventory Management</h1>
          <p style={{ fontSize: 13, color: '#64748B' }}>
            Recipe BOM stock ledger with atomic reservation and real-time consumption
          </p>
        </div>

        <button
          onClick={() => {
            const firstLow = inventory.find(i => i.status === 'Low') || inventory[0];
            setRestockModalItem({ id: firstLow.id, name: firstLow.name, unit: firstLow.unit });
          }}
          style={{
            background: '#F97316',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 6px rgba(249, 115, 22, 0.3)'
          }}
        >
          <Plus size={16} />
          <span>+ Add / Restock Ingredient</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{
          display: 'flex',
          background: '#FFFFFF',
          padding: 4,
          borderRadius: 10,
          border: '1px solid #E2E8F0',
          gap: 4
        }}>
          {[
            { id: 'All', label: 'All Ingredients' },
            { id: 'Low', label: 'Low Stock' },
            { id: 'Packaging', label: 'Packaging' },
            { id: 'Ledger', label: 'Audit Ledger' }
          ].map(tab => {
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isSel ? 700 : 500,
                  background: isSel ? '#F97316' : 'transparent',
                  color: isSel ? '#FFFFFF' : '#475569'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab !== 'Ledger' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            padding: '8px 14px',
            minWidth: 260
          }}>
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search ingredient..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'Ledger' ? (
        /* Audit Ledger View */
        <div style={{
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>Real-Time Stock Ledger</h3>
            <span style={{ fontSize: 12, color: '#64748B' }}>Audit trail of atomic reservations & consumption</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Time</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Item</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Action</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Quantity</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Order Ref</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {ledger.slice().reverse().map(entry => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 18px', color: '#64748B', fontFamily: 'monospace' }}>{entry.timestamp}</td>
                    <td style={{ padding: '12px 18px', fontWeight: 700, color: '#0F172A' }}>{entry.ingredientName}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        background:
                          entry.type === 'CONSUME' ? '#EFF6FF' :
                          entry.type === 'RESERVE' ? '#FEF3C7' :
                          entry.type === 'WASTE' ? '#FEE2E2' : '#ECFDF5',
                        color:
                          entry.type === 'CONSUME' ? '#1D4ED8' :
                          entry.type === 'RESERVE' ? '#B45309' :
                          entry.type === 'WASTE' ? '#B91C1C' : '#047857'
                      }}>
                        {entry.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 700 }}>{entry.quantity} {entry.unit}</td>
                    <td style={{ padding: '12px 18px', color: '#F97316', fontWeight: 700 }}>{entry.token || '-'}</td>
                    <td style={{ padding: '12px 18px', color: '#64748B' }}>{entry.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Table View Matching Screenshot Row 3, Screen 2 */
        <div style={{
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div className="touch-scroll" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14, minWidth: 640 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Ingredient / Item</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Current Stock (On Hand)</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Reserved</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Available</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Unit</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Reorder Level</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const available = item.onHandQty - item.reservedQty;
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{item.category}</div>
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 800, color: '#0F172A' }}>
                      {item.onHandQty}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#F97316', fontWeight: 700 }}>
                      {item.reservedQty}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 800, color: available <= 0 ? '#EF4444' : '#10B981' }}>
                      {available}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748B' }}>
                      {item.unit}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        background:
                          item.status === 'OK' ? '#ECFDF5' :
                          item.status === 'Low' ? '#FFFBEB' : '#FEF2F2',
                        color:
                          item.status === 'OK' ? '#10B981' :
                          item.status === 'Low' ? '#F59E0B' : '#EF4444',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <span style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: item.status === 'OK' ? '#10B981' : item.status === 'Low' ? '#F59E0B' : '#EF4444'
                        }} />
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748B' }}>
                      {item.reorderLevel}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => setRestockModalItem({ id: item.id, name: item.name, unit: item.unit })}
                        style={{
                          background: '#F1F5F9',
                          color: '#0F172A',
                          padding: '6px 12px',
                          borderRadius: 6,
                          fontWeight: 700,
                          fontSize: 12,
                          border: '1px solid #CBD5E1'
                        }}
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockModalItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '24px',
            maxWidth: 380,
            width: '90%',
            boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: '#0F172A' }}>
              Restock {restockModalItem.name}
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>
              Enter incoming batch quantity ({restockModalItem.unit}):
            </p>

            <div style={{ marginBottom: 20 }}>
              <input
                type="number"
                value={restockQty}
                onChange={e => setRestockQty(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  fontSize: 16,
                  fontWeight: 700
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                onClick={() => setRestockModalItem(null)}
                style={{
                  padding: '10px',
                  borderRadius: 8,
                  background: '#F1F5F9',
                  color: '#475569',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestock}
                style={{
                  padding: '10px',
                  borderRadius: 8,
                  background: '#10B981',
                  color: '#FFFFFF',
                  fontWeight: 700
                }}
              >
                Confirm (+{restockQty})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
