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
exports.chatService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const chat_interface_1 = require("./chat.interface");
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const sendChatMessageToBot = (message, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExistUser = yield prisma_1.default.users.findUnique({
            where: {
                id: userId,
            },
        });
        if (!isExistUser) {
            throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        if (!message || message.trim() === '') {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Message is required");
        }
        // Simulate bot response generation
        const botResponse = (0, chat_interface_1.generateBotResponse)(message);
        // Save user message to database
        const chatEntry = yield prisma_1.default.chats.create({
            data: {
                userId: userId,
                userMessage: message,
                botResponse: botResponse,
            },
        });
        return chatEntry;
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to get response from bot");
    }
});
const getHistoryFromDb = (userId, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const isExistUser = yield prisma_1.default.users.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isExistUser) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const chats = yield prisma_1.default.chats.findMany({
        where: {
            userId: userId,
        },
        take: limit,
        skip: skip,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    });
    const total = yield prisma_1.default.chats.count({
        where: {
            userId: userId,
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: chats,
    };
});
exports.chatService = {
    sendChatMessageToBot,
    getHistoryFromDb,
};
