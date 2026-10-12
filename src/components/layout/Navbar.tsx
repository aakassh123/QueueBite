import React, { useState, useEffect } from 'react';
import { useRestaurant, UserRole } from '../../context/RestaurantContext';
import {
  UtensilsCrossed,
  ChefHat,
  PackageCheck,
  LayoutDashboard,
  Boxes,
  BarChart3,
  Smartphone,
  Store,
  Settings,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenScenarioModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { role, setRole, activeStationFilter, setActiveStationFilter } = useRestaurant();
  const [timeStr, setTimeStr] = useState('05:57 PM');
  const [dateStr, setDateStr] = useState('Fri, 10 Oct 2026');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const isMobile = windowWidth < 820;

  const roleNavItems: { id: UserRole; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'customer', label: 'Customer App', icon: <Smartphone size={15} /> },
    { id: 'pos', label: 'Counter POS', icon: <Store size={15} /> },
    { id: 'kds', label: 'Kitchen (KDS)', icon: <ChefHat size={15} />, count: 9 },
    { id: 'expo', label: 'Expo / Packing', icon: <PackageCheck size={15} /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'inventory', label: 'Inventory', icon: <Boxes size={15} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={15} /> }
  ];

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <div style={{
        maxWidth: 1720,
        margin: '0 auto',
        padding: isMobile ? '8px 12px 6px' : '8px 16px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? 8 : 12
      }}>
        {/* Top bar on mobile / Left group on desktop */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(249, 115, 22, 0.35)'
            }}>
              <UtensilsCrossed size={17} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.4px' }}>
                  Queue<span style={{ color: '#F97316' }}>Bite</span>
                </span>
                <span style={{
                  color: '#64748B',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '1px 4px',
                  borderRadius: 4
                }}>
                  v4.0
                </span>
              </div>
              {!isMobile && (
                <div style={{ fontSize: 9, color: '#94A3B8', marginTop: -2 }}>
                  Order, Kitchen & Live-Tracking
                </div>
              )}
            </div>
          </div>

          {/* Right Controls in mobile view */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Station select */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                background: '#F8FAFC',
                padding: '4px 8px',
                borderRadius: 7,
                border: '1px solid #E2E8F0',
                fontSize: 11,
                fontWeight: 700,
                color: '#1E293B'
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                <select
                  value={activeStationFilter}
                  onChange={e => setActiveStationFilter(e.target.value as any)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontWeight: 700,
                    fontSize: 11,
                    color: '#1E293B',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Kitchen</option>
                  <option value="grill">Grill</option>
                  <option value="fryer">Fryer</option>
                  <option value="wok">Wok</option>
                  <option value="beverage">Chai</option>
                  <option value="cold">Cold</option>
                </select>
              </div>

              {/* Time */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                fontSize: 11,
                fontWeight: 800,
                color: '#0F172A',
                background: '#F1F5F9',
                padding: '4px 8px',
                borderRadius: 6
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#F59E0B' }} />
                <span>{timeStr}</span>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher with Smooth Touch Horizontal Scroll */}
        <nav
          className="touch-scroll"
          style={{
            display: 'flex',
            background: isMobile ? '#F8FAFC' : 'transparent',
            borderRadius: isMobile ? 10 : 0,
            padding: isMobile ? '4px' : '2px 0',
            border: isMobile ? '1px solid #E2E8F0' : 'none',
            gap: 4,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            maxWidth: '100%'
          }}
        >
          {roleNavItems.map(item => {
            const isActive = role === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setRole(item.id)}
                className="touch-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: isMobile ? '6px 10px' : '6px 12px',
                  borderRadius: 8,
                  fontSize: isMobile ? 12 : 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#FFFFFF' : '#475569',
                  background: isActive ? '#F97316' : 'transparent',
                  transition: 'all 0.15s ease',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  minHeight: 34
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.count && (
                  <span style={{
                    background: isActive ? '#FFFFFF' : '#E2E8F0',
                    color: isActive ? '#F97316' : '#475569',
                    fontSize: 10,
                    fontWeight: 800,
                    width: 17,
                    height: 17,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 2
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Station Filter & Time on Desktop */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Station dropdown */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: '#F8FAFC',
              padding: '5px 10px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              fontSize: 12,
              fontWeight: 700,
              color: '#1E293B',
              cursor: 'pointer'
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981' }} />
              <select
                value={activeStationFilter}
                onChange={e => setActiveStationFilter(e.target.value as any)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 700,
                  fontSize: 12,
                  color: '#1E293B',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Kitchen</option>
                <option value="grill">Grill Station</option>
                <option value="fryer">Fryer Station</option>
                <option value="wok">Wok Station</option>
                <option value="beverage">Chai & Drinks</option>
                <option value="cold">Cold & Chaat</option>
              </select>
              <ChevronDown size={13} color="#64748B" />
            </div>

            {/* Time & Date Display */}
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800, color: '#0F172A' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                <span>{timeStr}</span>
              </div>
              <div style={{ fontSize: 10, color: '#94A3B8' }} className="hide-on-mobile">
                {dateStr}
              </div>
            </div>

            <button style={{ color: '#64748B', display: 'flex', alignItems: 'center', padding: 4 }}>
              <Settings size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
