"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const customer_1 = require("../controllers/sales/customer");
const salesInvoice_1 = require("../controllers/sales/salesInvoice");
const sales_1 = require("../controllers/sales/sales");
const router = express_1.default.Router();
router.post('/customer', auth_1.auth, customer_1.createCustomer);
router.get('/customer', auth_1.auth, customer_1.getCustomers);
router.post('/salesInvoice', auth_1.auth, salesInvoice_1.createSalesInvoice);
router.post('/', auth_1.auth, sales_1.createSales);
exports.default = router;
//# sourceMappingURL=salesRouter.js.map