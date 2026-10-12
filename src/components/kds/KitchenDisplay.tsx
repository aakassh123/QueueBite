import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Clock,
  AlertTriangle,
  Play,
  Check,
  Calendar,
  Settings,
  Printer,
  Monitor,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Maximize2,
  MoreVertical,
  RotateCcw,
  FlaskConical,
  ChefHat,
  CookingPot,
  TrendingUp,
  TrendingDown,
  Armchair
} from 'lucide-react';

interface KitchenDisplayProps {
  onOpenScenarioModal?: () => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ onOpenScenarioModal }) => {
  const {
    orders,
    startKitchenTask,
    completeKitchenTask,
    resetAllData
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSidebarTab, setActiveSidebarTab] = useState('live');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [timeDigital, setTimeDigital] = useState('05:57:13 PM');
  const [activeMobileColumn, setActiveMobileColumn] = useState<string>('all');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeDigital(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1120;

  // Helper to start order
  const handleStartOrder = (orderId: string) => {
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      ord.tasks.forEach(t => startKitchenTask(t.id));
    }
  };

  // Helper to mark done
  const handleDoneOrder = (orderId: string) => {
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      ord.tasks.forEach(t => completeKitchenTask(t.id));
    }
  };

  return (
    <div style={{
      display: 'flex',
      flex: 1,
      background: '#F8FAFC',
      color: '#0F172A',
      minHeight: 'calc(100vh - 58px)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 1. LEFT SIDEBAR (Responsive: Hidden on mobile, compact on tablet, full on desktop) */}
      {!isMobile && (
        <aside style={{
          width: isTablet ? 64 : 190,
          background: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isTablet ? '16px 8px' : '16px 10px',
          flexShrink: 0,
          transition: 'width 0.2s ease'
        }}>
          {/* Nav Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Live Orders (Selected) */}
            <button
              onClick={() => setActiveSidebarTab('live')}
              title="Live Orders"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isTablet ? 'center' : 'space-between',
                padding: isTablet ? '10px 0' : '9px 12px',
                borderRadius: 8,
                background: activeSidebarTab === 'live' ? '#EFF6FF' : 'transparent',
                color: activeSidebarTab === 'live' ? '#2563EB' : '#475569',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeSidebarTab === 'live' ? 700 : 500,
                fontSize: 13,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ChefHat size={18} color={activeSidebarTab === 'live' ? '#2563EB' : '#64748B'} />
                {!isTablet && <span>Live Orders</span>}
              </div>
              {!isTablet ? (
                <span style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: 11,
                  fontWeight: 800,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  9
                </span>
              ) : (
                <span style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: 800,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  9
                </span>
              )}
            </button>

            {/* Today Orders */}
            <button
              onClick={() => setActiveSidebarTab('today')}
              title="Today Orders"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isTablet ? 'center' : 'flex-start',
                gap: 8,
                padding: isTablet ? '10px 0' : '9px 12px',
                borderRadius: 8,
                background: activeSidebarTab === 'today' ? '#EFF6FF' : 'transparent',
                color: activeSidebarTab === 'today' ? '#2563EB' : '#475569',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeSidebarTab === 'today' ? 700 : 500,
                fontSize: 13
              }}
            >
              <Calendar size={18} color="#64748B" />
              {!isTablet && <span>Today Orders</span>}
            </button>

            {/* Kitchen Settings */}
            <button
              onClick={() => setActiveSidebarTab('settings')}
              title="Kitchen Settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isTablet ? 'center' : 'flex-start',
                gap: 8,
                padding: isTablet ? '10px 0' : '9px 12px',
                borderRadius: 8,
                background: activeSidebarTab === 'settings' ? '#EFF6FF' : 'transparent',
                color: activeSidebarTab === 'settings' ? '#2563EB' : '#475569',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeSidebarTab === 'settings' ? 700 : 500,
                fontSize: 13
              }}
            >
              <Settings size={18} color="#64748B" />
              {!isTablet && <span>Kitchen Settings</span>}
            </button>

            {/* Print Settings */}
            <button
              onClick={() => setActiveSidebarTab('print')}
              title="Print Settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isTablet ? 'center' : 'flex-start',
                gap: 8,
                padding: isTablet ? '10px 0' : '9px 12px',
                borderRadius: 8,
                background: activeSidebarTab === 'print' ? '#EFF6FF' : 'transparent',
                color: activeSidebarTab === 'print' ? '#2563EB' : '#475569',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeSidebarTab === 'print' ? 700 : 500,
                fontSize: 13
              }}
            >
              <Printer size={18} color="#64748B" />
              {!isTablet && <span>Print Settings</span>}
            </button>

            {/* Display Mode */}
            <button
              onClick={() => setActiveSidebarTab('display')}
              title="Display Mode"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isTablet ? 'center' : 'flex-start',
                gap: 8,
                padding: isTablet ? '10px 0' : '9px 12px',
                borderRadius: 8,
                background: activeSidebarTab === 'display' ? '#EFF6FF' : 'transparent',
                color: activeSidebarTab === 'display' ? '#2563EB' : '#475569',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeSidebarTab === 'display' ? 700 : 500,
                fontSize: 13
              }}
            >
              <Monitor size={18} color="#64748B" />
              {!isTablet && <span>Display Mode</span>}
            </button>
          </div>

          {/* Bottom Online Badge */}
          {!isTablet ? (
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Kitchen Display</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', paddingLeft: 14 }}>Online</span>
              <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>Last sync: 05:57 PM</span>
            </div>
          ) : (
            <div title="Kitchen Display Online" style={{ display: 'flex', justifyContent: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
            </div>
          )}
        </aside>
      )}

      {/* 2. MAIN KDS CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Main KDS Header */}
        <div style={{
          padding: isMobile ? '12px 14px' : '14px 20px',
          borderBottom: '1px solid #E2E8F0',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}>
          {/* Title & Badge */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
                Kitchen Display System
              </h1>
              <span style={{
                background: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid #DBEAFE',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}>
                Smart Queue ▾
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
              Live kitchen orders with real-time tracking
            </p>
          </div>

          {/* Right Action Controls */}
          <div
            className="touch-scroll"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'nowrap',
              maxWidth: '100%',
              padding: '2px 0'
            }}
          >
            {/* Test Scenarios Button */}
            {onOpenScenarioModal && (
              <button
                onClick={onOpenScenarioModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  color: '#334155',
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <FlaskConical size={14} color="#64748B" />
                <span>Test Scenarios</span>
              </button>
            )}

            {/* Reset Button */}
            <button
              onClick={resetAllData}
              title="Reset orders"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#334155',
                padding: '6px 10px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <RotateCcw size={13} color="#64748B" />
              <span>Reset</span>
            </button>

            {/* Digital Clock Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '6px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              color: '#0F172A',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap'
            }}>
              <Clock size={13} color="#F59E0B" />
              <span>{timeDigital}</span>
            </div>

            {/* Search Box */}
            <div style={{
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '6px 10px',
              width: 140
            }}>
              <Search size={13} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 12,
                  width: '100%'
                }}
              />
            </div>

            {/* Filter icon button */}
            <button style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '6px 8px',
              cursor: 'pointer',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center'
            }}>
              <SlidersHorizontal size={14} />
            </button>

            {/* View Mode Toggle: Grid & List */}
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? '#2563EB' : '#FFFFFF',
                  color: viewMode === 'grid' ? '#FFFFFF' : '#64748B',
                  padding: '6px 8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? '#2563EB' : '#FFFFFF',
                  color: viewMode === 'list' ? '#FFFFFF' : '#64748B',
                  padding: '6px 8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <List size={14} />
              </button>
            </div>

            {/* Fullscreen Expand */}
            <button
              onClick={toggleFullscreen}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                padding: '6px 8px',
                cursor: 'pointer',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* Mobile Quick Column Selector Bar (Allows quick 1-tap filtering on phone screens) */}
        {isMobile && (
          <div style={{
            display: 'flex',
            gap: 6,
            padding: '8px 14px',
            background: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            {[
              { id: 'all', label: 'All (9)' },
              { id: 'now', label: 'NOW (2)' },
              { id: 'cooking', label: 'COOKING (2)' },
              { id: 'upcoming', label: 'UPCOMING (3)' },
              { id: 'blocked', label: 'BLOCKED (1)' },
              { id: 'atrisk', label: 'AT RISK (2)' }
            ].map(col => (
              <button
                key={col.id}
                onClick={() => setActiveMobileColumn(col.id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 16,
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  background: activeMobileColumn === col.id ? '#0F172A' : '#F1F5F9',
                  color: activeMobileColumn === col.id ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {col.label}
              </button>
            ))}
          </div>
        )}

        {/* 3. FIVE KDS COLUMNS (Responsive Grid with Smooth Momentum Horizontal Scroll) */}
        <div
          className="touch-scroll"
          style={{
            flex: 1,
            padding: isMobile ? '12px' : '16px 20px',
            display: 'grid',
            gridTemplateColumns: isMobile
              ? activeMobileColumn === 'all'
                ? 'repeat(5, 275px)'
                : '1fr'
              : isTablet
                ? 'repeat(5, 250px)'
                : 'repeat(5, minmax(235px, 1fr))',
            gap: 12,
            alignItems: 'start',
            overflowY: 'auto'
          }}
        >
          {/* ===================== COLUMN 1: NOW ===================== */}
          {(activeMobileColumn === 'all' || activeMobileColumn === 'now') && (
            <div style={{
              background: '#EAF7EE',
              border: '1px solid #C8EEDB',
              borderRadius: 14,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={16} color="#10B981" />
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#065F46' }}>NOW</span>
                  </div>
                  <span style={{
                    background: '#10B981',
                    color: '#FFFFFF',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6
                  }}>
                    2
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#059669', marginTop: 2, fontWeight: 500 }}>
                  Start cooking immediately
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Card A101 */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  padding: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>A101</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#10B981' }}>5 min</span>
                      <MoreVertical size={14} color="#94A3B8" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
                    <Armchair size={13} />
                    <span>Dine In</span>
                    <span style={{ marginLeft: 4 }}>Table 1</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                    <div>1 × Classic Burger</div>
                    <div>1 × Masala Fries</div>
                  </div>

                  <button
                    onClick={() => handleStartOrder('ord-101')}
                    style={{
                      background: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px',
                      fontWeight: 700,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      marginTop: 2,
                      minHeight: 40
                    }}
                  >
                    <Play size={13} fill="#FFFFFF" />
                    <span>Start Cooking</span>
                  </button>
                </div>

                {/* Card A102 */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  padding: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>A102</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#10B981' }}>8 min</span>
                      <MoreVertical size={14} color="#94A3B8" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
                    <Armchair size={13} />
                    <span>Dine In</span>
                    <span style={{ marginLeft: 4 }}>Table 2</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                    <div>2 × Veg Chowmein</div>
                  </div>

                  <button
                    onClick={() => handleStartOrder('ord-102')}
                    style={{
                      background: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px',
                      fontWeight: 700,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      marginTop: 2,
                      minHeight: 40
                    }}
                  >
                    <Play size={13} fill="#FFFFFF" />
                    <span>Start Cooking</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== COLUMN 2: COOKING ===================== */}
          {(activeMobileColumn === 'all' || activeMobileColumn === 'cooking') && (
            <div style={{
              background: '#EEF5FF',
              border: '1px solid #CCE1FF',
              borderRadius: 14,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CookingPot size={16} color="#2563EB" />
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1E40AF' }}>COOKING</span>
                  </div>
                  <span style={{
                    background: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6
                  }}>
                    2
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#2563EB', marginTop: 2, fontWeight: 500 }}>
                  Items are being prepared
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Card A099 */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  padding: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>A099</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        background: '#FEE2E2',
                        color: '#DC2626',
                        fontSize: 12,
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <Clock size={11} />
                        <span>2:30</span>
                      </span>
                      <MoreVertical size={14} color="#94A3B8" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
                    <Armchair size={13} />
                    <span>Dine In</span>
                    <span style={{ marginLeft: 4 }}>Table 5</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                    <div>1 × Classic Burger</div>
                  </div>

                  <button
                    onClick={() => handleDoneOrder('ord-099')}
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #2563EB',
                      color: '#2563EB',
                      borderRadius: 8,
                      padding: '9px',
                      fontWeight: 700,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      marginTop: 2,
                      minHeight: 40
                    }}
                  >
                    <Check size={14} strokeWidth={2.5} />
                    <span>Mark Done</span>
                  </button>
                </div>

                {/* Card A100 */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  padding: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>A100</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        background: '#FEF3C7',
                        color: '#D97706',
                        fontSize: 12,
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <Clock size={11} />
                        <span>3:45</span>
                      </span>
                      <MoreVertical size={14} color="#94A3B8" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
                    <Armchair size={13} />
                    <span>Dine In</span>
                    <span style={{ marginLeft: 4 }}>Table 3</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                    <div>2 × Masala Fries</div>
                  </div>

                  <button
                    onClick={() => handleDoneOrder('ord-100')}
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #2563EB',
                      color: '#2563EB',
                      borderRadius: 8,
                      padding: '9px',
                      fontWeight: 700,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      marginTop: 2,
                      minHeight: 40
                    }}
                  >
                    <Check size={14} strokeWidth={2.5} />
                    <span>Mark Done</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== COLUMN 3: UPCOMING ===================== */}
          {(activeMobileColumn === 'all' || activeMobileColumn === 'upcoming') && (
            <div style={{
              background: '#F4F0FF',
              border: '1px solid #E4DAFF',
              borderRadius: 14,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={16} color="#7C3AED" />
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#5B21B6' }}>UPCOMING</span>
                  </div>
                  <span style={{
                    background: '#7C3AED',
                    color: '#FFFFFF',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6
                  }}>
                    3
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: 500 }}>
                  Next in queue
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Card A103 */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  padding: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>A103</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#0284C7' }}>12 min</span>
                      <MoreVertical size={14} color="#94A3B8" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
                    <Armchair size={13} />
                    <span>Dine In</span>
                    <span style={{ marginLeft: 4 }}>Table 4</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                    <div>1 × Cheese Burger</div>
                    <div>1 × Fries</div>
                  </div>
                </div>

                {/* Card A105 */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  padding: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>A105</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#0284C7' }}>18 min</span>
                      <MoreVertical size={14} color="#94A3B8" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
                    <Armchair size={13} />
                    <span>Dine In</span>
                    <span style={{ marginLeft: 4 }}>Table 6</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                    <div>1 × Chowmein</div>
                    <div>2 × Chai</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== COLUMN 4: BLOCKED ===================== */}
          {(activeMobileColumn === 'all' || activeMobileColumn === 'blocked') && (
            <div style={{
              background: '#FFF5EB',
              border: '1px solid #FED7AA',
              borderRadius: 14,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={16} color="#EA580C" />
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#9A3412' }}>BLOCKED</span>
                  </div>
                  <span style={{
                    background: '#EA580C',
                    color: '#FFFFFF',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6
                  }}>
                    1
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#9A3412', marginTop: 2, fontWeight: 500 }}>
                  Waiting / Issue
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Card A106 */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  padding: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>A106</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        background: '#FEE2E2',
                        color: '#DC2626',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 6
                      }}>
                        No Buns
                      </span>
                      <MoreVertical size={14} color="#94A3B8" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
                    <Armchair size={13} />
                    <span>Dine In</span>
                    <span style={{ marginLeft: 4 }}>Table 7</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                    <div>1 × Classic Burger</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== COLUMN 5: AT RISK 2 ===================== */}
          {(activeMobileColumn === 'all' || activeMobileColumn === 'atrisk') && (
            <div style={{
              background: '#FFF0F0',
              border: '1px solid #FECACA',
              borderRadius: 14,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={16} color="#DC2626" />
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#991B1B' }}>AT RISK 2</span>
                  </div>
                  <span style={{
                    background: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6
                  }}>
                    2
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#991B1B', marginTop: 2, fontWeight: 500 }}>
                  Delayed orders
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Card A098 */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  padding: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>A098</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        color: '#DC2626',
                        fontSize: 12,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}>
                        <AlertTriangle size={12} />
                        <span>25 min 🔺</span>
                      </span>
                      <MoreVertical size={14} color="#94A3B8" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
                    <Armchair size={13} />
                    <span>Dine In</span>
                    <span style={{ marginLeft: 4 }}>Table 8</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                    <div>3 × Chowmein</div>
                  </div>
                </div>

                {/* Card A097 */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  padding: 14,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>A097</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        color: '#DC2626',
                        fontSize: 12,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}>
                        <AlertTriangle size={12} />
                        <span>28 min 🔺</span>
                      </span>
                      <MoreVertical size={14} color="#94A3B8" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
                    <Armchair size={13} />
                    <span>Dine In</span>
                    <span style={{ marginLeft: 4 }}>Table 9</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                    <div>2 × Fries</div>
                    <div>2 × Chai</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. BOTTOM FOOTER STATUS BAR (Responsive: horizontal scroll on narrow devices) */}
        <footer className="touch-scroll" style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          gap: 16,
          boxShadow: '0 -1px 3px rgba(0,0,0,0.02)',
          whiteSpace: 'nowrap'
        }}>
          {/* Left Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ background: '#F1F5F9', padding: 5, borderRadius: 6, fontSize: 12 }}>📋</div>
              <div>
                <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Total Orders</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>9</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ background: '#EFF6FF', padding: 5, borderRadius: 6, color: '#2563EB', display: 'flex' }}>
                <CookingPot size={14} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Cooking</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#2563EB' }}>2</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ background: '#F5F3FF', padding: 5, borderRadius: 6, color: '#7C3AED', display: 'flex' }}>
                <Clock size={14} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Upcoming</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#7C3AED' }}>3</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ background: '#FFF7ED', padding: 5, borderRadius: 6, color: '#EA580C', display: 'flex' }}>
                <AlertTriangle size={14} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Blocked</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#EA580C' }}>1</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ background: '#FEF2F2', padding: 5, borderRadius: 6, color: '#DC2626', display: 'flex' }}>
                <AlertTriangle size={14} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>At Risk</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#DC2626' }}>2</div>
              </div>
            </div>
          </div>

          {/* Right Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 5, borderRadius: 6, display: 'flex' }}>
                <Clock size={14} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Avg Prep Time</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>14 min</span>
                  <span style={{ fontSize: 10, color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    <TrendingDown size={11} /> 12%
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ background: '#ECFDF5', padding: 5, borderRadius: 6, color: '#10B981', display: 'flex' }}>
                <TrendingUp size={14} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>On Time Rate</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>87%</span>
                  <span style={{ fontSize: 10, color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    <TrendingUp size={11} /> 5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
