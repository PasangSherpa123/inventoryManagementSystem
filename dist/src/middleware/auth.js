"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (token == undefined || !token)
        return res.status(403).send("You cannot perform this action.");
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        // console.log("Decode is ",decode)
        req.user = decode;
        next();
    }
    catch (err) {
        console.log("The error is ", err);
        return res.status(403).send("You cannot perform this action.");
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map