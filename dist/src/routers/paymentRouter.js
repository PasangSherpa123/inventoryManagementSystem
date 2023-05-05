"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const paymentMethod_1 = require("../controllers/paymentMethods/paymentMethod");
const purchasePayment_1 = require("../controllers/purchase/purchasePayment");
const SalesPayment_1 = require("../controllers/sales/SalesPayment");
const expensePayment_1 = require("../controllers/expenses/expensePayment");
const router = express_1.default.Router();
router.post('/', auth_1.auth, paymentMethod_1.createPayment);
router.get('/', auth_1.auth, paymentMethod_1.getPayments);
router.post('/purchase', auth_1.auth, purchasePayment_1.createPurchasePayment);
router.post('/sales', auth_1.auth, SalesPayment_1.createSalesPayment);
router.post('/expense', auth_1.auth, expensePayment_1.createExpensePayment);
exports.default = router;
//# sourceMappingURL=paymentRouter.js.map