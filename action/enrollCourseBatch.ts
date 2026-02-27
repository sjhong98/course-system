'use server'

import { cookies } from "next/headers";

import { api, errorHandler } from "@/shared/libs/api/api";
import { ApiResponse } from "@/shared/libs/utils/typeGenerator";

const ENROLL_COURSE_BATCH_PATH = "/api/enrollments/batch";
type EnrollCourseBatchResponse = ApiResponse<typeof ENROLL_COURSE_BATCH_PATH, "post">;

export const enrollCourseBatch = async (courseIds: number[]): Promise<EnrollCourseBatchResponse> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    return errorHandler(async () => {
        return api.POST(ENROLL_COURSE_BATCH_PATH, {
            body: {
                courseIds,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    });
}