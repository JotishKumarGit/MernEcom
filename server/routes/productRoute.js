import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { createController, deleteProductController, getProductController, getSingleProductController, productCountController, productFilterController, productListController, productPhotoController, searchProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

// routes 
router.post('/create-product', requireSignIn, isAdmin, formidable(), createController)
// get products
router.get('/get-product', getProductController);
// single product
router.get('/get-product/:slug', getSingleProductController);

// get product photo
router.get('/product-photo/:pid', productPhotoController);
// delete product
router.delete('/delete-product/:pid', deleteProductController);
// update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

// Filter price route 
router.post('/product-filters', productFilterController);

// product count 
router.get('/product-count', productCountController);

// product per page 
router.get(`/product-list/:page`, productListController);

// search product
router.get('/search', searchProductController);





export default router;

