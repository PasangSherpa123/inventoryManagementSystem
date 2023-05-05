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
exports.createPurchaseInvoice = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/purchaseInvoice
// @desc     Create a purchase invoice
// @access   Private
const createPurchaseInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { bill_no, supplier_id } = req.body;
    try {
        const { error } = validatePurchaseInvoiceData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        try {
            const { rows } = yield database_1.default.query("SELECT * FROM supplier WHERE supplier_id=$1 AND user_id=$2", [
                supplier_id,
                req.user.user_id
            ]);
            if (rows.length <= 0) {
                return res.status(404).send("Supplier with this id doesnot exists!");
            }
            try {
                const { rows } = yield database_1.default.query("INSERT INTO purchaseInvoice(bill_no,supplier_id, user_id) VALUES($1,$2,$3) RETURNING bill_no,purchase_invoice_id", [bill_no, supplier_id, req.user.user_id]);
                console.log(rows[0]);
                let purchaseInvoice = rows[0];
                res.status(201).json({
                    success: true,
                    purchaseInvoice: purchaseInvoice
                });
            }
            catch (err) {
                next(err);
            }
        }
        catch (error) {
            next(error);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.createPurchaseInvoice = createPurchaseInvoice;
const validatePurchaseInvoiceData = (data) => {
    const schema = joi_1.default.object({
        bill_no: joi_1.default.string().min(0).max(150).required(),
        supplier_id: joi_1.default.string()
            .min(10)
            .max(150)
            .regex(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/)
            .required(),
    });
    return schema.validate(data);
};
//# sourceMappingURL=purchaseInvoice.js.map