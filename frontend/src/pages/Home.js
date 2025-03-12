import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to the Scalable E-Commerce Platform!</h1>
      <p>Browse our products and place orders easily.</p>
      <Link to="/products">
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>View Products</button>
      </Link>
    </div>
  );
};

export default Home;
