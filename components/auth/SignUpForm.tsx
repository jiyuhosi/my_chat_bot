"use client";
import { ChangeEvent, useActionState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FormCard } from "./FormCard";
import { Submit } from "./Submit";
import { useFormValidate } from "@/hooks/useFormValidate";
import { SignUpSchema } from "@/schemas/auth";
import { TSignUpFormError } from "@/types/form";
import { FormMessage } from "./FormMessage";

import { signUp } from "@/actions/signup";
import toast from "react-hot-toast";

export function SignUpForm() {
    const [error, action] = useActionState(signUp, undefined);
    const { errors, validateField } = useFormValidate<TSignUpFormError>(SignUpSchema);

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
        <FormCard title="Sign Up" footer={{ label: "Already have an account?", href: "/login" }}>
            <form action={action} className="space-y-6">
                {/* Name */}
                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        error={!!errors?.name}
                        onChange={handleChange}
                    />
                    {errors?.name && <FormMessage message={errors?.name[0]} />}
                </div>
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
                <Submit className="w-full">Sign Up</Submit>
            </form>
        </FormCard>
    );
}
