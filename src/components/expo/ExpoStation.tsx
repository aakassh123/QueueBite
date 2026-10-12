import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  PackageCheck,
  CheckSquare,
  Square,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';

export const ExpoStation: React.FC = () => {
  const {
    orders,
    toggleExpoCheckItem,
    markOrderReadyExpo,
    undoExpoReady,
    handoverOrder,
    reFireTask
  } = useRestaurant();

  // Find orders currently in EXPO_CHECK or READY or COOKING
  const expoEligibleOrders = orders.filter(
    o => o.status === 'EXPO_CHECK' || o.status === 'READY' || (o.tasks.length > 0 && o.tasks.every(t => t.status === 'DONE'))
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    expoEligibleOrders[0]?.id || 'ord-104'
  );
  const [expoError, setExpoError] = useState<string | null>(null);
  const [reFireModalItem, setReFireModalItem] = useState<{ itemId: string; name: string } | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isMobileOrTablet = windowWidth < 960;

  const currentOrder = orders.find(o => o.id === selectedOrderId) || expoEligibleOrders[0] || orders[0];

  const allItemsChecked = currentOrder
    ? currentOrder.items.every(item => currentOrder.expoCheckedItemIds.includes(item.id))
    : false;

  const handleMarkReady = () => {
    setExpoError(null);
    if (!currentOrder) return;

    const res = markOrderReadyExpo(currentOrder.id);
    if (!res.success) {
      setExpoError(res.error || 'Check all items before packing');
    }
  };

  const handleReFire = (reason: string) => {
    if (!currentOrder || !reFireModalItem) return;
    reFireTask(currentOrder.id, reFireModalItem.itemId, reason);
    setReFireModalItem(null);
  };

  // Undo countdown calculation (20s grace period)
  const isUndoActive = Boolean(currentOrder?.expoReadyUndoDeadline && Date.now() < currentOrder.expoReadyUndoDeadline);
  const secondsRemaining = currentOrder?.expoReadyUndoDeadline
    ? Math.max(0, Math.ceil((currentOrder.expoReadyUndoDeadline - Date.now()) / 1000))
    : 0;

  return (
    <div style={{
      background: '#0B1120',
      minHeight: 'calc(100vh - 65px)',
      color: '#FFFFFF',
      padding: isMobile ? '12px' : '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? 12 : 16
    }}>
      {/* Top Header & Queue Switcher */}
      <div style={{
        background: '#0F172A',
        borderRadius: 14,
        padding: isMobile ? '12px' : '14px 20px',
        border: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <PackageCheck size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800 }}>EXPO & ORDER PACKING</h2>
            <div style={{ fontSize: 11, color: '#94A3B8' }} className="hide-on-mobile">
              Final itemized verification, packaging check & customer alert gate
            </div>
          </div>
        </div>

        {/* Order Selector Chips */}
        <div className="touch-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', alignItems: 'center', maxWidth: '100%' }}>
          <span style={{ fontSize: 12, color: '#64748B', whiteSpace: 'nowrap' }}>Orders:</span>
          {orders
            .filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED')
            .slice(0, 6)
            .map(ord => {
              const isSel = ord.id === currentOrder?.id;
              return (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className="touch-btn"
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: isSel ? 800 : 600,
                    background: isSel ? '#F97316' : '#1E293B',
                    color: '#FFFFFF',
                    border: `1px solid ${isSel ? '#EA580C' : '#334155'}`,
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  {ord.token} ({ord.status})
                </button>
              );
            })}
        </div>
      </div>

      {/* Main Expo Workspace (Matches Screenshot Row 2, Screen 3) */}
      {currentOrder ? (
        <div style={{
          flex: 1,
          background: '#0F172A',
          borderRadius: 16,
          border: '1px solid #1E293B',
          padding: isMobileOrTablet ? '16px' : '24px',
          display: 'grid',
          gridTemplateColumns: isMobileOrTablet ? '1fr' : '1.2fr 1fr',
          gap: isMobileOrTablet ? 16 : 24,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        }}>
          {/* Left: Token Header & Interactive Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Big Token Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 14,
              borderBottom: '1px solid #1E293B',
              flexWrap: 'wrap',
              gap: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  background: '#1E293B',
                  padding: '4px 14px',
                  borderRadius: 10,
                  border: '1px solid #334155'
                }}>
                  {currentOrder.token}
                </span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>
                    {currentOrder.customerName || 'Customer'}
                  </div>
                  <div style={{ fontSize: 13, color: '#94A3B8' }}>
                    {currentOrder.type} · {currentOrder.items.length} items · Placed at {currentOrder.placedTime}
                  </div>
                </div>
              </div>

              <span style={{
                background: currentOrder.status === 'READY' ? '#065F46' : '#0284C7',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: 20
              }}>
                {currentOrder.status === 'READY' ? 'Ready for Handover' : 'Ready to Pack'}
              </span>
            </div>

            {/* Error Message */}
            {expoError && (
              <div style={{
                background: '#451A1A',
                border: '1px solid #EF4444',
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: 13,
                color: '#FCA5A5',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <AlertTriangle size={16} />
                <span>{expoError}</span>
              </div>
            )}

            {/* 20-Second Undo Banner (Spec Section 10 & Scenario 12: Human tap Expo check!) */}
            {isUndoActive && (
              <div style={{
                background: '#1E3A8A',
                border: '1.5px solid #3B82F6',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Clock size={20} color="#60A5FA" />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>
                      Notification queued ({secondsRemaining}s undo window)
                    </div>
                    <div style={{ fontSize: 12, color: '#BFDBFE' }}>
                      Customer notification will be sent once the window passes.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => undoExpoReady(currentOrder.id)}
                  style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Undo Ready</span>
                </button>
              </div>
            )}

            {/* Itemized Verification Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Pack Checklist (Tap to check off)
              </div>

              {currentOrder.items.map(item => {
                const isChecked = currentOrder.expoCheckedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleExpoCheckItem(currentOrder.id, item.id)}
                    style={{
                      background: isChecked ? 'rgba(16, 185, 129, 0.1)' : '#1E293B',
                      border: `1.5px solid ${isChecked ? '#10B981' : '#334155'}`,
                      borderRadius: 12,
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {isChecked ? (
                        <CheckSquare size={22} color="#10B981" />
                      ) : (
                        <Square size={22} color="#64748B" />
                      )}
                      <div>
                        <div style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: isChecked ? '#A7F3D0' : '#FFFFFF',
                          textDecoration: isChecked ? 'line-through' : 'none'
                        }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 12, color: '#94A3B8' }}>
                          Station: {item.station} · Freshly prepared
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#F97316' }}>
                        ×{item.quantity}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReFireModalItem({ itemId: item.id, name: item.name });
                        }}
                        style={{
                          fontSize: 11,
                          background: '#334155',
                          color: '#F87171',
                          padding: '4px 8px',
                          borderRadius: 6,
                          fontWeight: 600
                        }}
                      >
                        Re-fire
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: 12, paddingTop: 16 }}>
              {currentOrder.status === 'READY' ? (
                <button
                  onClick={() => handoverOrder(currentOrder.id)}
                  style={{
                    flex: 1,
                    background: '#10B981',
                    color: '#FFFFFF',
                    padding: '16px',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <CheckCircle2 size={20} />
                  <span>Confirm Handover to Customer</span>
                </button>
              ) : (
                <button
                  onClick={handleMarkReady}
                  disabled={!allItemsChecked || isUndoActive}
                  style={{
                    flex: 1,
                    background: !allItemsChecked || isUndoActive
                      ? '#334155'
                      : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    padding: '16px',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: allItemsChecked && !isUndoActive ? 'pointer' : 'not-allowed',
                    boxShadow: allItemsChecked ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
                  }}
                >
                  <PackageCheck size={20} />
                  <span>Mark as Ready</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (currentOrder.items[0]) {
                    setReFireModalItem({
                      itemId: currentOrder.items[0].id,
                      name: currentOrder.items[0].name
                    });
                  }
                }}
                style={{
                  background: '#1E293B',
                  border: '1px solid #334155',
                  color: '#CBD5E1',
                  padding: '16px 20px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14
                }}
              >
                Send Back to Kitchen
              </button>
            </div>
          </div>

          {/* Right: Realistic Packaging Mockup & Label Verification */}
          <div style={{
            background: '#131D31',
            borderRadius: 14,
            border: '1px solid #1E293B',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginBottom: 12 }}>
                Packaging & Label Verification
              </div>

              {/* Visual Mockup Box */}
              <div style={{
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden',
                height: 240,
                border: '1px solid #334155',
                marginBottom: 16
              }}>
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
                  alt="Packed order"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Printed Sticker Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  background: '#FFFFFF',
                  color: '#0F172A',
                  padding: '8px 14px',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  border: '2px dashed #0F172A',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B' }}>TOKEN</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                    {currentOrder.token}
                  </div>
                  <div style={{ fontSize: 9, color: '#64748B', marginTop: 2 }}>
                    {currentOrder.items.length} Items · Vented Box
                  </div>
                </div>
              </div>

              {/* Hold Time Safety Warning (Spec Section 10) */}
              <div style={{
                background: '#1E293B',
                borderRadius: 10,
                padding: '12px 14px',
                border: '1px solid #334155',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#94A3B8' }}>Fries Hold Limit:</span>
                  <span style={{ color: '#F97316', fontWeight: 700 }}>4 min max</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#94A3B8' }}>Burger Warm Cabinet:</span>
                  <span style={{ color: '#10B981', fontWeight: 700 }}>8 min max</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#94A3B8' }}>Packaging Specification:</span>
                  <span style={{ color: '#CBD5E1', fontWeight: 600 }}>Vented Steam-Release Bag</span>
                </div>
              </div>
            </div>

            {/* Quick Print Token Label */}
            <button
              onClick={() => alert(`Printing Label for Token ${currentOrder.token}...`)}
              style={{
                background: '#1E293B',
                color: '#CBD5E1',
                padding: '12px',
                borderRadius: 10,
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 600
              }}
            >
              <Printer size={16} />
              <span>Print Bag Label ({currentOrder.token})</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#64748B' }}>
          No orders waiting at Expo.
        </div>
      )}

      {/* Re-fire Modal */}
      {reFireModalItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            background: '#1E293B',
            borderRadius: 16,
            padding: '24px',
            maxWidth: 420,
            width: '90%',
            border: '1px solid #334155',
            color: '#FFFFFF'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: '#F87171' }}>
              Re-fire Task: {reFireModalItem.name}
            </h3>
            <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>
              Select failure reason. This will immediately re-release the task to the cook and record food waste in the ledger:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {['Burnt / Overcooked', 'Dropped / Contaminated', 'Cold / Exceeded Hold Limit', 'Incorrect variant'].map(r => (
                <button
                  key={r}
                  onClick={() => handleReFire(r)}
                  style={{
                    background: '#0F172A',
                    border: '1px solid #334155',
                    color: '#F1F5F9',
                    padding: '10px 14px',
                    borderRadius: 8,
                    textAlign: 'left',
                    fontSize: 13,
                    fontWeight: 600
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <button
              onClick={() => setReFireModalItem(null)}
              style={{
                width: '100%',
                background: '#334155',
                color: '#CBD5E1',
                padding: '10px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 13
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
