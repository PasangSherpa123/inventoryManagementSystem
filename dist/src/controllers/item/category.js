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
exports.createCategory = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/item/category
// @desc     Create a company
// @access   Private
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { category_name } = req.body;
    try {
        const { error } = validateCategoryData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        try {
            const { rows } = yield database_1.default.query("INSERT INTO category(category_name, user_id) VALUES($1,$2) RETURNING category_id, category_name", [category_name, req.user.user_id]);
            console.log(rows[0]);
            let category = rows[0];
            res.status(201).json({
                success: true,
                data: category
            });
        }
        catch (err) {
            next(err);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createCategory = createCategory;
const validateCategoryData = (data) => {
    const schema = joi_1.default.object({
        category_name: joi_1.default.string()
            .min(3)
            .max(150)
            .regex(/^[a-zA-Z0-9]+$/)
            .required()
    });
    return schema.validate(data);
};
//# sourceMappingURL=category.js.map