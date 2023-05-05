"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const unit_1 = require("../controllers/item/unit");
// import {register , login } from '../controllers/auth'
const router = express_1.default.Router();
router.post('/:item_id', auth_1.auth, unit_1.createUnit);
// router.post("/register",register );
// router.post("/login", login);
exports.default = router;
//# sourceMappingURL=unitRouter.js.map