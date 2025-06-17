import express from 'express';
import { registerController, loginController, testController, forgotPasswordController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';

// router object
const router = express.Router();


// routing
// Register || Method Post
router.post('/register', registerController);

// LOGIN || POST
router.post('/login', loginController);

// Forget password
router.post('/forgot-password', forgotPasswordController);

// Protected auth route  user || get
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

// Admin Routes || get
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

// test routes
router.get('/test', requireSignIn, isAdmin, testController);

export default router;
