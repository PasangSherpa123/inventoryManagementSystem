import express, { Request, Response, Router, NextFunction } from "express";
import {auth} from '../middleware/auth';
import {
    createPayment,
    getPayments
} from '../controllers/paymentMethods/paymentMethod';
import { createPurchasePayment } from "../controllers/purchase/purchasePayment";
import { createSalesPayment } from "../controllers/sales/SalesPayment";
import { createExpensePayment } from "../controllers/expenses/expensePayment";
const router = express.Router();

router.post('/',auth, createPayment );
router.get('/',auth,getPayments);
router.post('/purchase',auth,createPurchasePayment);
router.post('/sales',auth, createSalesPayment);
router.post('/expense', auth, createExpensePayment);

export default router;
