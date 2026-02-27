'use client'

import { createCourse } from "@/action/createCourse";
import Column from "@/component/common/flexBox/Column";
import { BottomButton } from "@/component/common/ui/BottomButton";
import LabelInput from "@/component/common/ui/LabelInput";
import { ApiRequest } from "@/lib/utils/typeGenerator";
import parseNumber from "@/lib/utils/parseNumber";
import { validateCourseCreateForm } from "@/lib/validation/createCourse";
import type { InvalidResult } from "@/lib/validation/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

type CourseCreateForm = ApiRequest<"/api/courses", "post">;

export default function CourseCreateForm() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [courseCreateForm, setCourseCreateForm] = useState<CourseCreateForm>({
        title: "",
        description: "",
        instructorName: "",
        maxStudents: 1,
        price: 0,
    })
    const [error, setError] = useState<InvalidResult | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCourseCreateForm({
            ...courseCreateForm,
            [e.target.name]: e.target.getAttribute("data-type") === "number"
                ? parseNumber(e, Number(courseCreateForm[e.target.name as keyof CourseCreateForm]))
                : e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setProcessing(true);
            const result = validateCourseCreateForm(courseCreateForm);
            if (!result.ok) {
                setError(result);
                return;
            }
            setError(null);
            await createCourse(result.data);
            await queryClient.invalidateQueries({ queryKey: ["courses"] });
            router.push('/course/list');
            toast.success("강의 등록에 성공했습니다.");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "강의 등록에 실패했습니다.");
        } finally {
            setProcessing(false);
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <Column gap={20}>
                <LabelInput label="강의명" name="title" value={courseCreateForm.title} onChange={handleChange} error={error} />
                <LabelInput label="강의 설명" name="description" value={courseCreateForm.description} onChange={handleChange} error={error} />
                <LabelInput label="강사명" name="instructorName" value={courseCreateForm.instructorName} onChange={handleChange} error={error} />
                <LabelInput label="수강 인원" name="maxStudents" data-type="number" value={courseCreateForm.maxStudents.toLocaleString()} onChange={handleChange} error={error} />
                <LabelInput label="가격" name="price" data-type="number" value={courseCreateForm.price.toLocaleString()} onChange={handleChange} error={error} />
            </Column>
            <BottomButton.Container>
                <BottomButton.Button processing={processing}>강의 개설</BottomButton.Button>
            </BottomButton.Container>
        </form>
    )
}