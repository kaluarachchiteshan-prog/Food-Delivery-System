import { useState } from 'react';

// Sample mock data for restaurants & food items
const RESTAURANTS = [
  { id: 1, name: 'Burger Palace', cuisine: 'Fast Food', rating: '4.5' },
  { id: 2, name: 'Pizza Heaven', cuisine: 'Italian', rating: '4.8' },
];

const MENU_ITEMS = {
  1: [
    { id: 101, name: 'Cheeseburger', price: 8.99 },
    { id: 102, name: 'French Fries', price: 3.49 },
  ],
  2: [
    { id: 201, name: 'Pepperoni Pizza', price: 14.99 },
    { id: 202, name: 'Garlic Bread', price: 4.99 },
  ]
};

export default function Dashboard({ user }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((currentCart) => [...currentCart, item]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Welcome back, {user?.name || 'Food Lover'}! 🍔</h2>
      <p>Choose a restaurant and order your favorite meal today.</p>

      {!selectedRestaurant ? (
        <div>
          <h3>Available Restaurants</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
            {RESTAURANTS.map((resto) => (
              <div 
                key={resto.id} 
                onClick={() => setSelectedRestaurant(resto)}
                style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', cursor: 'pointer', background: '#fff' }}
              >
                <h4>{resto.name}</h4>
                <p>{resto.cuisine} • ⭐ {resto.rating}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button 
            onClick={() => setSelectedRestaurant(null)}
            style={{ marginBottom: '15px', padding: '6px 12px', cursor: 'pointer' }}
          >
            ← Back to Restaurants
          </button>
          <h3>{selectedRestaurant.name} Menu</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MENU_ITEMS[selectedRestaurant.id].map((food) => (
              <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eee', padding: '10px', borderRadius: '6px' }}>
                <div>
                  <strong>{food.name}</strong>
                  <p style={{ margin: '5px 0 0', color: '#666' }}>${food.price.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => addToCart(food)}
                  style={{ background: '#2ed573', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Section */}
      <div style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '15px' }}>
        <h3>🛒 Your Cart ({cart.length} items)</h3>
        {cart.length === 0 ? (
          <p style={{ color: '#777' }}>Your cart is empty.</p>
        ) : (
          <div>
            <ul>
              {cart.map((item, index) => (
                <li key={index}>{item.name} - ${item.price.toFixed(2)}</li>
              ))}
            </ul>
            <h4>Total: ${calculateTotal()}</h4>
            <button 
              onClick={() => { alert('Order placed successfully!'); setCart([]); }}
              style={{ background: '#ff4757', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}