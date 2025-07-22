import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import tasksRoutes from './routes/tasks.routes.js'
import peopleRoutes from './routes/people.routes.js'
import testsRoutes from './routes/tests.routes.js'
import cors from 'cors'


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', tasksRoutes);
app.use('/api', peopleRoutes);
app.use('/api',testsRoutes);





export default app;