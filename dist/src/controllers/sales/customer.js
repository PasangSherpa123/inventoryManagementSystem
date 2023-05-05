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
exports.getCustomers = exports.createCustomer = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/supplier
// @desc     Create a supplier
// @access   Private
const createCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_name, customer_phone, amount_to_be_received } = req.body;
    try {
        const { error } = validateCustomerData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        console.log("helloworld2");
        const { rows } = yield database_1.default.query("SELECT * FROM customer WHERE customer_phone= $1AND user_id=$2", [
            customer_phone,
            req.user.user_id
        ]);
        if (rows.length > 0) {
            return res.status(404).send("Customer with this name already exists!");
        }
        try {
            const { rows } = yield database_1.default.query("INSERT INTO customer(customer_name,customer_phone,amount_to_be_received,user_id) VALUES($1,$2,$3,$4) RETURNING customer_name,customer_phone", [customer_name, customer_phone, amount_to_be_received, req.user.user_id]);
            console.log(rows[0]);
            let customer = rows[0];
            res.status(201).json({
                success: true,
                customer: customer
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
exports.createCustomer = createCustomer;
const validateCustomerData = (data) => {
    const schema = joi_1.default.object({
        customer_name: joi_1.default.string().min(4).max(150).required(),
        customer_phone: joi_1.default.string()
            .min(9)
            .max(10)
            .regex(/^[a-zA-Z0-9]+$/)
            .required(),
        amount_to_be_received: joi_1.default.number().default(0),
    });
    return schema.validate(data);
};
const getCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield database_1.default.query("SELECT * FROM customer WHERE user_id=$1", [
            req.user.user_id
        ]);
        if (rows.length <= 0) {
            res.status(404).json({
                success: false,
                data: "Customer is empty"
            });
        }
        ;
        let customer = rows;
        res.status(200).json({
            success: true,
            data: customer
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCustomers = getCustomers;
//# sourceMappingURL=customer.js.map