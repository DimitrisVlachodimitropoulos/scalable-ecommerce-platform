import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    if (token) fetchProducts();
  }, [token]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Products</h2>
      <ul>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <li key={product._id}>
              <strong>{product.name}</strong> - ${product.price}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Products;
