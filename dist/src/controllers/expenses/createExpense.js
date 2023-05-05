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
exports.createExpense = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/payment/purchase
// @desc     Create a purchase payment
// @access   Private
const createExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type_of_expense } = req.body;
    try {
        const { error } = validateCreateExpenseData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        try {
            const { rows } = yield database_1.default.query("SELECT * FROM expenses WHERE type_of_expense=$1 AND user_id=$2", [
                type_of_expense,
                req.user.user_id
            ]);
            if (rows.length > 0) {
                return res.status(404).send("Expense with this name already exists!");
            }
        }
        catch (error) {
            next(error);
        }
        try {
            const { rows } = yield database_1.default.query("INSERT INTO expenses(type_of_expense,user_id) VALUES($1,$2) RETURNING type_of_expense", [type_of_expense, req.user.user_id]);
            let expense = rows[0];
            res.status(201).json({
                success: true,
                expense: expense
            });
        }
        catch (error) {
            next(error);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createExpense = createExpense;
const validateCreateExpenseData = (data) => {
    const schema = joi_1.default.object({
        type_of_expense: joi_1.default.string()
            .min(3)
            .max(150)
            .required(),
    });
    return schema.validate(data);
};
//# sourceMappingURL=createExpense.js.map