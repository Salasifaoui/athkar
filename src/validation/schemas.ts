import { z } from 'zod';

// User Registration Schema
export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
    .trim(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be less than 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { 
      message: "Username can only contain letters, numbers, and underscores" 
    })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(50, { message: "Password must be less than 50 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" }),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(50, { message: "Full name must be less than 50 characters" })
    .optional(),
  bio: z
    .string()
    .max(200, { message: "Bio must be less than 200 characters" })
    .optional(),
});

// User Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, { message: "Password is required" }),
});

// Password Reset Schema
export const passwordResetSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
    .trim(),
});

// New Password Schema
export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(50, { message: "Password must be less than 50 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile Update Schema
export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(50, { message: "Full name must be less than 50 characters" })
    .optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be less than 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { 
      message: "Username can only contain letters, numbers, and underscores" 
    })
    .toLowerCase()
    .trim()
    .optional(),
  bio: z
    .string()
    .max(200, { message: "Bio must be less than 200 characters" })
    .optional(),
  imageUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional(),
});

// Search Schema
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, { message: "Search query is required" })
    .max(100, { message: "Search query must be less than 100 characters" })
    .trim(),
});

// Comment Schema
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment cannot be empty" })
    .max(500, { message: "Comment must be less than 500 characters" })
    .trim(),
});

// Post Schema
export const postSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Post content is required" })
    .max(1000, { message: "Post content must be less than 1000 characters" })
    .trim(),
  imageUrl: z
    .string()
    .url({ message: "Please enter a valid image URL" })
    .optional(),
});

// Contact Form Schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" })
    .trim(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" })
    .max(100, { message: "Subject must be less than 100 characters" })
    .trim(),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" })
    .trim(),
});

// Settings Schema
export const settingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']),
    showEmail: z.boolean(),
    showLocation: z.boolean(),
  }),
  theme: z.enum(['light', 'dark', 'auto']),
  language: z.enum(['en', 'ar']),
});

// Export types
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type PostFormData = z.infer<typeof postSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  try {
    z.string().email().parse(email);
    return true;
  } catch {
    return false;
  }
};

export const validatePassword = (password: string): boolean => {
  try {
    createUserSchema.shape.password.parse(password);
    return true;
  } catch {
    return false;
  }
};

export const validateUsername = (username: string): boolean => {
  try {
    createUserSchema.shape.username.parse(username);
    return true;
  } catch {
    return false;
  }
};

// Password strength checker
export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("At least 8 characters");
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("At least one lowercase letter");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("At least one uppercase letter");
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("At least one number");
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push("At least one special character");
  }

  return { score, feedback };
}; 