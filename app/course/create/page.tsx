'use server'

import { Suspense } from "react";

import Column from "@/shared/components/flexBox/Column";
import Loading from "@/shared/components/ui/Loading";
import PageTitle from "@/shared/components/ui/PageTitle";
import CourseCreateForm from "@/features/course/components/CourseCreateForm";

export default async function CourseCreate() {
    return (
        <Column gap={20}>
            <PageTitle title="강의 등록" />
            <CourseCreateForm />
        </Column>
    )
}