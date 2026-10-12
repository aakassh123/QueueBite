import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { HOURLY_ORDERS_TODAY, TOP_SELLING_ITEMS } from '../../data/mockReports';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ChefHat,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const { orders } = useRestaurant();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isMobileOrTablet = windowWidth < 960;

  // Dynamic calculations combining mock baseline with live session orders
  const liveCount = orders.length;
  const todayTotalOrders = 124 + (liveCount > 6 ? liveCount - 6 : 0);
  const liveRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.total : 0), 0);
  const totalRevenue = 18450 + (liveRevenue > 1000 ? liveRevenue - 1000 : 0);

  return (
    <div style={{
      maxWidth: 1400,
      margin: '0 auto',
      padding: isMobile ? '12px' : '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? 16 : 24
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
          <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: '#0F172A' }}>Owner Dashboard</h1>
          <p style={{ fontSize: 12, color: '#64748B' }}>
            Real-time single-outlet performance, kitchen bottlenecks & velocity
          </p>
        </div>

        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          padding: '6px 14px',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          color: '#334155'
        }}>
          Today · {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
        </div>
      </div>

      {/* 4 Metric Cards (Matching Screenshot Row 3, Screen 1) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? 140 : 220}px, 1fr))`,
        gap: isMobile ? 10 : 16
      }}>
        {/* Card 1: Total Orders */}
        <div style={{
          background: '#FFFFFF',
          padding: '20px',
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600, marginBottom: 8 }}>
            Total Orders
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#0F172A' }}>{todayTotalOrders}</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              color: '#10B981',
              fontSize: 13,
              fontWeight: 700
            }}>
              <ArrowUpRight size={16} />
              <span>12%</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Vs yesterday (110)</div>
        </div>

        {/* Card 2: Revenue */}
        <div style={{
          background: '#FFFFFF',
          padding: '20px',
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600, marginBottom: 8 }}>
            Revenue
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#0F172A' }}>₹{totalRevenue.toLocaleString('en-IN')}</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              color: '#10B981',
              fontSize: 13,
              fontWeight: 700
            }}>
              <ArrowUpRight size={16} />
              <span>8%</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>UPI: 68% · Cash: 32%</div>
        </div>

        {/* Card 3: Avg Prep Time */}
        <div style={{
          background: '#FFFFFF',
          padding: '20px',
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600, marginBottom: 8 }}>
            Avg. Prep Time
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#0F172A' }}>14 min</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              color: '#10B981',
              fontSize: 13,
              fontWeight: 700
            }}>
              <ArrowDownRight size={16} />
              <span>18%</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Smart Queue batching effect</div>
        </div>

        {/* Card 4: On-time Orders */}
        <div style={{
          background: '#FFFFFF',
          padding: '20px',
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600, marginBottom: 8 }}>
            On-time Orders
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#0F172A' }}>96%</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              color: '#10B981',
              fontSize: 13,
              fontWeight: 700
            }}>
              <ArrowUpRight size={16} />
              <span>4%</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>P50-P80 range accuracy</div>
        </div>
      </div>

      {/* Charts & Breakdown (Orders Throughout the Day & Top Items) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobileOrTablet ? '1fr' : '1.6fr 1fr',
        gap: isMobile ? 14 : 20
      }}>
        {/* Left: Orders Throughout the Day Chart */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          padding: isMobile ? '16px' : '20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 8
          }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Orders Throughout the Day</h3>
              <p style={{ fontSize: 12, color: '#64748B' }}>Hourly volume tracking peak surges</p>
            </div>
            <span style={{ fontSize: 12, color: '#3B82F6', fontWeight: 700 }}>
              Peak: 8:00 PM (34 orders)
            </span>
          </div>

          {/* SVG Line / Bar visualization */}
          <div className="touch-scroll" style={{ overflowX: 'auto', paddingBottom: 6 }}>
            <div style={{ height: 210, minWidth: isMobile ? 380 : 'auto', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 14, paddingTop: 20 }}>
            {HOURLY_ORDERS_TODAY.map((item, index) => {
              const heightPct = (item.orders / 36) * 100;
              return (
                <div
                  key={item.hour}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    height: '100%',
                    justifyContent: 'flex-end'
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                    {item.orders}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 34,
                      height: `${heightPct}%`,
                      background: index === 6 ? '#F97316' : 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.4s ease'
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>{item.hour}</span>
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Right: Top Items */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          padding: '20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>Top Items</h3>
            <p style={{ fontSize: 12, color: '#64748B' }}>Highest velocity dry-food preparations</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'space-around' }}>
            {TOP_SELLING_ITEMS.map((item, idx) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 10,
                  background: '#F8FAFC'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: idx === 0 ? '#F97316' : '#E2E8F0',
                    color: idx === 0 ? '#FFFFFF' : '#475569',
                    fontSize: 12,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                    {item.name}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                    {item.count} orders
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    ₹{item.revenue.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
