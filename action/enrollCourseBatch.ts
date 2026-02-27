'use server'

import { api, errorHandler } from "@/lib/api/api";
import { ApiResponse } from "@/lib/utils/typeGenerator";
import { cookies } from "next/headers";

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