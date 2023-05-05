"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const pg_1 = require("pg");
const client = new pg_1.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'techunbound',
    password: 'helloworld',
    port: 5432,
});
client.connect();
exports.default = client;
//# sourceMappingURL=database.js.map