'use client'
// src/pages/CartPage.tsx
import React, { useState, useEffect } from 'react';
import { CartItem } from '../types/Product';
import './Cart.css';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    setTotal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }, [cart]);

  const changeQuantity = (productId: number, change: number) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.id === productId
            ? { ...item, quantity: Math.max(item.quantity + change, 1) }
            : item
        )
    );
  };

  const removeItem = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Twój koszyk</h1>
      </div>
      <div className="cart-items">
        {cart.map(item => (
          <div id={`${item.id}`} key={item.id} className="cart-item">
            <div className="cart-item-details">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div>
                <h3>{item.name}</h3>
                <p data-cy={`price-${item.id}`}>{item.price.toFixed(2)} zł</p>
              </div>
            </div>
            <div className="quantity-control">
              <button className="quantity-btn" onClick={() => changeQuantity(item.id, -1)}>-</button>
              <span className="quantity-value" data-cy={`${item.id}`}>

                {item.quantity}</span>
              <button className="quantity-btn" onClick={() => changeQuantity(item.id, 1)}>+</button>
              <button data-cy={`remove-id-${item.id}`} className="remove-btn" onClick={() => removeItem(item.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      <div
      data-cy={`sum`} 
      className="cart-total">Suma: {total.toFixed(2)} zł</div>
    </div>
  );
};

export default CartPage;