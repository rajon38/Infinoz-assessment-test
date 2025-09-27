import express from 'express';
import auth from '../../middlewares/auth';
import { chatController } from './chat.controller';
const router = express.Router();

router.post(
'/',
auth(),
chatController.createChat,
);

router.get('/history/:userId', auth(), chatController.getChatList);

export const chatRoutes = router;