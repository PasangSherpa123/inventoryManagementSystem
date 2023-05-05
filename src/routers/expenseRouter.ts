

import express from "express";
import {auth} from '../middleware/auth';
import { createExpense } from "../controllers/expenses/createExpense";

const router = express.Router();

router.post('/',auth,createExpense);

export default router;