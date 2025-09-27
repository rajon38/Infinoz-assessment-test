import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "../User/user.validation";
import { authValidation } from "./auth.validation";

const router = express.Router();

// user login route
router.post(
  "/login",
  validateRequest(UserValidation.UserLoginValidationSchema),
  AuthController.loginUser
);

// user logout route
router.post("/logout", AuthController.logoutUser);

router.get(
  "/profile",
  AuthController.getMyProfile
);

router.put(
  "/change-password",
  validateRequest(authValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
