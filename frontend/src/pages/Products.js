import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Products = () => {
    const { token } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", stock: "" });
    const [editProduct, setEditProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/products");
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("[Frontend] Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // ✅ Add new product (Protected)
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.stock) {
            alert("Please fill all fields!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/products",
                newProduct,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );

            setProducts([...products, response.data]);
            setNewProduct({ name: "", price: "", description: "", stock: "" });
        } catch (error) {
            console.error("[Frontend] Error adding product:", error);
            alert("Failed to add product! Ensure you are logged in.");
        }
    };

    // ✅ Edit existing product (Protected)
    const handleEditProduct = async (e) => {
        e.preventDefault();
        if (!editProduct.name || !editProduct.price || !editProduct.description || !editProduct.stock) {
            alert("Please fill all fields!");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/products/${editProduct._id}`,
                editProduct,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );

            setProducts(products.map(p => (p._id === editProduct._id ? response.data : p)));
            setEditProduct(null);
        } catch (error) {
            console.error("[Frontend] Error updating product:", error);
            alert("Failed to update product!");
        }
    };

    // ✅ Delete product (Protected)
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProducts(products.filter(p => p._id !== productId));
            alert("Product deleted successfully!");
        } catch (error) {
            console.error("[Frontend] Error deleting product:", error);
            alert("Failed to delete product.");
        }
    };

    // ✅ Add product to cart (Prevent exceeding stock)
    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existingProduct = cart.find(item => item._id === product._id);

        if (existingProduct) {
            if (existingProduct.quantity < product.stock) {
                existingProduct.quantity += 1;
            } else {
                alert("Not enough stock available!");
                return;
            }
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart!");
    };

    if (loading) return <p>Loading products...</p>;

    return (
        <div>
            <h2>Products</h2>

            {/* ✅ Form to add a new product */}
            {token && !editProduct && (
                <form onSubmit={handleAddProduct}>
                    <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
                    <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
                    <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} required />
                    <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} required />
                    <button type="submit">Add Product</button>
                </form>
            )}

            {/* ✅ Form to edit a product */}
            {token && editProduct && (
                <form onSubmit={handleEditProduct}>
                    <input type="text" placeholder="Product Name" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} required />
                    <input type="number" placeholder="Price" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} required />
                    <input type="text" placeholder="Description" value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} required />
                    <input type="number" placeholder="Stock" value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })} required />
                    <button type="submit">Update Product</button>
                    <button type="button" onClick={() => setEditProduct(null)}>Cancel</button>
                </form>
            )}

            {/* ✅ Display products */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {products.map((product) => (
                    <div key={product._id} style={{ border: "1px solid #ddd", padding: "10px" }}>
                        <h3>{product.name}</h3>
                        <p>${product.price.toFixed(2)}</p>
                        <p>{product.description}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <button onClick={() => addToCart(product)}>Add to Cart</button>

                        {/* ✅ Allow Editing & Deleting for Owners */}
                        {token && (
                            <>
                                <button onClick={() => setEditProduct(product)}>Edit</button>
                                <button onClick={() => handleDeleteProduct(product._id)} style={{ backgroundColor: "red", color: "white" }}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
