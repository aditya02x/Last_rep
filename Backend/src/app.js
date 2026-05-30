import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

export default app;