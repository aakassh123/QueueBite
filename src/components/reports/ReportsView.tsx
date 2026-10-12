import React, { useState } from 'react';
import { CHANNEL_DISTRIBUTION, PEAK_HOURS_WEEK } from '../../data/mockReports';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChart
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 7 Days');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isMobileOrTablet = windowWidth < 960;

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
          <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: '#0F172A' }}>Reports & Insights</h1>
          <p style={{ fontSize: 12, color: '#64748B' }}>
            Comprehensive historical throughput, channel breakdown & peak hour dynamics
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <select
            value={selectedTimeframe}
            onChange={e => setSelectedTimeframe(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              fontWeight: 600,
              fontSize: 12
            }}
          >
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days (5 May – 11 May)</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* 4 KPI Cards (Matching Screenshot Row 3, Screen 3) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? 140 : 220}px, 1fr))`,
        gap: isMobile ? 10 : 16
      }}>
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
            <span style={{ fontSize: 32, fontWeight: 900, color: '#0F172A' }}>856</span>
            <div style={{ display: 'flex', alignItems: 'center', color: '#10B981', fontSize: 13, fontWeight: 700 }}>
              <ArrowUpRight size={16} />
              <span>10%</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Across all 5 channels</div>
        </div>

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
            <span style={{ fontSize: 32, fontWeight: 900, color: '#0F172A' }}>₹1,28,450</span>
            <div style={{ display: 'flex', alignItems: 'center', color: '#10B981', fontSize: 13, fontWeight: 700 }}>
              <ArrowUpRight size={16} />
              <span>22%</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Avg order value: ₹150</div>
        </div>

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
            <span style={{ fontSize: 32, fontWeight: 900, color: '#0F172A' }}>15 min</span>
            <div style={{ display: 'flex', alignItems: 'center', color: '#10B981', fontSize: 13, fontWeight: 700 }}>
              <ArrowDownRight size={16} />
              <span>20%</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Fryer cycle optimized</div>
        </div>

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
            <span style={{ fontSize: 32, fontWeight: 900, color: '#0F172A' }}>94%</span>
            <div style={{ display: 'flex', alignItems: 'center', color: '#10B981', fontSize: 13, fontWeight: 700 }}>
              <ArrowUpRight size={16} />
              <span>6%</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Zero idle pre-orders</div>
        </div>
      </div>

      {/* Two Visual Charts: Orders by Channel & Peak Hours */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobileOrTablet ? '1fr' : '1fr 1.6fr',
        gap: isMobile ? 14 : 20
      }}>
        {/* Orders by Channel Donut */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          padding: isMobile ? '16px' : '24px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Orders by Channel</h3>
          <p style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>Customer volume distribution</p>

          {/* SVG Donut Visual */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '12px 0' }}>
            <svg width="180" height="180" viewBox="0 0 100 100">
              {/* Takeaway: 52% -> 187.2 deg */}
              <circle
                cx="50" cy="50" r="38"
                fill="transparent"
                stroke="#3B82F6"
                strokeWidth="15"
                strokeDasharray="124.2 238.7"
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
              {/* Dine-in: 28% -> 100.8 deg */}
              <circle
                cx="50" cy="50" r="38"
                fill="transparent"
                stroke="#F97316"
                strokeWidth="15"
                strokeDasharray="66.8 238.7"
                strokeDashoffset="-124.2"
                transform="rotate(-90 50 50)"
              />
              {/* Pre-order: 20% -> 72 deg */}
              <circle
                cx="50" cy="50" r="38"
                fill="transparent"
                stroke="#10B981"
                strokeWidth="15"
                strokeDasharray="47.7 238.7"
                strokeDashoffset="-191"
                transform="rotate(-90 50 50)"
              />
            </svg>

            {/* Inner Center Text */}
            <div style={{
              position: 'absolute',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>856</span>
              <span style={{ fontSize: 11, color: '#64748B' }}>Total Orders</span>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto', paddingTop: 16 }}>
            {CHANNEL_DISTRIBUTION.map(ch => (
              <div key={ch.channel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: ch.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{ch.channel}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{ch.percentage}%</span>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>({ch.orders})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours Bar Chart */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          padding: isMobile ? '16px' : '24px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Peak Hours</h3>
              <p style={{ fontSize: 12, color: '#64748B' }}>Lunch surge (1pm) & Dinner surge (7-8pm)</p>
            </div>
            <span style={{ fontSize: 12, color: '#10B981', fontWeight: 700, background: '#ECFDF5', padding: '4px 10px', borderRadius: 20 }}>
              Max: 144 orders / hr
            </span>
          </div>

          <div className="touch-scroll" style={{ overflowX: 'auto', paddingBottom: 6 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 14, height: 230, minWidth: isMobile ? 380 : 'auto', paddingTop: 20 }}>
              {PEAK_HOURS_WEEK.map((item) => {
                const heightPct = (item.orders / 150) * 100;
                const isPeak = item.orders > 110;
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
                    <span style={{ fontSize: 11, fontWeight: 700, color: isPeak ? '#F97316' : '#64748B' }}>
                      {item.orders}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 40,
                        height: `${heightPct}%`,
                        background: isPeak
                          ? 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)'
                          : 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                        borderRadius: '6px 6px 0 0',
                        boxShadow: isPeak ? '0 4px 12px rgba(249, 115, 22, 0.3)' : 'none'
                      }}
                    />
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{item.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
