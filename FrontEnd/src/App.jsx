import { useMemo, useState } from 'react';
import Auth from './components/Auth';
import './App.css';

const FOOD = [
  {
    id: 1,
    name: 'Truffle mushroom melt',
    restaurant: 'The Good Burger',
    category: 'Burgers',
    price: 14.5,
    rating: '4.9',
    time: '20–30 min',
    tag: 'Bestseller',
    image: 'photo-1568901346375-23c9450c58cd',
    description: 'Double smash patty, wild mushrooms, truffle aioli & Swiss.',
  },
  {
    id: 2,
    name: 'Hot honey pepperoni',
    restaurant: 'Pizzeria Luca',
    category: 'Pizza',
    price: 18,
    rating: '4.8',
    time: '25–35 min',
    tag: 'Fan favorite',
    image: 'photo-1579751626657-72bc17010498',
    description: 'Wood-fired crust, spicy pepperoni, whipped ricotta & hot honey.',
  },
  {
    id: 3,
    name: 'Crispy salmon bowl',
    restaurant: 'Little Green',
    category: 'Healthy',
    price: 16.75,
    rating: '4.9',
    time: '15–25 min',
    tag: 'Fresh pick',
    image: 'photo-1512621776951-a57141f2eefd',
    description: 'Sushi rice, crispy salmon, avocado, edamame & sesame dressing.',
  },
  {
    id: 4,
    name: 'Creamy pesto rigatoni',
    restaurant: 'Pasta Social',
    category: 'Pasta',
    price: 17.25,
    rating: '4.7',
    time: '20–30 min',
    tag: 'House made',
    image: 'photo-1473093295043-cdd812d0e601',
    description: 'Fresh rigatoni tossed with basil pesto, parmesan & toasted pine nuts.',
  },
  {
    id: 5,
    name: 'Crispy chicken sandwich',
    restaurant: 'The Good Burger',
    category: 'Burgers',
    price: 13.25,
    rating: '4.8',
    time: '20–30 min',
    tag: 'Bestseller',
    image: 'photo-1606755962773-d324e0a13086',
    description: 'Buttermilk fried chicken, crunchy pickles & tangy house sauce.',
  },
  {
    id: 6,
    name: 'Garden party flatbread',
    restaurant: 'Pizzeria Luca',
    category: 'Pizza',
    price: 15.5,
    rating: '4.6',
    time: '20–30 min',
    tag: 'Veggie',
    image: 'photo-1571407970349-bc81e7e96d47',
    description: 'Roasted peppers, basil, mozzarella & a bright tomato sauce.',
  },
  {
    id: 7,
    name: 'Golden chicken tenders',
    restaurant: 'Bird & Batter',
    category: 'Comfort food',
    price: 12.5,
    rating: '4.8',
    time: '15–25 min',
    tag: 'Crowd pleaser',
    image: 'photo-1562967914-608f82629710',
    description: 'Hand-breaded, extra crispy tenders with our signature dip.',
  },
  {
    id: 8,
    name: 'Strawberry cloud pancakes',
    restaurant: 'Sunday Morning',
    category: 'Breakfast',
    price: 11.75,
    rating: '4.9',
    time: '20–30 min',
    tag: 'Sweet treat',
    image: 'photo-1528207776546-365bb710ee93',
    description: 'Fluffy buttermilk pancakes, fresh strawberries & maple cream.',
  },
];

