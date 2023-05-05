"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const item_1 = require("../controllers/item/item");
const unit_1 = require("../controllers/item/unit");
const company_1 = require("../controllers/item/company");
const category_1 = require("../controllers/item/category");
// import {register , login } from '../controllers/auth'
const router = express_1.default.Router();
router.post('/', auth_1.auth, item_1.createItem);
router.get('/', auth_1.auth, item_1.getItems);
router.post('/unit/:item_id', auth_1.auth, unit_1.createUnit);
router.post('/company', auth_1.auth, company_1.createCompany);
router.post('/category', auth_1.auth, category_1.createCategory);
exports.default = router;
//# sourceMappingURL=itemRouter.js.map