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
exports.createPurchase = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/purchase
// @desc     Create a purchase
// @access   Private
const createPurchase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { purchase_invoice_id, purchases } = req.body;
    try {
        const { error } = validatePurchaseObjectData(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        const { rows } = yield database_1.default.query("SELECT purchase_invoice_id FROM purchaseInvoice WHERE purchase_invoice_id= $1", [purchase_invoice_id]);
        console.log(rows[0]);
        if (rows.length == 0) {
            return res.status(404).send("Purchase Invoice is not created yet!!!!");
        }
        let datas = [];
        for (let i = 0; i < purchases.length; i++) {
            const { item_id, quantity, unit_id, rate, discount_amount, tax_amount } = purchases[i];
            try {
                const { rows } = yield database_1.default.query("SELECT item_id FROM item WHERE item_id = $1", [item_id]);
                if (rows.length == 0) {
                    return res.status(404).send("This item is not created yet!!!!");
                }
            }
            catch (error) {
                next(error);
            }
            try {
                const { rows } = yield database_1.default.query("SELECT unit_id FROM unit WHERE unit_id = $1", [unit_id]);
                if (rows.length == 0) {
                    return res.status(404).send("This unit is not created yet!!!!");
                }
            }
            catch (error) {
                next(error);
            }
            const { rows } = yield database_1.default.query("INSERT INTO purchase(quantity,rate,discount_amount,tax_amount,purchase_invoice_id, item_id, unit_id) VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING quantity, rate,discount_amount, tax_amount, purchase_invoice_id", [quantity, rate, discount_amount, tax_amount, purchase_invoice_id, item_id, unit_id]);
            console.log(rows[0]);
            if (rows.length > 0) {
                datas.push(rows[0]);
            }
        }
        res.status(200).json({
            success: true,
            data: datas
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createPurchase = createPurchase;
const validatePurchaseObjectData = (data) => {
    let purchase = joi_1.default.object().keys({
        item_id: joi_1.default.string().required(),
        quantity: joi_1.default.number().required().default(0),
        unit_id: joi_1.default.string().required(),
        rate: joi_1.default.number().required(),
        discount_amount: joi_1.default.number().required(),
        tax_amount: joi_1.default.number().required()
    });
    const schema = joi_1.default.object({
        purchase_invoice_id: joi_1.default.string().min(4).max(150).required(),
        purchases: joi_1.default.array().items(purchase)
    });
    return schema.validate(data);
};
//# sourceMappingURL=purchase.js.map