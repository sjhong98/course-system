'use server'

import Column from "@/component/common/flexBox/Column"
import Loading from "@/component/common/ui/Loading"
import PageTitle from "@/component/common/ui/PageTitle"
import CourseList from "@/component/content/course/list/CourseList"
import { PAGE_HEIGHT } from "@/lib/constants/constants"
import { courseListQueryOptions } from "@/lib/query/courseQuery"
import { QueryClient } from "@tanstack/react-query"
import { Suspense } from "react"

const DEFAULT_SORT = "recent"

export default async function CourseListPage() {
    const queryClient = new QueryClient()
    await queryClient.prefetchInfiniteQuery(courseListQueryOptions(DEFAULT_SORT))
    
    return (
        <Column className='relative' style={{ height: PAGE_HEIGHT, maxHeight: PAGE_HEIGHT }}>
            <PageTitle title="강의 목록" />

            <Suspense fallback={<Loading />}>
                <CourseList  />
            </Suspense>
        </Column>
    )
}