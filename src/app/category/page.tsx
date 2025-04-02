'use client'
// src/pages/ProductCategoryPage.tsx
import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types/Product';
import './category.css';

const initialProducts: Product[] = [
  { id: 1, name: 'T-shirt', price: 49.99, category: 'Odzież', image: 'https://via.placeholder.com/200' },
  { id: 2, name: 'Słuchawki', price: 199.99, category: 'Elektronika', image: 'https://via.placeholder.com/200' },
  { id: 3, name: 'Zegarek', price: 299.99, category: 'Elektronika', image: 'https://via.placeholder.com/200' },
  { id: 4, name: 'Portfel', price: 79.99, category: 'Akcesoria', image: 'https://via.placeholder.com/200' }
];

const ProductCategoryPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const goToCart = () => {
    window.location.href = '/cart';
  };

  const calculateTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="product-categories-container">
      <div className="cart-icon" onClick={goToCart}>
        🛒 <span className="cart-counter">{calculateTotalCartItems()}</span>
      </div>
      <h1>Kategorie Produktów</h1>
      {Object.entries(
        initialProducts.reduce((acc: { [key: string]: Product[] }, product) => {
          if (!acc[product.category]) acc[product.category] = [];
          acc[product.category].push(product);
          return acc;
        }, {})
      ).map(([category, categoryProducts]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="product-grid">
            {categoryProducts.map(product => (
              <div id={`${product.id}`} key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-card-content">
                  <h3>{product.name}</h3>
                  <p>{product.price.toFixed(2)} zł</p>
                  <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                    Dodaj do koszyka
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCategoryPage;


