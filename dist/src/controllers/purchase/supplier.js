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
exports.getSuppliers = exports.createSupplier = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/supplier
// @desc     Create a supplier
// @access   Private
const createSupplier = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { supplier_name, supplier_phone, amount_to_be_paid } = req.body;
    try {
        const { error } = validateSupplierData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const { rows } = yield database_1.default.query("SELECT * FROM supplier WHERE supplier_phone=$1 AND user_id=$2", [
            supplier_phone,
            req.user.user_id
        ]);
        if (rows.length > 0) {
            return res.status(404).send("Supplier with this phone number already exists!");
        }
        try {
            const { rows } = yield database_1.default.query("INSERT INTO supplier(supplier_name,supplier_phone,amount_to_be_paid,user_id) VALUES($1,$2,$3,$4) RETURNING supplier_name,supplier_phone", [supplier_name, supplier_phone, amount_to_be_paid, req.user.user_id]);
            console.log(rows[0]);
            let supplier = rows[0];
            res.status(201).json({
                success: true,
                supplier: supplier
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
exports.createSupplier = createSupplier;
const validateSupplierData = (data) => {
    const schema = joi_1.default.object({
        supplier_name: joi_1.default.string().min(4).max(150).required(),
        supplier_phone: joi_1.default.string()
            .min(9)
            .max(10)
            .regex(/^[a-zA-Z0-9]+$/)
            .required(),
        amount_to_be_paid: joi_1.default.number().default(0),
    });
    return schema.validate(data);
};
const getSuppliers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield database_1.default.query("SELECT * FROM supplier WHERE user_id=$1", [
            req.user.user_id
        ]);
        if (rows.length <= 0) {
            res.status(404).json({
                success: false,
                data: "Supplier is empty"
            });
        }
        ;
        let supplier = rows;
        res.status(200).json({
            success: true,
            data: supplier
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getSuppliers = getSuppliers;
//# sourceMappingURL=supplier.js.map