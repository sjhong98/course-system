'use server'

import { api, errorHandler } from "@/shared/libs/api/api";

const GET_COURSE_PATH = "/api/courses/{courseId}";

export async function getCourse(courseId: number) {
    return errorHandler(async () => {
        return api.GET(GET_COURSE_PATH, {
            params: {
                path: {
                    courseId,
                },
            },
        })
    })
}