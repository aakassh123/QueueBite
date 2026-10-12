import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuItem, OrderType } from '../../types';
import {
  Store,
  User,
  Phone,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  CreditCard,
  Banknote,
  QrCode,
  AlertCircle,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

export const PosTerminal: React.FC = () => {
  const {
    menu,
    orders,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    orderType,
    setOrderType,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    tableNumber,
    setTableNumber,
    placeOrder,
    setRole
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [createdOrderToken, setCreatedOrderToken] = useState<string | null>(null);
  const [posError, setPosError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [mobileTab, setMobileTab] = useState<'menu' | 'cart'>('menu');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isMobileOrTablet = windowWidth < 1024;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['All', 'Burgers', 'Fries', 'Chai', 'Noodles', 'Drinks'];

  const filteredMenu = menu.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateOrder = (paymentMethod: 'CASH' | 'UPI' | 'CARD') => {
    setPosError(null);
    const result = placeOrder(paymentMethod);
    if (result.success && result.order) {
      setCreatedOrderToken(result.order.token);
      setTimeout(() => setCreatedOrderToken(null), 4000);
    } else {
      setPosError(result.error || 'Failed to create order');
    }
  };

  return (
    <div style={{
      maxWidth: 1440,
      margin: '0 auto',
      padding: isMobile ? '12px' : '20px',
      display: 'grid',
      gridTemplateColumns: isMobileOrTablet ? '1fr' : '1fr 380px',
      gap: isMobile ? 12 : 20,
      minHeight: 'calc(100vh - 80px)',
      position: 'relative'
    }}>
      {/* Mobile/Tablet Screen Tab Switcher */}
      {isMobileOrTablet && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#E2E8F0',
          padding: 4,
          borderRadius: 10,
          gap: 4
        }}>
          <button
            onClick={() => setMobileTab('menu')}
            className="touch-btn"
            style={{
              padding: '10px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: mobileTab === 'menu' ? 800 : 600,
              background: mobileTab === 'menu' ? '#FFFFFF' : 'transparent',
              color: mobileTab === 'menu' ? '#0F172A' : '#64748B',
              boxShadow: mobileTab === 'menu' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <Store size={15} />
            <span>Menu Catalog</span>
          </button>
          <button
            onClick={() => setMobileTab('cart')}
            className="touch-btn"
            style={{
              padding: '10px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: mobileTab === 'cart' ? 800 : 600,
              background: mobileTab === 'cart' ? '#FFFFFF' : 'transparent',
              color: mobileTab === 'cart' ? '#F97316' : '#64748B',
              boxShadow: mobileTab === 'cart' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <ShoppingBag size={15} />
            <span>Cart ({cartItemCount}) · ₹{cartTotal}</span>
          </button>
        </div>
      )}

      {/* Left: Menu & Customer Header (Visible on Desktop OR when mobileTab === 'menu') */}
      {(!isMobileOrTablet || mobileTab === 'menu') && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Top Controls: Mode Switcher + Customer Input */}
        <div style={{
          background: '#FFFFFF',
          padding: 16,
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Mode tabs: Dine-in, Takeaway, Pre-order */}
            <div style={{
              display: 'flex',
              background: '#F1F5F9',
              padding: 4,
              borderRadius: 10,
              gap: 4
            }}>
              {(['DINE_IN', 'TAKEAWAY', 'PRE_ORDER'] as OrderType[]).map(type => {
                const label = type === 'DINE_IN' ? 'Dine-in' : type === 'TAKEAWAY' ? 'Takeaway' : 'Pre-order';
                const isSel = orderType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: isSel ? 700 : 500,
                      background: isSel ? '#F97316' : 'transparent',
                      color: isSel ? '#FFFFFF' : '#475569'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {orderType === 'DINE_IN' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Table:</span>
                <select
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    fontWeight: 600
                  }}
                >
                  <option value="Table 1">Table 1</option>
                  <option value="Table 2">Table 2</option>
                  <option value="Table 3">Table 3</option>
                  <option value="Table 4">Table 4</option>
                  <option value="Table 5">Table 5</option>
                </select>
              </div>
            )}
          </div>

          {/* Customer info */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '8px 12px'
            }}>
              <User size={16} color="#94A3B8" />
              <input
                type="text"
                placeholder="Customer Name (optional)"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '8px 12px'
            }}>
              <Phone size={16} color="#94A3B8" />
              <input
                type="text"
                placeholder="Phone Number (SMS/WhatsApp)"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Categories & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
            {categories.map(cat => {
              const isSel = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: isSel ? 700 : 500,
                    background: isSel ? '#0F172A' : '#FFFFFF',
                    color: isSel ? '#FFFFFF' : '#475569',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            padding: '6px 12px',
            minWidth: 220
          }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(140px, 1fr))' : 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: isMobile ? 10 : 14,
          overflowY: 'auto'
        }}>
          {filteredMenu.map(item => (
            <div
              key={item.id}
              onClick={() => addToCart(item)}
              style={{
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                padding: isMobile ? 10 : 12,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{
                height: isMobile ? 90 : 110,
                borderRadius: 8,
                overflow: 'hidden',
                marginBottom: 8
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <h4 style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: '#0F172A' }}>{item.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#F97316' }}>₹{item.price}</span>
                <span style={{
                  background: '#F1F5F9',
                  color: '#475569',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4
                }}>
                  {item.station}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Mobile Cart Summary Pill */}
        {isMobileOrTablet && cartItemCount > 0 && mobileTab === 'menu' && (
          <div style={{
            position: 'sticky',
            bottom: 12,
            zIndex: 40,
            marginTop: 8
          }}>
            <button
              onClick={() => setMobileTab('cart')}
              className="touch-btn"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                color: '#FFFFFF',
                padding: '12px 16px',
                borderRadius: 12,
                fontWeight: 800,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingBag size={17} />
                <span>{cartItemCount} item{cartItemCount > 1 ? 's' : ''} in cart</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>₹{cartTotal}</span>
                <ArrowRight size={15} />
              </div>
            </button>
          </div>
        )}
      </div>
      )}

      {/* Right: Cart & Fast POS Checkout (Visible on Desktop OR when mobileTab === 'cart') */}
      {(!isMobileOrTablet || mobileTab === 'cart') && (
      <div style={{
        background: '#FFFFFF',
        borderRadius: 14,
        border: '1px solid #E2E8F0',
        padding: isMobile ? 14 : 18,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 12,
          borderBottom: '1px solid #F1F5F9'
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>Order Items</h3>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Success badge after order creation */}
        {createdOrderToken && (
          <div style={{
            margin: '12px 0',
            padding: 12,
            background: '#ECFDF5',
            border: '1px solid #10B981',
            borderRadius: 10,
            color: '#065F46',
            fontSize: 13,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={18} color="#10B981" />
              <span>Created Token {createdOrderToken}!</span>
            </div>
            <button
              onClick={() => setRole('kds')}
              style={{ fontSize: 11, background: '#10B981', color: '#FFFFFF', padding: '3px 8px', borderRadius: 6 }}
            >
              View in KDS →
            </button>
          </div>
        )}

        {posError && (
          <div style={{
            margin: '12px 0',
            padding: 10,
            background: '#FEF2F2',
            border: '1px solid #EF4444',
            borderRadius: 8,
            color: '#B91C1C',
            fontSize: 12
          }}>
            {posError}
          </div>
        )}

        {/* Cart Item Rows */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 10px', color: '#94A3B8', fontSize: 13 }}>
              Select items from the menu to start order
            </div>
          ) : (
            cart.map(ci => (
              <div
                key={ci.menuItem.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 8,
                  borderRadius: 8,
                  background: '#F8FAFC'
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{ci.menuItem.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>₹{ci.menuItem.price} each</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => updateCartQuantity(ci.menuItem.id, ci.quantity - 1)}
                    style={{ width: 24, height: 24, borderRadius: 4, background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>
                    {ci.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(ci.menuItem.id, ci.quantity + 1)}
                    style={{ width: 24, height: 24, borderRadius: 4, background: '#FFEDD5', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Plus size={12} />
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 800, minWidth: 45, textAlign: 'right' }}>
                    ₹{ci.menuItem.price * ci.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total & Action */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#64748B' }}>Total</span>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>₹{cartTotal}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            <button
              onClick={() => handleCreateOrder('CASH')}
              disabled={cart.length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px',
                borderRadius: 8,
                background: '#10B981',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 13,
                opacity: cart.length === 0 ? 0.5 : 1
              }}
            >
              <Banknote size={16} />
              <span>Cash Paid</span>
            </button>

            <button
              onClick={() => handleCreateOrder('UPI')}
              disabled={cart.length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px',
                borderRadius: 8,
                background: '#3B82F6',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 13,
                opacity: cart.length === 0 ? 0.5 : 1
              }}
            >
              <QrCode size={16} />
              <span>Counter UPI</span>
            </button>
          </div>

          <button
            onClick={() => handleCreateOrder('CASH')}
            disabled={cart.length === 0}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              color: '#FFFFFF',
              padding: '14px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 16,
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
              opacity: cart.length === 0 ? 0.5 : 1
            }}
          >
            Create Order
          </button>
        </div>
      </div>
      )}
    </div>
  );
};
