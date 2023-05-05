"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const supplier_1 = require("../controllers/purchase/supplier");
const purchaseInvoice_1 = require("../controllers/purchase/purchaseInvoice");
const purchase_1 = require("../controllers/purchase/purchase");
// import {register , login } from '../controllers/auth'
const router = express_1.default.Router();
router.post('/supplier', auth_1.auth, supplier_1.createSupplier);
router.get('/supplier', auth_1.auth, supplier_1.getSuppliers);
router.post('/purchaseInvoice', auth_1.auth, purchaseInvoice_1.createPurchaseInvoice);
router.post('/', auth_1.auth, purchase_1.createPurchase);
exports.default = router;
//# sourceMappingURL=purchaseRouter.js.map