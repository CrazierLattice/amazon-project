import express from 'express';
import data from './data.js';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/products', (req, res) => {
  console.log('hello');
  res.send(data.products);
});
app.get('/api/products/slug/:slug', (req, res) => {
  const { slug } = req.params;
  const product = data.products.find((product) => product.slug == slug);
  if (product) return res.send(product);
  res.status(404).json({ message: 'Product Not Found' });
});
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = data.products.find((product) => product._id == id);
  if (product) return res.send(product);
  res.status(404).json({ message: 'Product Not Found' });
});

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Running on ${port}`));