'use server'

import { api, errorHandler } from "@/lib/api/api";
import { ApiRequest, ApiResponse } from "@/lib/utils/typeGenerator";
import { cookies } from "next/headers";

const LOGIN_PATH = "/api/users/login";

export async function signIn(
    signInForm: ApiRequest<typeof LOGIN_PATH, "post">
) {
    try {
        const response = await errorHandler(() =>
            api.POST(LOGIN_PATH, {
                body: signInForm,
            })
        )
        const { accessToken } = response as ApiResponse<typeof LOGIN_PATH, "post">;
        if (accessToken) {
            const cookieStore = await cookies();
            cookieStore.set("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24,
            })
        }
        return response;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw error;
    }
}
