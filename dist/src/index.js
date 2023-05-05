"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//importing packages for creating server
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
//importing Routing files 
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const itemRouter_1 = __importDefault(require("./routers/itemRouter"));
const unitRouter_1 = __importDefault(require("./routers/unitRouter"));
const purchaseRouter_1 = __importDefault(require("./routers/purchaseRouter"));
const paymentRouter_1 = __importDefault(require("./routers/paymentRouter"));
const salesRouter_1 = __importDefault(require("./routers/salesRouter"));
const expenseRouter_1 = __importDefault(require("./routers/expenseRouter"));
const app = (0, express_1.default)();
//middlewares;
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/v1/user', userRouter_1.default);
app.use('/api/v1/item', itemRouter_1.default);
app.use('/api/v1/unit', unitRouter_1.default);
app.use('/api/v1/purchase', purchaseRouter_1.default);
app.use('/api/v1/sales', salesRouter_1.default);
app.use('/api/v1/payment', paymentRouter_1.default);
app.use('/api/v1/expense', expenseRouter_1.default);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});
//# sourceMappingURL=index.js.map