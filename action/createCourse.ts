'use server'

import { api, errorHandler } from "@/lib/api/api";
import { ApiRequest, ApiResponse } from "@/lib/utils/typeGenerator";
import { cookies } from "next/headers";

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