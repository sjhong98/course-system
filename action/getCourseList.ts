'use server'

import { api, errorHandler } from "@/lib/api/api";
import { cookies } from "next/headers";

const GET_COURSES_PATH = "/api/courses";

export async function getCourseList(page: number, sort?: string) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        return errorHandler(() =>
            api.GET(
                GET_COURSES_PATH,
                {
                    params: {
                        query: {
                            page,
                            sort,
                        },
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            )
        )

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw error;
    }
}