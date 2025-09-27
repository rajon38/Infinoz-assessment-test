"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const user_validation_1 = require("../User/user.validation");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
// user login route
router.post("/login", (0, validateRequest_1.default)(user_validation_1.UserValidation.UserLoginValidationSchema), auth_controller_1.AuthController.loginUser);
// user logout route
router.post("/logout", auth_controller_1.AuthController.logoutUser);
router.get("/profile", auth_controller_1.AuthController.getMyProfile);
router.put("/change-password", (0, validateRequest_1.default)(auth_validation_1.authValidation.changePasswordValidationSchema), auth_controller_1.AuthController.changePassword);
exports.AuthRoutes = router;
