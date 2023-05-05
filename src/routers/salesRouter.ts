import express, { Request, Response, Router, NextFunction } from "express";
import {auth} from '../middleware/auth';



import {
    createCustomer,
    getCustomers,
} from '../controllers/sales/customer';
import{
    createSalesInvoice
} from '../controllers/sales/salesInvoice';
import {
    createSales
} from "../controllers/sales/sales";



const router = express.Router();



router.post('/customer',auth, createCustomer );
router.get('/customer',auth,getCustomers);
router.post('/salesInvoice',auth,createSalesInvoice);
router.post('/',auth,createSales);




export default router;