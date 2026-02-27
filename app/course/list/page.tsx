'use server'

import { QueryClient } from "@tanstack/react-query";

import CourseList from "@/features/course/components/CourseList";
import { courseListQueryOptions } from "@/features/course/query/courseQuery";

const DEFAULT_SORT = "recent";

export default async function CourseListPage() {
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery(courseListQueryOptions(DEFAULT_SORT));

    return (
        <CourseList />
    )
}