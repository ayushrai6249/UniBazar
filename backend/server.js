import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import './config/cloudinary.js';
import userRoutes from './routes/userRouter.js';
import itemRouter from './routes/itemRouter.js';
import adminRouter from './routes/adminRouter.js';
import msgRouter from './routes/messageRouter.js';

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cors());
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});
app.use('/api/users', userRoutes);
app.use('/api/items', itemRouter);
app.use('/api/admin', adminRouter);
app.use('/api/message', msgRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
