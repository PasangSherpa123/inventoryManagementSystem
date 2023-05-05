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
exports.createSalesInvoice = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/purchaseInvoice
// @desc     Create a purchase invoice
// @access   Private
const createSalesInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_id, bill_no, } = req.body;
    try {
        const { error } = validateSalesInvoiceData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        try {
            console.log("customer begins");
            if (customer_id) {
                const { rows } = yield database_1.default.query("SELECT * FROM customer WHERE customer_id=$1 AND user_id=$2", [
                    customer_id,
                    req.user.user_id
                ]);
                if (rows.length <= 0) {
                    return res.status(404).send("Customer with this id doesnot exists!");
                }
                try {
                    const { rows } = yield database_1.default.query("INSERT INTO salesInvoice(bill_no,customer_id,user_id) VALUES($1,$2,$3) RETURNING sales_invoice_id", [bill_no, customer_id, req.user.user_id]);
                    let salesInvoice = rows[0];
                    res.status(201).json({
                        success: true,
                        salesInvoice: salesInvoice
                    });
                }
                catch (error) {
                    next(error);
                }
            }
            try {
                const { rows } = yield database_1.default.query("INSERT INTO salesInvoice(bill_no,user_id) VALUES($1,$2) RETURNING sales_invoice_id", [bill_no, req.user.user_id]);
                let salesInvoice = rows[0];
                res.status(201).json({
                    success: true,
                    salesInvoice: salesInvoice
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
exports.createSalesInvoice = createSalesInvoice;
const validateSalesInvoiceData = (data) => {
    const schema = joi_1.default.object({
        bill_no: joi_1.default.string()
            .min(0)
            .max(100)
            .required(),
        customer_id: joi_1.default.string()
            .min(0)
            .max(150)
            .required(),
    });
    return schema.validate(data);
};
//# sourceMappingURL=salesInvoice.js.map