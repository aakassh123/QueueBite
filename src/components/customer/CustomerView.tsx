import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuItem, OrderType } from '../../types';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Navigation,
  MapPin,
  Check,
  CreditCard,
  QrCode,
  Banknote,
  Search,
  MessageCircle,
  AlertCircle,
  Flame,
  ChefHat,
  Store
} from 'lucide-react';

type CustomerScreen = 'landing' | 'menu' | 'cart' | 'pickup' | 'payment' | 'tracking';

export const CustomerView: React.FC = () => {
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
    pickupSlot,
    setPickupSlot,
    placeOrder,
    activeCustomerOrderId,
    setActiveCustomerOrderId,
    customerImLeaving,
    customerImHere
  } = useRestaurant();

  const [currentScreen, setCurrentScreen] = useState<CustomerScreen>('landing');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'CASH'>('UPI');
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState<boolean>(false);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet'>('mobile');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  // Current active tracking order
  const activeOrder = orders.find(o => o.id === activeCustomerOrderId) || orders[0];

  const categories = ['All', 'Burgers', 'Fries', 'Chai', 'Noodles', 'Drinks'];

  const filteredMenu = menu.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateOrder = () => {
    setIsSimulatingPayment(true);
    setOrderError(null);

    setTimeout(() => {
      const result = placeOrder(selectedPaymentMethod);
      setIsSimulatingPayment(false);

      if (result.success && result.order) {
        setActiveCustomerOrderId(result.order.id);
        setCurrentScreen('tracking');
      } else {
        setOrderError(result.error || 'Failed to place order');
      }
    }, 700);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isKioskMode = deviceMode === 'tablet' && !isMobile;

  return (
    <div style={{
      maxWidth: isKioskMode ? 960 : isMobile ? '100%' : 440,
      margin: isMobile ? '0' : '12px auto',
      minHeight: isMobile ? 'calc(100vh - 65px)' : 'calc(100vh - 90px)',
      background: '#FFFFFF',
      boxShadow: isMobile ? 'none' : '0 8px 30px rgba(0,0,0,0.08)',
      borderRadius: isMobile ? 0 : 16,
      border: isMobile ? 'none' : '1px solid #E2E8F0',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Mini Screen Switcher Helper for Reviewers */}
      <div style={{
        background: '#F1F5F9',
        borderBottom: '1px solid #E2E8F0',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 11,
        color: '#475569',
        flexWrap: 'wrap',
        gap: 6
      }}>
        <div className="touch-scroll" style={{ display: 'flex', gap: 5, overflowX: 'auto', padding: '2px 0', maxWidth: '100%' }}>
          {(['landing', 'menu', 'cart', 'pickup', 'payment', 'tracking'] as CustomerScreen[]).map(sc => (
            <button
              key={sc}
              onClick={() => setCurrentScreen(sc)}
              className="touch-btn"
              style={{
                padding: '3px 8px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: currentScreen === sc ? 700 : 500,
                background: currentScreen === sc ? '#F97316' : '#E2E8F0',
                color: currentScreen === sc ? '#FFFFFF' : '#334155',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {sc.charAt(0).toUpperCase() + sc.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Device Preview Toggle on larger screens */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              background: '#E2E8F0',
              padding: 2,
              borderRadius: 6
            }}>
              <button
                onClick={() => setDeviceMode('mobile')}
                style={{
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: deviceMode === 'mobile' ? 700 : 500,
                  background: deviceMode === 'mobile' ? '#FFFFFF' : 'transparent',
                  color: deviceMode === 'mobile' ? '#0F172A' : '#64748B'
                }}
              >
                📱 Phone
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                style={{
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: deviceMode === 'tablet' ? 700 : 500,
                  background: deviceMode === 'tablet' ? '#FFFFFF' : 'transparent',
                  color: deviceMode === 'tablet' ? '#0F172A' : '#64748B'
                }}
              >
                🖥️ Tablet Kiosk
              </button>
            </div>
          )}

          {cartItemCount > 0 && currentScreen !== 'cart' && (
            <button
              onClick={() => setCurrentScreen('cart')}
              className="touch-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: '#F97316',
                color: '#FFFFFF',
                padding: '3px 8px',
                borderRadius: 4,
                fontWeight: 600
              }}
            >
              <ShoppingBag size={12} />
              <span>{cartItemCount}</span>
            </button>
          )}
        </div>
      </div>

      {/* SCREEN 1: LANDING / HERO */}
      {currentScreen === 'landing' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          padding: '24px 20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top Brand */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
              Queue<span style={{ color: '#F97316' }}>Bite</span>
            </span>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 12,
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
              Kitchen Live
            </div>
          </div>

          {/* Hero Center with dry-food visual */}
          <div style={{ margin: '40px 0 20px', textAlign: 'center' }}>
            <div style={{
              width: 170,
              height: 170,
              margin: '0 auto 24px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              border: '4px solid rgba(249, 115, 22, 0.4)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
                alt="QueueBite Burger & Fries"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
              Good Food.<br />
              <span style={{ color: '#F97316' }}>Less Waiting.</span>
            </h1>
            <p style={{ fontSize: 14, color: '#94A3B8', maxWidth: 280, margin: '0 auto' }}>
              Order ahead, pick up or dine in. Freshly prepared, right on time.
            </p>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => setCurrentScreen('menu')}
              style={{
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                color: '#FFFFFF',
                padding: '16px',
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 16,
                boxShadow: '0 8px 24px rgba(249, 115, 22, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <span>Order Now</span>
              <ChevronRight size={18} />
            </button>

            <button
              onClick={() => setCurrentScreen('menu')}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#CBD5E1',
                padding: '14px',
                borderRadius: 14,
                fontWeight: 600,
                fontSize: 15,
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              View Menu
            </button>

            {/* Three Customer Types Selector Bar (Spec Section 3.1) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 8,
              marginTop: 12,
              background: 'rgba(0,0,0,0.3)',
              padding: 6,
              borderRadius: 12
            }}>
              {(['TAKEAWAY', 'DINE_IN', 'PRE_ORDER'] as OrderType[]).map(type => {
                const label = type === 'TAKEAWAY' ? 'Takeaway' : type === 'DINE_IN' ? 'Dine-in' : 'Pre-order';
                const isSel = orderType === type;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      setOrderType(type);
                      setCurrentScreen('menu');
                    }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: isSel ? 700 : 500,
                      background: isSel ? '#F97316' : 'transparent',
                      color: isSel ? '#FFFFFF' : '#94A3B8'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: OUR MENU */}
      {currentScreen === 'menu' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>Our Menu</h2>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  Mode: <strong style={{ color: '#F97316' }}>{orderType}</strong>
                </span>
              </div>
              {cartItemCount > 0 && (
                <button
                  onClick={() => setCurrentScreen('cart')}
                  style={{
                    background: '#F97316',
                    color: '#FFFFFF',
                    padding: '8px 14px',
                    borderRadius: 20,
                    fontWeight: 700,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                  }}
                >
                  <ShoppingBag size={14} />
                  <span>{cartItemCount} · ₹{cartTotal}</span>
                </button>
              )}
            </div>

            {/* Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              padding: '8px 12px',
              marginBottom: 12
            }}>
              <Search size={16} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search burgers, fries, chai..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: 13
                }}
              />
            </div>

            {/* Category Pills */}
            <div className="touch-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {categories.map(cat => {
                const isSel = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="touch-btn"
                    style={{
                      padding: '7px 16px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: isSel ? 700 : 500,
                      background: isSel ? '#F97316' : '#F1F5F9',
                      color: isSel ? '#FFFFFF' : '#475569',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu Items List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: isKioskMode ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
            gap: 14,
            alignContent: 'start'
          }}>
            {filteredMenu.map(item => {
              const inCart = cart.find(ci => ci.menuItem.id === item.id);
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: 12,
                    borderRadius: 14,
                    background: '#FFFFFF',
                    border: '1px solid #F1F5F9',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    alignItems: 'center'
                  }}
                >
                  <div style={{
                    width: 76,
                    height: 76,
                    borderRadius: 12,
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{item.name}</h4>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 6px', lineHeight: 1.3 }}>
                      {item.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>₹{item.price}</span>

                      {inCart ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          background: '#FFEDD5',
                          borderRadius: 20,
                          padding: '3px 8px'
                        }}>
                          <button
                            onClick={() => updateCartQuantity(item.id, inCart.quantity - 1)}
                            style={{ color: '#EA580C', padding: 2 }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#C2410C' }}>{inCart.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, inCart.quantity + 1)}
                            style={{ color: '#EA580C', padding: 2 }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: '#F97316',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(249, 115, 22, 0.4)'
                          }}
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Bottom Cart Bar */}
          {cartItemCount > 0 && (
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid #E2E8F0',
              background: '#FFFFFF',
              boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
            }}>
              <button
                onClick={() => setCurrentScreen('cart')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)'
                }}
              >
                <span>View Cart ({cartItemCount} items)</span>
                <span>₹{cartTotal} →</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SCREEN 3: YOUR CART */}
      {currentScreen === 'cart' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setCurrentScreen('menu')} style={{ color: '#0F172A' }}>
                <ArrowLeft size={18} />
              </button>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>Your Cart</h2>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Cart Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
                <ShoppingBag size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p style={{ fontSize: 16, fontWeight: 600 }}>Your cart is empty</p>
                <button
                  onClick={() => setCurrentScreen('menu')}
                  style={{
                    marginTop: 16,
                    padding: '8px 18px',
                    borderRadius: 20,
                    background: '#F97316',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: 13
                  }}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cart.map(ci => (
                    <div
                      key={ci.menuItem.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 12,
                        borderRadius: 12,
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={ci.menuItem.image}
                          alt={ci.menuItem.name}
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: 14, fontWeight: 700 }}>{ci.menuItem.name}</h4>
                          <span style={{ fontSize: 13, color: '#64748B' }}>₹{ci.menuItem.price}</span>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: 16,
                        padding: '3px 8px'
                      }}>
                        <button
                          onClick={() => updateCartQuantity(ci.menuItem.id, ci.quantity - 1)}
                          style={{ color: '#64748B' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(ci.menuItem.id, ci.quantity + 1)}
                          style={{ color: '#F97316' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Type Selector */}
                <div style={{
                  background: '#F8FAFC',
                  padding: 14,
                  borderRadius: 14,
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#334155' }}>
                    Order Type
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {(['TAKEAWAY', 'DINE_IN', 'PRE_ORDER'] as OrderType[]).map(type => {
                      const label = type === 'TAKEAWAY' ? 'Takeaway' : type === 'DINE_IN' ? 'Dine-in' : 'Pre-order';
                      const isSel = orderType === type;
                      return (
                        <button
                          key={type}
                          onClick={() => setOrderType(type)}
                          style={{
                            padding: '8px 4px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: isSel ? 700 : 500,
                            background: isSel ? '#F97316' : '#FFFFFF',
                            color: isSel ? '#FFFFFF' : '#475569',
                            border: `1px solid ${isSel ? '#F97316' : '#CBD5E1'}`
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mode specific inputs */}
                  {orderType === 'DINE_IN' && (
                    <div style={{ marginTop: 12 }}>
                      <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>
                        Table Number:
                      </label>
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={e => setTableNumber(e.target.value)}
                        placeholder="e.g. Table 4"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '1px solid #CBD5E1'
                        }}
                      />
                    </div>
                  )}

                  {orderType === 'PRE_ORDER' && (
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>Pickup Window:</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{pickupSlot}</div>
                      </div>
                      <button
                        onClick={() => setCurrentScreen('pickup')}
                        style={{
                          fontSize: 12,
                          color: '#F97316',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: 6,
                          background: '#FFEDD5'
                        }}
                      >
                        Change Slot
                      </button>
                    </div>
                  )}
                </div>

                {/* Honest ETA Estimate Banner (Spec Section 7.6) */}
                <div style={{
                  background: '#EFF6FF',
                  padding: 14,
                  borderRadius: 14,
                  border: '1px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#3B82F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#1E40AF', fontWeight: 600 }}>Estimated Ready Time</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#1E3A8A' }}>15 – 20 min</div>
                    <div style={{ fontSize: 11, color: '#3B82F6' }}>We'll notify you when it's ready</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart Bottom Checkout */}
          {cart.length > 0 && (
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #E2E8F0',
              background: '#FFFFFF'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 15, color: '#64748B' }}>Total Amount</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>₹{cartTotal}</span>
              </div>
              <button
                onClick={() => {
                  if (orderType === 'PRE_ORDER' && pickupSlot === 'ASAP (15–20 min)') {
                    setCurrentScreen('pickup');
                  } else {
                    setCurrentScreen('payment');
                  }
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)'
                }}
              >
                Continue to Payment ₹{cartTotal}
              </button>
            </div>
          )}
        </div>
      )}

      {/* SCREEN 4: CHOOSE PICKUP TIME (Pre-Order Slot Picker) */}
      {currentScreen === 'pickup' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <button onClick={() => setCurrentScreen('cart')} style={{ color: '#0F172A' }}>
              <ArrowLeft size={18} />
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Choose Pickup Time</h2>
          </div>

          <div style={{ padding: '16px 20px', flex: 1 }}>
            {/* Tabs: Next Available / Schedule Later */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: '#F1F5F9',
              borderRadius: 10,
              padding: 4,
              marginBottom: 20
            }}>
              <button style={{
                padding: '8px 0',
                borderRadius: 8,
                background: '#FFFFFF',
                fontWeight: 700,
                fontSize: 13,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                Next Available
              </button>
              <button style={{
                padding: '8px 0',
                borderRadius: 8,
                color: '#64748B',
                fontSize: 13
              }}>
                Schedule Later
              </button>
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 12 }}>
              Available Slots
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'asap', label: 'ASAP (15–20 min)', desc: 'Fastest turn-around' },
                { id: '30m', label: 'In 30 minutes', desc: 'Leaves 13:02 for 1 km travel' },
                { id: '45m', label: 'In 45 minutes', desc: 'Crisp food hold window' },
                { id: '1h', label: 'In 1 hour', desc: 'Reserved in batch' },
                { id: 'custom', label: 'Custom time', desc: 'Select preferred window' }
              ].map(slot => {
                const isSelected = pickupSlot === slot.label;
                return (
                  <label
                    key={slot.id}
                    onClick={() => setPickupSlot(slot.label)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: `1.5px solid ${isSelected ? '#F97316' : '#E2E8F0'}`,
                      background: isSelected ? '#FFF7ED' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15, fontWeight: isSelected ? 700 : 600, color: '#0F172A' }}>
                        {slot.label}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{slot.desc}</div>
                    </div>
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#F97316' : '#CBD5E1'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isSelected && (
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F97316' }} />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <div style={{
              marginTop: 20,
              padding: 12,
              borderRadius: 10,
              background: '#F8FAFC',
              fontSize: 12,
              color: '#64748B',
              textAlign: 'center'
            }}>
              ✨ We'll prepare your order fresh and notify you when it's ready.
            </div>
          </div>

          <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0' }}>
            <button
              onClick={() => setCurrentScreen('payment')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                color: '#FFFFFF',
                padding: '14px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)'
              }}
            >
              Confirm Slot
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 5: PAYMENT */}
      {currentScreen === 'payment' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <button onClick={() => setCurrentScreen('cart')} style={{ color: '#0F172A' }}>
              <ArrowLeft size={18} />
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Payment</h2>
          </div>

          <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
            {/* Total Card */}
            <div style={{
              background: '#0F172A',
              color: '#FFFFFF',
              borderRadius: 14,
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <div>
                <div style={{ fontSize: 13, color: '#94A3B8' }}>Order Total</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#F97316' }}>₹{cartTotal}</div>
              </div>
              <div style={{ fontSize: 12, color: '#CBD5E1', textAlign: 'right' }}>
                <div>Mode: {orderType}</div>
                <div>{cartItemCount} items</div>
              </div>
            </div>

            {/* Error banner if atomic inventory check failed */}
            {orderError && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #F87171',
                borderRadius: 12,
                padding: '12px 16px',
                color: '#991B1B',
                fontSize: 13,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <AlertCircle size={18} />
                <span>{orderError}</span>
              </div>
            )}

            <div style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 12 }}>
              Choose Payment Method
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'UPI', label: 'UPI (GPay, PhonePe, Paytm, QR)', icon: <QrCode size={18} color="#F97316" /> },
                { id: 'CARD', label: 'Card (Credit / Debit)', icon: <CreditCard size={18} color="#3B82F6" /> },
                { id: 'NETBANKING', label: 'Net Banking', icon: <Banknote size={18} color="#10B981" /> },
                { id: 'CASH', label: 'Pay at Counter (CASH/UPI)', icon: <Store size={18} color="#64748B" /> }
              ].map(method => {
                const isSelected = selectedPaymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id as any)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: `1.5px solid ${isSelected ? '#F97316' : '#E2E8F0'}`,
                      background: isSelected ? '#FFF7ED' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {method.icon}
                      <span style={{ fontSize: 14, fontWeight: isSelected ? 700 : 500 }}>
                        {method.label}
                      </span>
                    </div>
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#F97316' : '#CBD5E1'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isSelected && (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F97316' }} />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#94A3B8' }}>
              🔒 Secure payment powered by Razorpay webhook idempotency
            </div>
          </div>

          <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0' }}>
            <button
              onClick={handleCreateOrder}
              disabled={isSimulatingPayment}
              style={{
                width: '100%',
                background: isSimulatingPayment
                  ? '#94A3B8'
                  : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                color: '#FFFFFF',
                padding: '15px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              {isSimulatingPayment ? (
                <span>Authorizing Payment...</span>
              ) : (
                <span>Pay ₹{cartTotal}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 6: ORDER CONFIRMED & LIVE TRACKING */}
      {currentScreen === 'tracking' && activeOrder && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button onClick={() => setCurrentScreen('menu')} style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowLeft size={16} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Back to Menu</span>
            </button>
            <span style={{ fontSize: 12, color: '#10B981', fontWeight: 700, background: '#ECFDF5', padding: '3px 8px', borderRadius: 12 }}>
              ● Live Tracking
            </span>
          </div>

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            {/* Success Hero */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>Order Confirmed!</h2>
              <p style={{ fontSize: 13, color: '#64748B' }}>Your order has been placed successfully.</p>
            </div>

            {/* Token Card (Token A104 or P-001/T-001/W-001) */}
            <div style={{
              background: '#0F172A',
              color: '#FFFFFF',
              borderRadius: 16,
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
              marginBottom: 20
            }}>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#94A3B8', marginBottom: 4 }}>
                Order Token
              </div>
              <div style={{ fontSize: 44, fontWeight: 900, color: '#F97316', letterSpacing: -1 }}>
                {activeOrder.token}
              </div>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '3px 12px', borderRadius: 20, fontSize: 12, color: '#CBD5E1', marginTop: 4 }}>
                {activeOrder.type} · {activeOrder.channel}
              </div>

              <div style={{ marginTop: 16, borderTop: '1px solid #334155', paddingTop: 14, display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>Estimated Ready Time</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#10B981' }}>{activeOrder.eta.displayRange}</div>
                </div>
                {activeOrder.eta.leaveAtTime && (
                  <div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>Leave at</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#F97316' }}>{activeOrder.eta.leaveAtTime}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Progress Stepper (Order Received -> Preparing -> Ready for Pickup -> Completed) */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 16,
              padding: '16px 20px',
              marginBottom: 20
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: '#334155' }}>
                Kitchen Status
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
                {[
                  {
                    step: 1,
                    title: 'Order Received',
                    time: activeOrder.placedTime,
                    active: true,
                    completed: ['PAID', 'ACCEPTED', 'SCHEDULED', 'COOKING', 'EXPO_CHECK', 'READY', 'COMPLETED'].includes(activeOrder.status)
                  },
                  {
                    step: 2,
                    title: 'Preparing in Kitchen',
                    time: activeOrder.status === 'COOKING' || activeOrder.status === 'EXPO_CHECK' ? 'In progress' : 'Queued',
                    active: ['COOKING', 'ASSEMBLY', 'EXPO_CHECK', 'READY', 'COMPLETED'].includes(activeOrder.status),
                    completed: ['EXPO_CHECK', 'READY', 'COMPLETED'].includes(activeOrder.status)
                  },
                  {
                    step: 3,
                    title: 'Ready for Pickup',
                    time: activeOrder.readyTime || 'Pending',
                    active: ['EXPO_CHECK', 'READY', 'COMPLETED'].includes(activeOrder.status),
                    completed: ['READY', 'COMPLETED'].includes(activeOrder.status)
                  },
                  {
                    step: 4,
                    title: activeOrder.type === 'DINE_IN' ? 'Served at Table' : 'Handed Over',
                    time: activeOrder.completedTime || 'Pending',
                    active: activeOrder.status === 'COMPLETED',
                    completed: activeOrder.status === 'COMPLETED'
                  }
                ].map((st, idx) => (
                  <div key={st.step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: st.completed ? '#10B981' : st.active ? '#F97316' : '#E2E8F0',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {st.completed ? <Check size={16} /> : st.step}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: st.active ? 700 : 500, color: st.active ? '#0F172A' : '#94A3B8' }}>
                        {st.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{st.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-Order Specific Actions: "I'm leaving" & "I'm here" (Spec Section 12.1) */}
            {activeOrder.type === 'PRE_ORDER' && (
              <div style={{
                background: '#FFF7ED',
                border: '1px solid #FFEDD5',
                borderRadius: 14,
                padding: '16px',
                marginBottom: 20
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#C2410C', marginBottom: 4 }}>
                  Pre-Order Arrival Sync
                </div>
                <div style={{ fontSize: 12, color: '#9A3412', marginBottom: 12 }}>
                  Inform kitchen staff so your food is scheduled to finish right when you arrive:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    onClick={() => customerImLeaving(activeOrder.id)}
                    disabled={activeOrder.customerLocation?.hasDeparted}
                    style={{
                      padding: '10px',
                      borderRadius: 10,
                      background: activeOrder.customerLocation?.hasDeparted ? '#CBD5E1' : '#F97316',
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <Navigation size={14} />
                    <span>{activeOrder.customerLocation?.hasDeparted ? "On the way ✓" : "I'm leaving"}</span>
                  </button>

                  <button
                    onClick={() => customerImHere(activeOrder.id)}
                    disabled={activeOrder.customerLocation?.hasArrived}
                    style={{
                      padding: '10px',
                      borderRadius: 10,
                      background: activeOrder.customerLocation?.hasArrived ? '#10B981' : '#EA580C',
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <MapPin size={14} />
                    <span>{activeOrder.customerLocation?.hasArrived ? "At Counter ✓" : "I'm here"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Pickup Instruction */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 13,
              color: '#334155',
              marginBottom: 16
            }}>
              <strong>Collection Note: </strong>
              {activeOrder.type === 'DINE_IN'
                ? `Please take a seat at ${activeOrder.tableNumber || 'your table'}. We'll bring your order directly.`
                : `Collect from Shelf B with your Token ${activeOrder.token}.`}
            </div>

            {/* WhatsApp notification simulated note */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: '#15803D',
              background: '#DCFCE7',
              padding: '10px 14px',
              borderRadius: 10
            }}>
              <MessageCircle size={16} />
              <span>We'll notify you on this screen and via WhatsApp when your order is ready.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
