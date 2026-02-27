'use server'

import CourseList from "@/component/feature/course/list/CourseList"
import { courseListQueryOptions } from "@/lib/query/courseQuery"
import { QueryClient } from "@tanstack/react-query"

const DEFAULT_SORT = "recent"

export default async function CourseListPage() {
    const queryClient = new QueryClient()
    await queryClient.prefetchInfiniteQuery(courseListQueryOptions(DEFAULT_SORT))

    return (
        <CourseList />
    )
}