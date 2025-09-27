import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { chatRoutes } from "../modules/chat/chat.routes";



const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/chat",
    route: chatRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
