import express from 'express';
import Product from '../models/productModel.js';

const productRouter = express.Router();

//Get all products
productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

//Get product by slug
productRouter.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params;
  if (!slug) return res.status(404).send({ message: 'Invalid slug assigned' });

  const product = await Product.findOne({ slug });
  if (!product) return res.status(404).send({ message: 'Product not found' });
  res.send(product);
});

//Get product by ID

productRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).json({ message: 'Invalid product ID' });
  const product = await Product.findById(id);
  if (!product) return res.status(404).send({ message: 'Product not found' });
  res.send(product);
});

export default productRouter;
