import prisma from "../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../config";
export const initiateSuperAdmin = async () => {
  const hashedPassword=await bcrypt.hash('mypassword',Number(config.bcrypt_salt_rounds))
  const payload: any = {
    username: 'abc',
    passwordHash: hashedPassword,
  };

  const isExistUser = await prisma.users.findUnique({
    where: {
      username: payload.username,
    },
  });

  if (isExistUser) return;

  await prisma.users.create({
    data: payload,
  });
};
