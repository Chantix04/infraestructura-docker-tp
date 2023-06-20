import { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  useEffect(() => {
    if (showProducts) {
      fetch('http://localhost:4000/productos')
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error(error));
    }
  }, [showProducts]);

  const handleShowProducts = () => {
    setShowProducts(true);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleAddProduct = () => {
    const newProduct = {
      nombre: productName,
      precio: parseFloat(productPrice).toFixed(2),
    };
  
    fetch('http://localhost:4000/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts([...products, data]);
        setShowForm(false);
        setProductName('');
        setProductPrice('');
  
        // Actualizar la lista de productos estableciendo showProducts en true
        handleShowProducts()
      })
      .catch((error) => console.error(error));
  };
  
  
  return (
    <div>
      <h1>Lista de Productos</h1>
      {!showProducts && (
        <button onClick={handleShowProducts}>Mostrar Productos</button>
      )}
      {showProducts && (
        <div>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <strong>{product.nombre}</strong> - {product.precio}
              </li>
            ))}
          </ul>
          {!showForm && (
            <button onClick={handleShowForm}>Cargar Productos</button>
          )}
          {showForm && (
            <div>
              <h2>Cargar Producto</h2>
              <form onSubmit={handleAddProduct}>
                <label>
                  Nombre del Producto:
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Precio del Producto:
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </label>
                <br />
                <button type="submit">Agregar</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
