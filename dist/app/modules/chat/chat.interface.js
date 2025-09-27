"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBotResponse = void 0;
const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    if (message === 'hi' || message === 'hello') {
        return "Hello! How can I help you?";
    }
    else if (message === 'bye' || message === 'goodbye') {
        return "Goodbye, see you soon!";
    }
    else {
        return `I'm just a dummy bot. You said: ${userMessage}`;
    }
};
exports.generateBotResponse = generateBotResponse;
