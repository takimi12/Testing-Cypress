'use client'
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      <h1>Lista Produktów</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <span>{product.title}</span> - <span>{product.price} PLN</span>
            <button>Dodaj do koszyka</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
