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
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
// import { auth } from "../middleware/auth";
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// @route    POST /register
// @desc     Create a user
// @access   Public
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { inventory_name, first_name, last_name, email, password, } = req.body;
    try {
        const { error } = validateRegisterData(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const { rows } = yield database_1.default.query("SELECT * FROM Users WHERE email=$1", [
            email,
        ]);
        if (rows.length > 0) {
            return res.status(404).send("User with this email already exists!");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        try {
            const { rows } = yield database_1.default.query("INSERT INTO users(inventory_name,email,first_name,last_name,password) VALUES($1,$2,$3,$4,$5) RETURNING user_id,inventory_name,first_name,last_name", [inventory_name, email, first_name, last_name, hashedPassword]);
            console.log(rows[0]);
            let user = rows[0];
            const token = jsonwebtoken_1.default.sign({ user_id: user.user_id }, process.env.SECRET_KEY, {
                expiresIn: 86400,
            });
            res.status(201).cookie('token', token).json({
                success: true,
                token,
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
exports.register = register;
const validateRegisterData = (data) => {
    const schema = joi_1.default.object({
        inventory_name: joi_1.default.string().alphanum().min(3).max(150).required(),
        first_name: joi_1.default.string()
            .min(3)
            .max(150)
            .required(),
        last_name: joi_1.default.string()
            .min(3)
            .max(150)
            .required(),
        email: joi_1.default.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        }),
        password: joi_1.default.string().required(),
    });
    return schema.validate(data);
};
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { error } = validateLoginData({ email });
    if (error)
        return res.status(404).send("Either wrong email or password.");
    try {
        const { rows } = yield database_1.default.query("SELECT * from Users WHERE email=$1", [
            email,
        ]);
        if (rows.length == 0) {
            res.status(404).send("Either wrong email or password.");
        }
        else {
            const doesUserExist = yield bcrypt_1.default.compare(password, rows[0].password);
            if (doesUserExist) {
                const token = jsonwebtoken_1.default.sign({ user_id: rows[0].user_id, admin: rows[0].admin }, process.env.SECRET_KEY, {
                    expiresIn: 86400,
                });
                res.send({ user_id: rows[0].user_id, token, image: rows[0].image });
            }
            else {
                res.status(404).send("Either wrong email or password.");
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const validateLoginData = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        }),
    });
    return schema.validate(data);
};
//# sourceMappingURL=auth.js.map