
import dotenv from 'dotenv';
// configure env
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoute from './routes/productRoute.js';
import cors from 'cors';

// rest object
const app = express();

// Database config
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


//routes auth and users 
app.use('/api/v1/auth', authRoute);
// Category Routes 
app.use('/api/v1/category', categoryRoutes);
// route for product 
app.use('/api/v1/product', productRoute);

// rest api
app.get('/', (req, res) => {
    res.send({ message: 'Welcome to ecom app' })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on mode ${process.env.DEV_MODE} port ${PORT}`);
})

