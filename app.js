const express = require('express');
const app = express();
const port = 3000;

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Parse incoming request body as JSON
app.use(express.json());

// In-memory product data
let products = [
  { id: 1, name: 'Laptop', description: 'High-performance laptop', price: 1000 },
  { id: 2, name: 'Smartphone', description: 'Latest model smartphone', price: 700 },
  { id: 3, name: 'Headphones', description: 'Noise-cancelling headphones', price: 150 }
];

// In-memory shopping cart (temporary solution, for simplicity)
let cart = [];

// Home Route - Displays all products
app.get('/', (req, res) => {
  let productHTML = products.map(product => {
    return `<div class="product">
              <h2>${product.name}</h2>
              <p>${product.description}</p>
              <p>Price: $${product.price}</p>
              <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>`;
  }).join('');

  res.send(`
    <html>
      <head>
        <title>E-Commerce Site</title>
        <link rel="stylesheet" type="text/css" href="/styles.css">
      </head>
      <body>
        <h1>Welcome to our E-Commerce Site</h1>
        <div id="products">${productHTML}</div>
        <div>
          <a href="/cart">Go to Cart</a>
        </div>
        <script>
          function addToCart(productId) {
            fetch('/add-to-cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId })
            }).then(response => {
              console.log('Product added to cart');
            });
          }
        </script>
      </body>
      <style>
      body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
  }
  
  h1 {
    text-align: center;
  }
  
  #products {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .product {
    background-color: #fff;
    border: 1px solid #ddd;
    margin: 10px;
    padding: 20px;
    width: 200px;
    text-align: center;
  }
  
  .cart-item {
    background-color: #fff;
    margin: 10px;
    padding: 10px;
    border: 1px solid #ddd;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  a {
    display: inline-block;
    margin-top: 10px;
    text-decoration: none;
    color: #007bff;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
    </html>
  `);
});

// Add item to cart
app.post('/add-to-cart', (req, res) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === productId);

  if (product) {
    cart.push(product);
    res.status(200).send('Product added to cart');
  } else {
    res.status(400).send('Product not found');
  }
});

// Cart Route - Displays the cart
app.get('/cart', (req, res) => {
  let cartHTML = cart.map(item => {
    return `<div class="cart-item">
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              <p>Price: $${item.price}</p>
            </div>`;
  }).join('');

  let total = cart.reduce((sum, item) => sum + item.price, 0);

  res.send(`
    <html>
      <head>
        <title>Your Cart</title>
        <link rel="stylesheet" type="text/css" href="/styles.css">
      </head>
      <body>
        <h1>Your Shopping Cart</h1>
        <div id="cart">${cartHTML}</div>
        <p>Total: $${total}</p>
        <div>
          <a href="/">Continue Shopping</a>
          <a href="/checkout">Proceed to Checkout</a>
        </div>
      </body>
    </html>
  `);
});

// Checkout Route - Displays the checkout page
app.get('/checkout', (req, res) => {
  let cartHTML = cart.map(item => {
    return `<div class="cart-item">
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              <p>Price: $${item.price}</p>
            </div>`;
  }).join('');

  let total = cart.reduce((sum, item) => sum + item.price, 0);

  res.send(`
    <html>
      <head>
        <title>Checkout</title>
      </head>       
      <body>
        <h1>Checkout</h1>
        <div id="checkout">${cartHTML}</div>
        <p>Total: $${total}</p>
        <button onclick="alert('Order placed!')">Place Order</button>
        <a href="/cart">Back to Cart</a>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
