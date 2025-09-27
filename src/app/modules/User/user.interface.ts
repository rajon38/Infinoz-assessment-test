//import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  id?: string;
  username: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserFilterRequest = {
  username?: string | undefined;
  searchTerm?: string | undefined;
}