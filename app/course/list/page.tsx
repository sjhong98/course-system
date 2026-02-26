'use server'

import Column from "@/component/common/flexBox/Column"
import Loading from "@/component/common/ui/Loading"
import PageTitle from "@/component/common/ui/PageTitle"
import CourseList from "@/component/content/course/list/CourseList"
import { Suspense } from "react"

export default async function CourseListPage() {
    return (
        <Column gap={20}>
            <PageTitle title="강의 목록" />

            <Suspense fallback={<Loading />}>
                <CourseList />
            </Suspense>
        </Column>
    )
}