import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
// user login
const loginUser = async (payload: { username: string; password: string;}) => {
  const userData = await prisma.users.findUnique({
    where: {
      username: payload.username,
    },
  });

  if (!userData?.username) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found! with this username " + payload.username
    );
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.passwordHash
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      username: userData.username,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return { token: accessToken };
};

// get user profile
const getMyProfile = async (userToken: string) => {
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );

  const userProfile = await prisma.users.findUnique({
    where: {
      id: decodedToken.id,
    },
    select: {
      id: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return userProfile;
};

// change password

const changePassword = async (
  userToken: string,
  newPassword: string,
  oldPassword: string
) => {
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );

  const user = await prisma.users.findUnique({
    where: { id: decodedToken?.id },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }


  const isPasswordValid = await bcrypt.compare(oldPassword, user?.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect old password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const result = await prisma.users.update({
    where: {
      id: decodedToken.id,
    },
    data: {
      passwordHash: hashedPassword,
    },
  });
  return { message: "Password changed successfully" };
};


export const AuthServices = {
  loginUser,
  getMyProfile,
  changePassword
};
