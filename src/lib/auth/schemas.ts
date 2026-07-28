/**
 * Form validation schemas + action-state shapes shared between the server
 * actions and the client forms. Kept free of `server-only`/Node imports so the
 * `FormState` types can be imported by the client `useActionState` forms.
 */
import * as z from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Enter your full name (at least 2 characters)." })
    .trim(),
  studioName: z
    .string()
    .min(2, { error: "Enter your studio or brand name." })
    .trim(),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z
    .string()
    .min(8, { error: "Use at least 8 characters." })
    .regex(/[a-zA-Z]/, { error: "Include at least one letter." })
    .regex(/[0-9]/, { error: "Include at least one number." }),
});

export const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z.string().min(1, { error: "Enter your password." }),
});

export type RegisterState =
  | {
      errors?: {
        name?: string[];
        studioName?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
      values?: { name?: string; studioName?: string; email?: string };
    }
  | undefined;

export type LoginState =
  | {
      errors?: { email?: string[]; password?: string[] };
      message?: string;
      values?: { email?: string };
    }
  | undefined;
