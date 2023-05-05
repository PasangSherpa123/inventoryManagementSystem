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
exports.createCompany = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = __importDefault(require("../../database"));
// @route    POST /api/v1/item/company
// @desc     Create a company
// @access   Private
const createCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { company_name } = req.body;
    try {
        const { error } = validateCompanyData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        try {
            const { rows } = yield database_1.default.query("INSERT INTO company(company_name, user_id) VALUES($1,$2) RETURNING company_id, company_name", [company_name, req.user.user_id]);
            console.log(rows[0]);
            let company = rows[0];
            res.status(201).json({
                success: true,
                data: company
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
exports.createCompany = createCompany;
const validateCompanyData = (data) => {
    const schema = joi_1.default.object({
        company_name: joi_1.default.string()
            .min(3)
            .max(150)
            .required()
    });
    return schema.validate(data);
};
//# sourceMappingURL=company.js.map