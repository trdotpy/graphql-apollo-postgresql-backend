"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const Product_1 = require("./entities/Product");
const User_1 = require("./entities/User");
dotenv_1.default.config();
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.CONNECTION_STRING,
    entities: [Product_1.Product, User_1.User],
    synchronize: true,
});
//# sourceMappingURL=type-orm.config.js.map