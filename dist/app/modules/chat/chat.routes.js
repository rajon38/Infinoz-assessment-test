"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const chat_controller_1 = require("./chat.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(), chat_controller_1.chatController.createChat);
router.get('/history/:userId', (0, auth_1.default)(), chat_controller_1.chatController.getChatList);
exports.chatRoutes = router;
