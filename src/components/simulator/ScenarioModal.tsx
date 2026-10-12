import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Sparkles,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Clock,
  ShieldCheck,
  Flame
} from 'lucide-react';

interface ScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioModal: React.FC<ScenarioModalProps> = ({ isOpen, onClose }) => {
  const { runScenario, setRole } = useRestaurant();
  const [activeScenarioTab, setActiveScenarioTab] = useState<number>(1);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  const isMobile = windowWidth < 640;

  const scenarios = [
    {
      id: 1,
      title: 'Scenario 1: Four Customers at Once (The Core Problem)',
      badge: 'Validated Schedule',
      desc: 'Demonstrates Smart Queue backward planning, safe batching, and eliminating cold food idle time.',
      problem: 'Under FIFO, seated Dine-in customer C waits 14 min, while pre-order A finishes at min 6 and sits cold for 6 min before customer arrives.',
      solution: 'Smart Queue backward-plans Order A, releases present customers C & D immediately, and batches Chilli Potato between B & C.',
      metrics: [
        { label: 'Seated Customer Wait', fifo: '12 - 14 min', smart: '7 min (-42%)' },
        { label: 'Pre-order Food Idle Time', fifo: '6 min (soggy)', smart: '0 min (fresh & crisp)' },
        { label: 'Violations', fifo: 'Fries hold violated', smart: '0 violations' }
      ]
    },
    {
      id: 3,
      title: 'Scenario 3: Fryer Bottleneck (6 Orders in 1 Min)',
      badge: 'Batching Throughput',
      desc: 'Demonstrates safe batching with 2 portions per cycle raising throughput.',
      problem: 'Single basket handles 1 portion at a time = 30 minutes queue for 6 orders.',
      solution: 'Batches 2 portions per cycle while preserving individual order ownership tags.',
      metrics: [
        { label: 'Total Completion Time', fifo: '30 min', smart: '15 min (50% faster)' },
        { label: 'Customer ETA Quote', fifo: 'Flat 8 min (dishonest)', smart: '5-6, 10-11, 15-16m' }
      ]
    },
    {
      id: 4,
      title: 'Scenario 4: Stock Shortage Race Condition (Last 3 Buns)',
      badge: 'Atomic Stock Guard',
      desc: 'Customer X and Customer Y order simultaneously with only 3 buns remaining.',
      problem: 'Standard systems double-reserve and oversell food that cannot be prepared.',
      solution: 'QueueBite PostgreSQL-style conditional update: Order X reserves 2 buns; Order Y is cleanly halted and offered 1 left or alternative.',
      metrics: [
        { label: 'Oversold Stock', fifo: '1 burger oversold', smart: '0 (Guaranteed atomic)' },
        { label: 'Customer Y Experience', fifo: 'Late cancel at cooking', smart: 'Immediate honest option' }
      ]
    },
    {
      id: 12,
      title: 'Scenario 12: Wrong "Ready" Tap at Expo',
      badge: '20s Undo Window',
      desc: 'Staff accidentally marks order ready before packaging is complete.',
      problem: 'Triggers premature SMS/WhatsApp notification to customer who arrives at an empty counter.',
      solution: 'QueueBite enforces a 20-second undo grace timer. Staff can revert with 1-tap with zero false customer alerts.',
      metrics: [
        { label: 'Premature Notification', fifo: 'Sent immediately', smart: 'Zero false alerts' },
        { label: 'Grace Period', fifo: 'None', smart: '20-second countdown' }
      ]
    }
  ];

  const currentScen = scenarios.find(s => s.id === activeScenarioTab) || scenarios[0];

  const handleExecute = () => {
    runScenario(currentScen.id);
    setHasRun(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isMobile ? 8 : 16
    }}>
      <div style={{
        background: '#0F172A',
        border: '1px solid #1E293B',
        borderRadius: isMobile ? 14 : 20,
        maxWidth: 720,
        width: '100%',
        maxHeight: '92vh',
        color: '#FFFFFF',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: isMobile ? '14px 16px' : '20px 24px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#F97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={17} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{ fontSize: isMobile ? 15 : 18, fontWeight: 800 }}>QueueBite Spec Test</h2>
              <div style={{ fontSize: 11, color: '#94A3B8' }} className="hide-on-mobile">
                Engineering test suite from Section 24 of the Specification
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ color: '#94A3B8', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="touch-scroll" style={{
          display: 'flex',
          background: '#1E293B',
          padding: 6,
          borderBottom: '1px solid #334155',
          overflowX: 'auto',
          gap: 6
        }}>
          {scenarios.map(s => {
            const isSel = activeScenarioTab === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setActiveScenarioTab(s.id);
                  setHasRun(false);
                }}
                className="touch-btn"
                style={{
                  padding: '7px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: isSel ? 700 : 500,
                  background: isSel ? '#F97316' : 'transparent',
                  color: isSel ? '#FFFFFF' : '#94A3B8',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                Scenario {s.id}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div style={{ padding: isMobile ? '16px' : '24px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: '#FFFFFF' }}>{currentScen.title}</h3>
              <span style={{
                background: 'rgba(249, 115, 22, 0.2)',
                color: '#F97316',
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 4
              }}>
                {currentScen.badge}
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>{currentScen.desc}</p>
          </div>

          {/* Problem vs Solution Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
            <div style={{
              background: '#1E293B',
              padding: 14,
              borderRadius: 12,
              border: '1px solid #334155'
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#EF4444', marginBottom: 4 }}>
                Without Smart Queue (Standard FIFO):
              </div>
              <div style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.4 }}>
                {currentScen.problem}
              </div>
            </div>

            <div style={{
              background: '#1E293B',
              padding: 14,
              borderRadius: 12,
              border: '1px solid #10B981'
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', marginBottom: 4 }}>
                With QueueBite Smart Queue:
              </div>
              <div style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.4 }}>
                {currentScen.solution}
              </div>
            </div>
          </div>

          {/* Metric Diff Table */}
          <div style={{
            background: '#131D31',
            borderRadius: 12,
            border: '1px solid #1E293B',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1E293B', color: '#94A3B8', textAlign: 'left' }}>
                  <th style={{ padding: '8px 14px' }}>Metric</th>
                  <th style={{ padding: '8px 14px', color: '#EF4444' }}>FIFO Baseline</th>
                  <th style={{ padding: '8px 14px', color: '#10B981' }}>QueueBite Smart Queue</th>
                </tr>
              </thead>
              <tbody>
                {currentScen.metrics.map(m => (
                  <tr key={m.label} style={{ borderTop: '1px solid #1E293B' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{m.label}</td>
                    <td style={{ padding: '10px 14px', color: '#CBD5E1' }}>{m.fifo}</td>
                    <td style={{ padding: '10px 14px', color: '#10B981', fontWeight: 700 }}>{m.smart}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Execution Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>
              Injects these 4 real orders directly into the live KDS, POS & Inventory.
            </span>

            <button
              onClick={handleExecute}
              style={{
                background: hasRun ? '#10B981' : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)'
              }}
            >
              {hasRun ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Scenario Applied!</span>
                </>
              ) : (
                <>
                  <Play size={16} fill="#FFFFFF" />
                  <span>Execute Scenario {currentScen.id}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
