import { model, Schema } from "mongoose";
import { z } from "zod";

export const usersModel = model(
    "users",
    new Schema({ 
      username: { type: String, required: [true, 'Pls add username'] }, 
      email: { type: String, required: [true, 'Pls add email'], unique:[true, 'Email address already taken'], index:[true] }, 
      password: { type: String, required: [true, 'pls add password'] },
    },{timestamps:true}),
    'users'
  );

  const commonField = {
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
      password:z.string({
      required_error: "Password is required",
      }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
  }

  export const registerZodSchema = z.object({
    body: z.object({
      username: z.string({
        required_error: "Full name is required",
      }),
      ...commonField
    }),
  });

  export const loginZodSchema = z.object({
    body: z.object(commonField),
  });