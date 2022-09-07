const bcrypt = require('bcryptjs');

const data = {
  users: [
    {
      name: 'Usama',
      email: 'iamhafizusama@gmail.com',
      password: bcrypt.hashSync('12345'),
      isAdmin: true,
    },
    {
      name: 'Customer',
      email: 'customer@gmail.com',
      password: bcrypt.hashSync('1234'),
      isAdmin: false,
    },
  ],

  products: [
    {
      title: '1. Handmade Damascus Folding Knife',
      slug: 'handmade-damascus-folding-knife',
      category: 'Damascus Knives',
      price: 200,
      countInStock: 25,
      numReviews: 19,
      rating: '1',
      image: '/images/p1.png',
      description:
        'The Damascus steel blades are reputed to be not only tough but sharp and resilient edge. Damascus steel is placed in layers and heated and fused together by hammering. The steel is folded and this arduous process is repeated until hundreds of layers are achieved.',
    },
    {
      title: '2. Handmade Damascus Folding Knife',
      slug: 'handmade-damascus-folding-knife-2',
      category: 'Damascus Knives',
      price: 250,
      countInStock: 0,
      numReviews: 42,
      rating: '4.8',
      image: '/images/p2.jpeg',
      description:
        'The Damascus steel blades are reputed to be not only tough but sharp and resilient edge. Damascus steel is placed in layers and heated and fused together by hammering. The steel is folded and this arduous process is repeated until hundreds of layers are achieved.',
    },
    {
      title: '3. Handmade Damascus Folding Knife',
      slug: 'handmade-damascus-folding-knife-3',
      category: 'Damascus Knives',
      price: 150,
      countInStock: 48,
      numReviews: 10,
      rating: '4.5',
      image: '/images/p3.jpeg',
      description:
        'The Damascus steel blades are reputed to be not only tough but sharp and resilient edge. Damascus steel is placed in layers and heated and fused together by hammering. The steel is folded and this arduous process is repeated until hundreds of layers are achieved.',
    },
    {
      title: '4. Handmade Damascus Folding Knife',
      slug: 'handmade-damascus-folding-knife-4',
      category: 'Damascus Knives',
      price: 70,
      countInStock: 25,
      numReviews: 38,
      rating: '4.1',
      image: '/images/p4.jpeg',
      description:
        'The Damascus steel blades are reputed to be not only tough but sharp and resilient edge. Damascus steel is placed in layers and heated and fused together by hammering. The steel is folded and this arduous process is repeated until hundreds of layers are achieved.',
    },
  ],
};

module.exports = data;
