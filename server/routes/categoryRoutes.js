import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/createCategoryController.js';

const router = express.Router();

// routes 
// Create Category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);
// update category 
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);
// Get all category
router.get('/get-category', categoryController);
// Single Category controller 
router.get('/single-category/:slug', singleCategoryController);
// Delete category 
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)

export default router;

