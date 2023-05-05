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
exports.createSalesPayment = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/payment/sales
// @desc     Create a sales payment
// @access   Private
const createSalesPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { salesPayment } = req.body;
    try {
        const { error } = validateSalesPaymentData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        for (let i = 0; i < salesPayment.length; i++) {
            const { payment_method_id, amount, reference, sales_invoice_id, amountReturn } = salesPayment[i];
            try {
                const { rows } = yield database_1.default.query("SELECT * FROM paymentMethod WHERE payment_method_id=$1 AND user_id=$2", [payment_method_id, req.user.user_id]);
                if (rows.length <= 0) {
                    return res.status(404).send("Payment with this id doesnot exists!");
                }
            }
            catch (error) {
                next(error);
            }
            try {
                const { rows } = yield database_1.default.query("SELECT * FROM salesInvoice WHERE sales_invoice_id=$1 AND user_id=$2", [sales_invoice_id, req.user.user_id]);
                if (rows.length <= 0) {
                    return res.status(404).send("Sales Invoice with this id doesnot exists!");
                }
            }
            catch (error) {
                next(error);
            }
            try {
                const { rows } = yield database_1.default.query("INSERT INTO salesPayment(reference,amount,payment_method_id, sales_invoice_id, amount_return) VALUES($1,$2,$3,$4, $5) RETURNING payment_method_id,sales_payment_id", [reference, amount, payment_method_id, sales_invoice_id, amountReturn]);
                console.log(rows[0]);
                let salesPayment = rows[0];
                res.status(201).json({
                    success: true,
                    salesPayment: salesPayment
                });
            }
            catch (err) {
                next(err);
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.createSalesPayment = createSalesPayment;
const validateSalesPaymentData = (data) => {
    let salesPayment = joi_1.default.object().keys({
        amount: joi_1.default.number()
            .required(),
        amountReturn: joi_1.default.number(),
        reference: joi_1.default.string()
            .min(0)
            .max(150)
            .required(),
        sales_invoice_id: joi_1.default.string()
            .min(10)
            .max(150)
            .regex(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/)
            .required(),
        payment_method_id: joi_1.default.string()
            .min(10)
            .max(150)
            .regex(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/)
            .required(),
    });
    const schema = joi_1.default.object({
        salesPayment: joi_1.default.array().items(salesPayment)
    });
    return schema.validate(data);
};
//# sourceMappingURL=SalesPayment.js.map