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
exports.createUnit = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/unit/:item_id
// @desc     Create a item
// @access   Private
const createUnit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { unit_type, price, purchase_cost, discount, currentData, incomingData, } = req.body;
    try {
        const { error } = validateItemData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const { rows } = yield database_1.default.query("SELECT item_name FROM item WHERE item_id=$1", [req.params.item_id]);
        if (rows.length == 0) {
            return res.status(404).send("Item with this id doesnot exists!");
        }
        try {
            const { rows } = yield database_1.default.query("SELECT unit_type FROM unit WHERE item_id=$1 AND unit_type=$2", [req.params.item_id, unit_type]);
            if (rows.length > 0) {
                return res.status(400).send("Unit with this type already exists");
            }
            try {
                let updateOrNot = currentData > incomingData ? false : true;
                const { rows } = yield database_1.default.query("INSERT INTO unit(unit_type,price,add_quantity, incoming_data, purchase_cost, discount, item_id, updateTable) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *", [
                    unit_type,
                    price,
                    currentData,
                    incomingData,
                    purchase_cost,
                    discount,
                    req.params.item_id,
                    updateOrNot,
                ]);
                let unit = rows[0];
                res.status(201).json({
                    success: true,
                    data: unit,
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
exports.createUnit = createUnit;
const validateItemData = (data) => {
    const schema = joi_1.default.object({
        unit_type: joi_1.default.string()
            .min(3)
            .max(150)
            .regex(/^[a-zA-Z0-9]+$/)
            .required(),
        price: joi_1.default.number().default(0),
        incomingData: joi_1.default.number().default(0),
        currentData: joi_1.default.number().default(0),
        purchase_cost: joi_1.default.number().default(0),
        discount: joi_1.default.number().default(0)
    });
    return schema.validate(data);
};
//# sourceMappingURL=unit.js.map