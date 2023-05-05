import express, { Request, Response, Router, NextFunction } from "express";
import {auth} from '../middleware/auth';
import {createUnit} from '../controllers/item/unit';
// import {register , login } from '../controllers/auth'
const router = express.Router();

router.post('/:item_id',auth, createUnit );
// router.post("/register",register );
// router.post("/login", login);
  
  


  

export default router;