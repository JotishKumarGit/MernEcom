import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, createController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, relativeProductController, searchProductController, updateProductController } from '../controllers/productController.js';
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
router.get('/search/:keyword', searchProductController);

// Similar product product details

router.get('/relative-product/:pid/:cid', relativeProductController);

// Category wise product
router.get('/product-category/:slug', productCategoryController);


// payments routes 
// token from brain tree for account verify 
router.get('/braintree/token', braintreeTokenController ) ;

// payments kaise hoga 
router.post('/braintree/payment', requireSignIn, braintreePaymentController);

export default router;

