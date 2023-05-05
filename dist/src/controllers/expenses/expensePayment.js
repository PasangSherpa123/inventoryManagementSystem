"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpensePayment = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/payment/expense
// @desc     Create a expense payment
// @access   Private
const createExpensePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { expense_id, amount, payment_method_id } = req.body;
    try {
        const { error } = validateCreateExpensePaymentData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        try {
            const { rows } = yield database_1.default.query("SELECT * FROM expenses WHERE expense_id=$1 AND user_id=$2", [
                expense_id,
                req.user.user_id
            ]);
            if (rows.length <= 0) {
                return res.status(404).send("Expense with this id does not exist!!!!");
            }
        }
        catch (error) {
            next(error);
        }
        try {
            const { rows } = yield database_1.default.query("SELECT * FROM paymentMethod WHERE payment_method_id=$1 AND user_id=$2", [
                payment_method_id,
                req.user.user_id
            ]);
            if (rows.length <= 0) {
                return res.status(404).send("Payment method with this id does not exist!!!!");
            }
            try {
                const { rows } = yield database_1.default.query("INSERT INTO expensePayment(expense_id,amount,payment_method_id) VALUES($1,$2,$3) RETURNING expense_payment_id", [expense_id, amount, payment_method_id]);
                let expensePayment = rows[0];
                res.status(201).json({
                    success: true,
                    expensePayment: expensePayment
                });
            }
            catch (error) {
                next(error);
            }
        }
        catch (error) {
            next(error);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createExpensePayment = createExpensePayment;
const validateCreateExpensePaymentData = (data) => {
    const schema = joi_1.default.object({
        expense_id: joi_1.default.string().regex(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/).required(),
        amount: joi_1.default.number().required(),
        payment_method_id: joi_1.default.string().regex(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/).required(),
    });
    return schema.validate(data);
};
//# sourceMappingURL=expensePayment.js.map