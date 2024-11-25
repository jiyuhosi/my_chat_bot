"use server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schemas/auth";
import { redirect } from "next/navigation";
import { createSession } from "./sessions";

export const login = async (_: any, formData: FormData) => {
    // 1. Validate fields
    const validatedFields = LoginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            errorMessage: "Invalid input values.",
        };
    }
    // 2. Check if the user exists
    const { email, password } = validatedFields.data;

    try {
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return {
                errorMessage: "User does not exist. Please sign up.",
            };
        }

        const { id, name, password: userPassword } = existingUser;
        const passwordMatch = await bcrypt.compare(password, userPassword);

        if (!passwordMatch) {
            return {
                errorMessage: "Password does not match.",
            };
        }

        // Create session
        await createSession({ id, name });
    } catch (error) {
        console.error("error", error);
        return {
            errorMessage: "An issue occurred.",
        };
    }

    redirect("/");
};
