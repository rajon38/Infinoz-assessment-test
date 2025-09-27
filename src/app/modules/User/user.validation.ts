import { z } from "zod";

const CreateUserValidationSchema = z.object({
  //email: z.string().email("Invalid email address").min(1, "Email is required"), // Ensure email is provided and is valid

  username: z.string().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
});

export { CreateUserValidationSchema };
const UserLoginValidationSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
});

export const UserValidation = {
  CreateUserValidationSchema,
  UserLoginValidationSchema,
};
