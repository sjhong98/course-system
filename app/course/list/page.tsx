'use server'

import { getCourses } from "@/action/getCourses"
import Column from "@/component/common/flexBox/Column"
import Loading from "@/component/common/ui/Loading"
import PageTitle from "@/component/common/ui/PageTitle"
import CourseList from "@/component/content/course/list/CourseList"
import { Suspense } from "react"

export default async function CourseListPage() {
    const courseListResponse = await getCourses();
    return (
        <Column gap={20} className='h-full relative'>
            <PageTitle title="강의 목록" />

            <Suspense fallback={<Loading />}>
                <CourseList initialCourseListResponse={courseListResponse} />
            </Suspense>
        </Column>
    )
}