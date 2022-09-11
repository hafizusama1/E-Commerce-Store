const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { isAuth, isAdmin } = require('../middlewares/auth');

router.get('/', productController.getAllProducts);

router.post('/', isAuth, isAdmin, productController.addNewProduct);

router.put('/:id', isAuth, isAdmin, productController.editProduct);

router.delete('/:id', isAuth, isAdmin, productController.deleteProduct);

router.get('/admin', isAuth, isAdmin, productController.showAdminProducts);

router.get('/search', productController.searchProduct);

router.get('/categories', productController.getProductsByCategory);

router.get('/slug/:slug', productController.getSingleProduct);

router.get('/:id', productController.getProductById);

module.exports = router;
