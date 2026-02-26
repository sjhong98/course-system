'use server'

import Column from "@/component/common/flexBox/Column"
import Loading from "@/component/common/ui/Loading"
import PageTitle from "@/component/common/ui/PageTitle"
import CourseList from "@/component/content/course/list/CourseList"
import { courseListQueryOptions } from "@/lib/query/courseQuery"
import { QueryClient } from "@tanstack/react-query"
import { Suspense } from "react"

export default async function CourseListPage() {
    const queryClient = new QueryClient()
    await queryClient.prefetchInfiniteQuery(courseListQueryOptions)
    
    return (
        <Column gap={20} className='h-full relative'>
            <PageTitle title="강의 목록" />

            <Suspense fallback={<Loading />}>
                <CourseList  />
            </Suspense>
        </Column>
    )
}