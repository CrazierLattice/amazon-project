import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Michael',
      email: 'crazierlattice@gmail.com',
      password: bcrypt.hashSync('1331'),
      isAdmin: true,
    },
    {
      name: 'Mishka',
      email: 'mishka@gmail.com',
      password: bcrypt.hashSync('1331'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Nike Slim Shirt',
      slug: 'nike-slim-shirt',
      category: 'Shirts',
      image: '/images/p1.jpg', // 679px x 829x
      price: 120,
      countInStock: 10,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      name: 'Nike Slim pant',
      slug: 'nike-slim-pant',
      category: 'Pants',
      image: '/images/p2.jpg',
      price: 150,
      countInStock: 0,
      brand: 'Nike',
      rating: 5,
      numReviews: 8,
      description: 'high quality pant',
    },
    {
      name: 'Adidas Slim Pant',
      slug: 'adidas-slim-pant',
      category: 'Pants',
      image: '/images/p3.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Adidas',
      rating: 3,
      numReviews: 10,
      description: 'high quality Pant',
    },
    {
      name: 'Puma Slim Shirt',
      slug: 'puma-slim-Shirt',
      category: 'Shirts',
      image: '/images/p4.jpg',
      price: 90,
      countInStock: 12,
      brand: 'Puma',
      rating: 2.5,
      numReviews: 6,
      description: 'high quality shirt',
    },
  ],
};

export default data;
