'use client'

import Column from "@/component/common/flexBox/Column";
import LabelInput from "@/component/common/ui/LabelInput";
import parseNumber from "@/lib/utils/parseNumber";
import { useState } from "react";

interface CourseCreateForm {
    name: string;
    description: string;
    maxStudents: number;
    price: number;
}

export default function CourseCreateForm() {
    const [courseCreateForm, setCourseCreateForm] = useState<CourseCreateForm>({
        name: "",
        description: "",
        maxStudents: 1, // 1 이상
        price: 0, // 0 이상
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCourseCreateForm({
            ...courseCreateForm,
            [e.target.name]: e.target.getAttribute("aria-type") === "number"
                ? parseNumber(e, Number(courseCreateForm[e.target.name as keyof CourseCreateForm]))
                : e.target.value,
        })
    }

    return (
        <form>
            <Column gap={20}>
                <LabelInput label="강의명" name="name" value={courseCreateForm.name} onChange={handleChange} />
                <LabelInput label="강의 설명" name="description" value={courseCreateForm.description} onChange={handleChange} />
                <LabelInput label="수강 인원" name="maxStudents" aria-type="number" value={courseCreateForm.maxStudents.toLocaleString()} onChange={handleChange} />
                <LabelInput label="가격" name="price" aria-type="number" value={courseCreateForm.price.toLocaleString()} onChange={handleChange} />
            </Column>
        </form>
    )
}