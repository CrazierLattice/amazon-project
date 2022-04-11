import express from 'express';
import data from './data.js';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to DB'))
  .catch((error) => console.log(error));
const app = express();
app.use(cors());

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);

// app.get('/api/products', (req, res) => {
//   console.log('hello');
//   res.send(data.products);
// });
// app.get('/api/products/slug/:slug', (req, res) => {
//   const { slug } = req.params;
//   const product = data.products.find((product) => product.slug == slug);
//   if (product) return res.send(product);
//   res.status(404).json({ message: 'Product Not Found' });
// });
// app.get('/api/products/:id', (req, res) => {
//   const { id } = req.params;
//   const product = data.products.find((product) => product._id == id);
//   if (product) return res.send(product);
//   res.status(404).json({ message: 'Product Not Found' });
// });

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Running on ${port}`));
