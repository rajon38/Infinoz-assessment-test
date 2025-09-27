import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { chatService } from './chat.service';
import pick from '../../../shared/pick';

const createChat = catchAsync(async (req, res) => {
  const userId = req.user.id as string;
  const {message} = req.body;
  const result = await chatService.sendChatMessageToBot(message, userId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Chat created successfully',
    data: result,
  });
});

const getChatList = catchAsync(async (req, res) => {
  const userId = req.params.userId as string;

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
  const result = await chatService.getHistoryFromDb(userId, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat list retrieved successfully',
    data: result,
  });
});

export const chatController = {
  createChat,
  getChatList
};