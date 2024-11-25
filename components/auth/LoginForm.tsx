"use client";

import { useFormValidate } from "@/hooks/useFormValidate";
import { ChangeEvent, useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { FormCard } from "./FormCard";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormMessage } from "./FormMessage";
import { Submit } from "./Submit";
import { TLoginFormError } from "@/types/form";
import { LoginSchema } from "@/schemas/auth";
import { login } from "@/actions/login";

export function LoginForm() {
    const [error, action] = useActionState(login, undefined);
    const { errors, validateField } = useFormValidate<TLoginFormError>(LoginSchema);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        validateField(name, value);
    };

    useEffect(() => {
        if (error?.errorMessage) {
            toast.error(error.errorMessage);
        }
    }, [error]);

    return (
        <FormCard title="Login" footer={{ label: "Don't have an account yet?", href: "/signup" }}>
            <form action={action} className="space-y-6">
                {/* Email */}
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@example.com"
                        error={!!errors?.email}
                        onChange={handleChange}
                    />
                    {errors?.email && <FormMessage message={errors?.email[0]} />}
                </div>
                {/* Password */}
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="********"
                        error={!!errors?.password}
                        onChange={handleChange}
                    />
                    {errors?.password && <FormMessage message={errors?.password[0]} />}
                </div>
                <Submit className="w-full">Login</Submit>
            </form>
        </FormCard>
    );
}
