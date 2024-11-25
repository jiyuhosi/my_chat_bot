import { z } from "zod";

export const SignUpSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Please enter your name." })
        .regex(/^[a-zA-Z0-9]+$/, {
            message: "Name can only contain English letters and numbers.",
        }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(4, { message: "Password must be at least 4 characters long." }),
    // .regex(/[A-Z]/, {
    //     message: "Password must contain at least one uppercase letter.",
    // })
    // .regex(/[a-z]/, {
    //     message: "Password must contain at least one lowercase letter.",
    // })
    // .regex(/[0-9]/, {
    //     message: "Password must contain at least one number.",
    // })
    // .regex(/[\W_]/, {
    //     message: "Password must contain at least one special character.",
    // }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Please enter your password.",
    }),
});
