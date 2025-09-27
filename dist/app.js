"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
exports.corsOptions = {
    origin: ["http://localhost:3001", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "X-Requested-With",
        "Origin",
        "Cache-Control",
        "X-CSRF-Token",
        "User-Agent",
        "Content-Length",
    ],
    credentials: true,
};
// Rate limiter middleware
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000,
    keyGenerator: (req) => {
        // Extract IP address from the X-Forwarded-For header safely
        const forwardedFor = req.headers['x-forwarded-for'];
        const ipArray = forwardedFor ? forwardedFor.split(/\s*,\s*/) : [];
        const ipAddress = ipArray.length > 0 ? ipArray[0] : req.connection.remoteAddress;
        return ipAddress;
    },
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Middleware setup
app.use((0, cors_1.default)(exports.corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
// Root endpoint
app.get("/", (req, res) => {
    res.send({
        success: true,
        statusCode: http_status_1.default.OK,
        message: "The server is running!",
    });
});
// Rate limit only for API routes
app.use("/api/v1", apiLimiter, routes_1.default);
// Global error handler
app.use(globalErrorHandler_1.default);
// Not found handler
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});
exports.default = app;
