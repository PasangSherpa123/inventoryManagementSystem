

import express, { Request, Response, Router, NextFunction } from "express";
import {auth} from '../middleware/auth';
import {
    createSupplier,
    getSuppliers,
} from '../controllers/purchase/supplier';
import{
    createPurchaseInvoice
} from '../controllers/purchase/purchaseInvoice';
import {
    createPurchase
} from "../controllers/purchase/purchase"
// import {register , login } from '../controllers/auth'
const router = express.Router();

router.post('/supplier',auth, createSupplier );
router.get('/supplier',auth,getSuppliers);
router.post('/purchaseInvoice',auth,createPurchaseInvoice);
router.post('/',auth,createPurchase);

export default router;