const CATEGORIES = [
  { name: 'All dishes', emoji: '🍽️' },
  { name: 'Burgers', emoji: '🍔' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Healthy', emoji: '🥑' },
  { name: 'Pasta', emoji: '🍝' },
  { name: 'Comfort food', emoji: '🍗' },
  { name: 'Breakfast', emoji: '🥞' },
];

const money = (value) => `$${value.toFixed(2)}`;
const imageUrl = (id, width = 700) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('crave-cart') || '[]');
    } catch {
      return [];
    }
  });
  const [activeCategory, setActiveCategory] = useState('All dishes');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [toast, setToast] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [order, setOrder] = useState(null);

  const filteredFood = useMemo(() => FOOD.filter((item) => {
    const matchesCategory = activeCategory === 'All dishes' || item.category === activeCategory;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${item.name} ${item.restaurant} ${item.category} ${item.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }), [activeCategory, search]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 35 ? 0 : 2.99;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + delivery + subtotal * 0.08 - discount;
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const updateCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem('crave-cart', JSON.stringify(nextCart));
  };

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const addToCart = (food) => {
    const existing = cart.find((item) => item.id === food.id);
    updateCart(existing
      ? cart.map((item) => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...food, quantity: 1 }]);
    notify(`${food.name} added to your bag`);
  };

  const changeQuantity = (id, amount) => {
    updateCart(cart
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0));
  };

  const handleLogin = (token, loggedInUser) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setAuthOpen(false);
    notify(`Welcome${loggedInUser?.name ? `, ${loggedInUser.name.split(' ')[0]}` : ' back'}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    notify('You have been signed out');
  };

  const placeOrder = (event) => {
    event.preventDefault();
    if (!cart.length) return;
    const form = new FormData(event.currentTarget);
    setOrder({
      number: Math.floor(100000 + Math.random() * 900000),
      name: form.get('name'),
      address: form.get('address'),
      items: itemCount,
      eta: '25–35 minutes',
    });
    updateCart([]);
    setCheckout(false);
    setCartOpen(false);
    setCouponApplied(false);
    setCoupon('');
  };

  const scrollToMenu = () => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="app-shell">
      <div className="announcement">
        <span className="announcement-sparkle">✳</span>
        Good food, better days. <strong>Free delivery on orders over $35</strong>
        <span className="announcement-sparkle">✳</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Crave home">
          <span className="brand-mark">c<span>.</span></span>
          <span className="brand-name">crave<span>club</span></span>
        </a>
        <button className="delivery-location" onClick={() => notify('Delivering to Brooklyn, NY')}>
          <span className="location-icon">⌖</span>
          <span><small>Delivering to</small><strong>Brooklyn, NY <b>⌄</b></strong></span>
        </button>
        <nav className="header-links" aria-label="Main navigation">
          <a className="nav-link active" href="#menu">Explore</a>
          <a className="nav-link" href="#how-it-works">How it works</a>
        </nav>
        <div className="header-actions">
          {user ? (
            <button className="user-button" onClick={handleLogout} title="Sign out">
              <span className="avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              <span className="user-name">{user.name?.split(' ')[0] || 'Account'}</span>
              <span className="logout-hint">· Sign out</span>
            </button>
          ) : (
            <button className="login-button" onClick={() => { setAuthMode('login'); setAuthOpen(true); }}>Log in</button>
          )}
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Open bag, ${itemCount} items`}>
            <span className="bag-icon">♧</span><span className="bag-label">Your bag</span>
            <span className="bag-count">{itemCount}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEIGHBORHOOD, DELIVERED</div>
            <h1>A little joy.<br />Right to your <span>door.</span></h1>
            <p>Good food from the spots you love, and the ones you’re about to. Delivered while it’s still delicious.</p>
            <button className="primary-button hero-cta" onClick={scrollToMenu}>Find your next favorite <span>↗</span></button>
            <div className="hero-social-proof">
              <div className="avatar-stack"><span>👩🏽</span><span>👨🏻</span><span>👩🏼</span></div>
              <span><strong>12k+ happy neighbors</strong><small>and counting in Brooklyn</small></span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-image-wrap">
              <img src={imageUrl('photo-1565299624946-b28f40a0ae38', 1200)} alt="Freshly baked pizza topped with basil" />
            </div>
            <div className="hero-image-label"><span>✦</span> Made with a little extra love</div>
            <div className="floating-note note-rating"><span>★</span><strong>4.9</strong><small> neighborhood rating</small></div>
            <div className="floating-note note-delivery"><span className="delivery-emoji">🛵</span><span><strong>At your door</strong><small>in about 25 min</small></span></div>
            <span className="hero-squiggle">✳</span>
          </div>
          <div className="hero-bottom-note"><span>✳</span> REAL LOCAL FAVORITES <span className="note-divider">/</span> DELIVERED WITH CARE <span>✳</span></div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-topline">
            <div>
              <div className="eyebrow">A VERY GOOD PLACE TO START</div>
              <h2>What sounds <span>good?</span></h2>
            </div>
            <div className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Search dishes and restaurants"
                placeholder="Dishes, restaurants, cravings..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && <button onClick={() => setSearch('')} aria-label="Clear search">×</button>}
              {!search && <kbd>⌘ K</kbd>}
            </div>
          </div>

          <div className="category-list" role="group" aria-label="Filter by food category">
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                className={`category-chip ${activeCategory === category.name ? 'selected' : ''}`}
                onClick={() => setActiveCategory(category.name)}
              >
                <span>{category.emoji}</span>{category.name}
              </button>
            ))}
          </div>

          <div className="food-grid">
            {filteredFood.map((food) => (
              <article className="food-card" key={food.id}>
                <div className="food-image-wrap">
                  <img src={imageUrl(food.image)} alt={food.name} loading="lazy" />
                  <span className="food-tag">{food.tag}</span>
                  <button className="favorite-button" aria-label={`Save ${food.name}`} onClick={(event) => {
                    event.currentTarget.classList.toggle('is-favorite');
                    notify('Saved to your favorites');
                  }}>♡</button>
                </div>
                <div className="food-card-content">
                  <div className="food-title-row"><h3>{food.name}</h3><strong>{money(food.price)}</strong></div>
                  <p className="food-description">{food.description}</p>
                  <div className="food-meta"><span>{food.restaurant}</span><i /> <span>★ {food.rating}</span><i /> <span>{food.time}</span></div>
                  <button className="add-button" onClick={() => addToCart(food)}><span>+</span> Add to bag</button>
                </div>
              </article>
            ))}
          </div>
          {!filteredFood.length && (
            <div className="empty-results"><span>🥣</span><h3>No bites found just yet.</h3><p>Try another search or choose a different category.</p><button onClick={() => { setSearch(''); setActiveCategory('All dishes'); }}>Show me everything</button></div>
          )}
        </section>

        <section className="promise-section" id="how-it-works">
          <div className="promise-heading"><div className="eyebrow">THE CRAVE CLUB WAY</div><h2>Good food. <span>No fuss.</span></h2><p>A neighborhood favorite, from first tap to first bite.</p></div>
          <div className="promise-grid">
            <div className="promise-card"><span className="promise-icon">⌕</span><span className="promise-number">01</span><h3>Find your thing</h3><p>Browse the best local kitchens, picked with your cravings in mind.</p></div>
            <div className="promise-card"><span className="promise-icon">♡</span><span className="promise-number">02</span><h3>Make it yours</h3><p>Choose your favorites, add a little extra, and we’ll handle the details.</p></div>
            <div className="promise-card"><span className="promise-icon">↗</span><span className="promise-number">03</span><h3>Dig right in</h3><p>We bring it to your door fresh, fast, and ready for that first bite.</p></div>
          </div>
        </section>

        <section className="bottom-cta">
          <div><span className="eyebrow">YOUR NEXT GREAT MEAL IS RIGHT HERE</span><h2>Go on, get a little <span>crave-y.</span></h2></div>
          <button className="primary-button" onClick={scrollToMenu}>Explore the menu <span>↗</span></button>
          <span className="cta-doodle">✳</span>
        </section>
      </main>

      <footer className="site-footer"><a className="brand footer-brand" href="#top"><span className="brand-mark">c<span>.</span></span><span className="brand-name">crave<span>club</span></span></a><p>Good food brings us together.</p><span>Made for your neighborhood <span className="footer-heart">♥</span></span><small>© 2026 Crave Club</small></footer>

      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}

      {cartOpen && (
        <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) { setCartOpen(false); setCheckout(false); } }}>
          <aside className="cart-drawer" aria-label="Your bag">
            <div className="drawer-header"><div><div className="eyebrow">{checkout ? 'ALMOST TIME TO EAT' : 'THE GOOD STUFF'}</div><h2>{checkout ? 'Delivery details' : 'Your bag'} <span>({itemCount})</span></h2></div><button className="close-button" onClick={() => { setCartOpen(false); setCheckout(false); }} aria-label="Close bag">×</button></div>
            {!cart.length ? (
              <div className="empty-cart"><span>🥡</span><h3>Your bag’s looking a little hungry.</h3><p>Let’s fix that with something delicious.</p><button className="primary-button" onClick={() => { setCartOpen(false); scrollToMenu(); }}>Explore the menu <span>↗</span></button></div>
            ) : checkout ? (
              <form className="checkout-form" onSubmit={placeOrder}>
                <p className="checkout-intro">Where should we bring all that goodness?</p>
                <label>Your name<input name="name" autoComplete="name" defaultValue={user?.name || ''} placeholder="Alex Morgan" required /></label>
                <label>Delivery address<input name="address" autoComplete="street-address" placeholder="123 Your Street, Apt 4" required /></label>
                <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="(555) 123-4567" required /></label>
                <label>Delivery note <span className="optional">(optional)</span><textarea name="note" rows="2" placeholder="Gate code, leave at the door..." /></label>
                <button className="primary-button checkout-submit" type="submit">Place order · {money(total)} <span>↗</span></button>
                <button className="back-to-bag" type="button" onClick={() => setCheckout(false)}>← Back to your bag</button>
              </form>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={imageUrl(item.image, 240)} alt="" />
                      <div className="cart-item-info"><h3>{item.name}</h3><p>{item.restaurant}</p><strong>{money(item.price * item.quantity)}</strong><div className="quantity-control"><button onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button></div></div>
                    </div>
                  ))}
                </div>
                <div className="cart-bottom">
                  <div className="free-delivery-note">{subtotal >= 35 ? '✨ You unlocked free delivery!' : `Add ${money(35 - subtotal)} more for free delivery`}</div>
                  <div className="coupon-entry"><input aria-label="Promo code" placeholder="Got a promo code?" value={coupon} onChange={(event) => { setCoupon(event.target.value); setCouponApplied(false); }} /><button onClick={() => {
                    if (coupon.trim().toUpperCase() === 'CRAVE10') { setCouponApplied(true); notify('10% off — nice one!'); }
                    else notify('Try code CRAVE10 for 10% off');
                  }}>Apply</button></div>
                  {couponApplied && <div className="coupon-success">CRAVE10 applied — 10% off</div>}
                  <div className="totals"><div><span>Subtotal</span><span>{money(subtotal)}</span></div><div><span>Delivery</span><span>{delivery === 0 ? 'Free' : money(delivery)}</span></div><div><span>Estimated tax</span><span>{money(subtotal * 0.08)}</span></div>{couponApplied && <div><span>Discount</span><span>−{money(discount)}</span></div>}<div className="total-line"><strong>Total</strong><strong>{money(total)}</strong></div></div>
                  <button className="primary-button checkout-button" onClick={() => setCheckout(true)}>Continue to checkout <span>↗</span></button>
                  <div className="secure-note">🔒 &nbsp;Safe, simple, and straight to your door.</div>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {authOpen && (
        <div className="overlay auth-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthOpen(false); }}>
          <div className="auth-modal"><button className="close-button auth-close" onClick={() => setAuthOpen(false)} aria-label="Close">×</button><div className="auth-brand">c<span>.</span></div><Auth initialMode={authMode} onLoginSuccess={handleLogin} onModeChange={setAuthMode} /></div>
        </div>
      )}

      {order && (
        <div className="overlay order-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setOrder(null); }}>
          <div className="order-modal"><button className="close-button order-close" onClick={() => setOrder(null)} aria-label="Close">×</button><div className="order-confetti">✳</div><div className="eyebrow">THAT WAS A GOOD CHOICE</div><h2>It’s happening<span>.</span></h2><p>Thanks, {order.name}! Your order is being made fresh and will be at your door in about <strong>{order.eta}</strong>.</p><div className="order-details"><span>ORDER NUMBER</span><strong>#{order.number}</strong><span>DELIVERING TO</span><strong>{order.address}</strong></div>          <div className="order-status"><span>✓</span><div><strong>Order confirmed</strong><small>{order.items} delicious {order.items === 1 ? 'item is' : 'items are'} on their way to the kitchen</small></div><b>● ● ●</b></div><button className="primary-button" onClick={() => setOrder(null)}>Sounds delicious <span>↗</span></button><small className="demo-order-note">Demo order · Connect a backend to accept real orders</small></div>
        </div>
      )}
    </div>
  );
}

export default App;
