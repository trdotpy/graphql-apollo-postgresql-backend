"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const schema_1 = require("./schema");
const dotenv_1 = __importDefault(require("dotenv"));
const type_orm_config_1 = __importDefault(require("./type-orm.config"));
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const bootServer = async () => {
    const connectDB = await type_orm_config_1.default.initialize();
    const server = new apollo_server_1.ApolloServer({
        schema: schema_1.schema,
        context: ({ req }) => {
            var _a;
            const token = ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization)
                ? (0, auth_1.auth)(req.headers.authorization)
                : null;
            return { connectDB, userId: token === null || token === void 0 ? void 0 : token.userId };
        },
    });
    server.listen(4000).then(({ url }) => {
        console.log('Listening on: ' + url);
    });
};
bootServer();
//# sourceMappingURL=index.js.map