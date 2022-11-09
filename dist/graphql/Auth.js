"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMutation = exports.AuthType = void 0;
const User_1 = require("../entities/User");
const nexus_1 = require("nexus");
const jwt = __importStar(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
exports.AuthType = (0, nexus_1.objectType)({
    name: 'AuthType',
    definition(t) {
        t.nonNull.string('token'),
            t.nonNull.field('user', {
                type: 'User',
            });
    },
});
exports.AuthMutation = (0, nexus_1.extendType)({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('login', {
            type: 'AuthType',
            args: { username: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()), password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()) },
            async resolve(_parent, args, _context, _info) {
                const { username, password } = args;
                const user = await User_1.User.findOne({ where: { username } });
                if (!user) {
                    throw new Error('User not found.');
                }
                const isValid = await argon2_1.default.verify(user.password, password);
                if (!isValid) {
                    throw new Error('Invalid password.');
                }
                const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET);
                return {
                    token,
                    user,
                };
            },
        });
        t.nonNull.field('register', {
            type: 'AuthType',
            args: {
                username: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            async resolve(_parent, args, context, _info) {
                const { username, password, email } = args;
                const hashedPassword = await argon2_1.default.hash(password);
                let user;
                let token;
                try {
                    const result = await context.connectDB
                        .createQueryBuilder()
                        .insert()
                        .into(User_1.User)
                        .values({
                        username,
                        password: hashedPassword,
                        email,
                    })
                        .returning('*')
                        .execute();
                    user = result.raw[0];
                    token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET);
                }
                catch (err) {
                    console.log(err);
                }
                return {
                    user,
                    token,
                };
            },
        });
    },
});
//# sourceMappingURL=Auth.js.map