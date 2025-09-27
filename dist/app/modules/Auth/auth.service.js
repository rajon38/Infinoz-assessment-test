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
exports.AuthServices = void 0;
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpars/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
// user login
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.users.findUnique({
        where: {
            username: payload.username,
        },
    });
    if (!(userData === null || userData === void 0 ? void 0 : userData.username)) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found! with this username " + payload.username);
    }
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.passwordHash);
    if (!isCorrectPassword) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Password incorrect!");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        username: userData.username,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return { token: accessToken };
});
// get user profile
const getMyProfile = (userToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = jwtHelpers_1.jwtHelpers.verifyToken(userToken, config_1.default.jwt.jwt_secret);
    const userProfile = yield prisma_1.default.users.findUnique({
        where: {
            id: decodedToken.id,
        },
        select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return userProfile;
});
// change password
const changePassword = (userToken, newPassword, oldPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = jwtHelpers_1.jwtHelpers.verifyToken(userToken, config_1.default.jwt.jwt_secret);
    const user = yield prisma_1.default.users.findUnique({
        where: { id: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id },
    });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    const isPasswordValid = yield bcrypt.compare(oldPassword, user === null || user === void 0 ? void 0 : user.passwordHash);
    if (!isPasswordValid) {
        throw new ApiErrors_1.default(401, "Incorrect old password");
    }
    const hashedPassword = yield bcrypt.hash(newPassword, 12);
    const result = yield prisma_1.default.users.update({
        where: {
            id: decodedToken.id,
        },
        data: {
            passwordHash: hashedPassword,
        },
    });
    return { message: "Password changed successfully" };
});
exports.AuthServices = {
    loginUser,
    getMyProfile,
    changePassword
};
