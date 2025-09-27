import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { generateBotResponse } from "./chat.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";

const sendChatMessageToBot = async (message: string, userId: string) => {
  try{
    const isExistUser = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!isExistUser) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    if(!message || message.trim() === ''){
      throw new ApiError(httpStatus.BAD_REQUEST, "Message is required");
    }
    // Simulate bot response generation
    const botResponse = generateBotResponse(message);
    
    // Save user message to database
    const chatEntry = await prisma.chats.create({
      data: {
        userId: userId,
        userMessage: message,
        botResponse: botResponse,
      },
    });

    return chatEntry;
  }
  catch(error){
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get response from bot");
  }
}

const getHistoryFromDb = async (userId: string, options: IPaginationOptions) => {

  const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(options);
  
  const isExistUser = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const chats = await prisma.chats.findMany({
    where: {
      userId: userId,
    },
    take: limit,
    skip: skip,
    orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.chats.count({
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
}

export const chatService = {
  sendChatMessageToBot,
  getHistoryFromDb,
};