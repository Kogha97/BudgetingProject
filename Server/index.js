import express from 'express';
import connectDB from './utils/connectDB.js';
import dotenv from 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan'; 
import userRoutes from './routes/userRoutes.js';
import bankingRoutes from './routes/bankingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(cookieParser())
app.use(morgan('dev'));
app.use(express.json());


app.use("/users", userRoutes)
app.use("/banking", bankingRoutes)
app.use(authRoutes)


connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
