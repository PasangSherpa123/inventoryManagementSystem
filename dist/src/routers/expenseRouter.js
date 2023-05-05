"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const createExpense_1 = require("../controllers/expenses/createExpense");
const router = express_1.default.Router();
router.post('/', auth_1.auth, createExpense_1.createExpense);
exports.default = router;
//# sourceMappingURL=expenseRouter.js.map