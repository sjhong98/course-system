'use server'

import { api, errorHandler } from "@/lib/api/api";
import { ApiResponse } from "@/lib/utils/typeGenerator";
import { cookies } from "next/headers";

const GET_COURSES_PATH = "/api/courses";

export async function getCourses(page: number) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        const response = await errorHandler(() =>
            api.GET(
                `${GET_COURSES_PATH}?page=${page}` as typeof GET_COURSES_PATH,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
        )

        return response as ApiResponse<typeof GET_COURSES_PATH, "get">;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw error;
    }
}