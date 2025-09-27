import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IUser, IUserFilterRequest } from "./user.interface";
import * as bcrypt from "bcrypt";
import crypto from 'crypto';
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import httpStatus from "http-status";
import { Request } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpars/jwtHelpers";

// Create a new user in the database.
const createUserIntoDb = async (payload: IUser)=> {
  const isExistUser = await prisma.users.findUnique({
    where: {
      username: payload.username,
    },
  });

  if (isExistUser) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists");
  }

  // Hash the password before storing it in the database.
  const hashedPassword = await bcrypt.hash(payload.password || '', Number(config.bcrypt_salt_rounds));
  payload.password = hashedPassword;

  const result = await prisma.users.create({
    data: {
      username: payload.username,
      passwordHash: hashedPassword,
    },
  });
  return {message: 'User created successfully', user: result.username};
}

// Get users from the database with optional filtering and pagination.
const getUsersFromDb = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

    const { username, searchTerm } = filters;

    const andConditions: Prisma.UsersWhereInput[] = [];
    if (searchTerm) {
      andConditions.push({
        OR: userSearchAbleFields.map((field) => ({
          [field]: { contains: searchTerm, mode: "insensitive" },
        })),
      });
    }

    if (username) {
      andConditions.push({
        username: {
          contains: username,
          mode: "insensitive",
        },
      });
    }

  const whereConditions: Prisma.UsersWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.users.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.users.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
}

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
}