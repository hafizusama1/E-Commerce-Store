const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.get('/', productController.getAllProducts);

router.get('/search', productController.searchProduct);

router.get('/categories', productController.getProductsByCategory);

router.get('/slug/:slug', productController.getSingleProduct);

router.get('/:id', productController.getProductById);

module.exports = router;
