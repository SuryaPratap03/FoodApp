import express from 'express';
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';
import { dishRouter } from './routes/dishes.js';
import  categoryRouter  from './routes/category.js';
import cors from 'cors';
import UserRouter from './routes/user.js';
import FavouriteRouter from './routes/favourites.js';
import cookieParser from 'cookie-parser';
import CartRouter from './routes/cart.js';
import AdminRouter from './routes/admin.js';

configDotenv();

const app = express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));
mongoose.connect(process.env.DB)
.then(()=>{
    console.log('Database Connected');
})
.catch((error)=>{
    console.log(error);
})

app.use(express.json());
app.use(cookieParser());

app.use('/api',dishRouter);
app.use('/api',categoryRouter);
app.use('/api',UserRouter);
app.use('/api',FavouriteRouter);
app.use('/api',CartRouter);
app.use('/api/admin',AdminRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server started at PORT ${process.env.PORT}`);
})
