//importing packages for creating server
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


//importing Routing files 
import UserRoutes from './routers/userRouter';
import ItemRoutes from './routers/itemRouter';
import UnitRoutes from './routers/unitRouter';
import PurchaseRoutes from './routers/purchaseRouter';
import PaymentRoutes from './routers/paymentRouter';
import SalesRoutes from './routers/salesRouter';
import ExpenseRoutes from './routers/expenseRouter';






const app = express();

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

//middlewares;
dotenv.config();
app.use(express.json());
app.use(cors());


app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/item', ItemRoutes);
app.use('/api/v1/unit', UnitRoutes);
app.use('/api/v1/purchase', PurchaseRoutes);
app.use('/api/v1/sales',SalesRoutes);
app.use('/api/v1/payment', PaymentRoutes);
app.use('/api/v1/expense', ExpenseRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});