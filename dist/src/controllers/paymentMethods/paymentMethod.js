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
exports.getPayments = exports.createPayment = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/payment
// @desc     Create a supplier
// @access   Private
const createPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type_of_payment, amount } = req.body;
    try {
        const { error } = validateSupplierData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const { rows } = yield database_1.default.query("SELECT * FROM paymentMethod WHERE type_of_payment=$1 AND user_id=$2", [
            type_of_payment,
            req.user.user_id
        ]);
        if (rows.length > 0) {
            return res.status(404).send("Payment method with this name already exists!");
        }
        try {
            const { rows } = yield database_1.default.query("INSERT INTO paymentMethod(type_of_payment,amount,user_id) VALUES($1,$2,$3) RETURNING type_of_payment,amount", [type_of_payment, amount, req.user.user_id]);
            console.log(rows[0]);
            let payment = rows[0];
            res.status(201).json({
                success: true,
                payment: payment
            });
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.createPayment = createPayment;
const validateSupplierData = (data) => {
    const schema = joi_1.default.object({
        type_of_payment: joi_1.default.string().min(4).max(150).required(),
        amount: joi_1.default.number().default(0),
    });
    return schema.validate(data);
};
const getPayments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('heloworld');
    try {
        const { rows } = yield database_1.default.query("SELECT * FROM paymentMethod WHERE user_id=$1", [
            req.user.user_id
        ]);
        console.log('helloworld');
        if (rows.length <= 0) {
            res.status(404).json({
                success: false,
                data: "PaymentMethod is empty"
            });
        }
        ;
        let payment = rows;
        res.status(200).json({
            success: true,
            data: payment
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getPayments = getPayments;
//# sourceMappingURL=paymentMethod.js.map