'use server'

import { api, errorHandler } from "@/lib/api/api";
import { cookies } from "next/headers";

const ENROLL_COURSE_PATH = "/api/courses/{courseId}/enroll";

export const enrollCourse = async (courseId: number) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    return errorHandler(async () => {
        return api.POST(ENROLL_COURSE_PATH, {
            params: {
                path: {
                    courseId,
                },
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
    });
}