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
exports.createPurchasePayment = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/payment/purchase
// @desc     Create a purchase payment
// @access   Private
const createPurchasePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { purchasePayment } = req.body;
    try {
        const { error } = validatePurchasePaymentData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        for (let i = 0; i < purchasePayment.length; i++) {
            const { payment_method_id, amount, reference, purchase_invoice_id } = purchasePayment[i];
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
                const { rows } = yield database_1.default.query("SELECT * FROM purchaseInvoice WHERE purchase_invoice_id=$1 AND bill_no=$2", [purchase_invoice_id, reference]);
                if (rows.length <= 0) {
                    return res.status(404).send("Purchase invoice with this id doesnot exists!");
                }
            }
            catch (error) {
                next(error);
            }
            try {
                const { rows } = yield database_1.default.query("INSERT INTO purchasePayment(reference,amount,payment_method_id, purchase_invoice_id, user_id) VALUES($1,$2, $3,$4,$5) RETURNING payment_method_id,purchase_payment_id", [reference, amount, payment_method_id, purchase_invoice_id, req.user.user_id]);
                console.log(rows[0]);
                let purchasePayment = rows[0];
                res.status(201).json({
                    success: true,
                    purchasePayment: purchasePayment
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
exports.createPurchasePayment = createPurchasePayment;
const validatePurchasePaymentData = (data) => {
    let purchasePayment = joi_1.default.object().keys({
        amount: joi_1.default.number()
            .required(),
        reference: joi_1.default.string()
            .min(0)
            .max(150)
            .required(),
        purchase_invoice_id: joi_1.default.string()
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
        purchasePayment: joi_1.default.array().items(purchasePayment)
    });
    return schema.validate(data);
};
//# sourceMappingURL=purchasePayment.js.map