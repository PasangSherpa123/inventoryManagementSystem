import express, { Request, Response, Router, NextFunction } from "express";
import {auth} from '../middleware/auth';
import {
    createItem,
    getItems
} from '../controllers/item/item';
import {
    createUnit
 } from '../controllers/item/unit';
import {
    createCompany
} from '../controllers/item/company';
import {
    createCategory
} from '../controllers/item/category';
// import {register , login } from '../controllers/auth'
const router = express.Router();

router.post('/',auth, createItem );
router.get('/',auth,getItems);
router.post('/unit/:item_id',auth,createUnit);
router.post('/company', auth, createCompany);
router.post('/category', auth, createCategory);



export default router;
