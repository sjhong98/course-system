'use server'

import Column from "@/component/common/flexBox/Column"
import Loading from "@/component/common/ui/Loading"
import PageTitle from "@/component/common/ui/PageTitle"
import CourseCreateForm from "@/component/feature/course/create/CourseCreateForm"
import { Suspense } from "react"

export default async function CourseCreate() {
    return (
        <Column gap={20}>
            <PageTitle title="강의 등록" />
            <CourseCreateForm />
        </Column>
    )
}