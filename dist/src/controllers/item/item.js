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
exports.getItems = exports.createItem = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/item
// @desc     Create a item
// @access   Private
const createItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { taxable, item_name, quantity } = req.body;
    try {
        const { error } = validateItemData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const { rows } = yield database_1.default.query("SELECT * FROM item WHERE item_name=$1 AND user_id=$2", [
            item_name,
            req.user.user_id
        ]);
        if (rows.length > 0) {
            return res.status(400).send("Item with this name already exists!");
        }
        try {
            const { rows } = yield database_1.default.query("INSERT INTO item(taxable,item_name,quantity,user_id) VALUES($1,$2,$3,$4) RETURNING taxable,item_name,quantity", [taxable, item_name, quantity, req.user.user_id]);
            console.log(rows[0]);
            let item = rows[0];
            res.status(201).json({
                success: true,
                item: item
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
exports.createItem = createItem;
const getItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield database_1.default.query("SELECT item_id,taxable,item_name,quantity, category_id, company_id FROM item WHERE user_id=$1", [
            req.user.user_id
        ]);
        let item = rows;
        res.status(200).json({
            success: true,
            item: item
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getItems = getItems;
const validateItemData = (data) => {
    const schema = joi_1.default.object({
        taxable: joi_1.default.boolean().required().default(false),
        item_name: joi_1.default.string()
            .min(3)
            .max(150)
            .regex(/^[a-zA-Z0-9]+$/)
            .required(),
        quantity: joi_1.default.number().default(0),
    });
    return schema.validate(data);
};
//# sourceMappingURL=item.js.map