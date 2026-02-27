'use server'

import { cookies } from "next/headers";

import { api, errorHandler } from "@/shared/libs/api/api";
import { ApiRequest, ApiResponse } from "@/shared/libs/utils/typeGenerator";

type CourseCreateForm = ApiRequest<"/api/courses", "post">;

export async function createCourse(course: CourseCreateForm) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    return errorHandler(async () => {
        const response = await api.POST("/api/courses", {
            body: course,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response as ApiResponse<"/api/courses", "post">;
    });
}