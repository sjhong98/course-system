'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { signIn } from "@/action/signIn";
import { signUp } from "@/action/signUp";
import Column from "@/shared/components/flexBox/Column";
import Row from "@/shared/components/flexBox/Row";
import { BottomButton } from "@/shared/components/ui/BottomButton";
import CheckBox from "@/shared/components/ui/CheckBox";
import LabelInput from "@/shared/components/ui/LabelInput";
import { validateSignUpForm } from "@/features/auth/validation/signUp";
import { ApiRequest } from "@/shared/libs/utils/typeGenerator";
import { InvalidResult } from "@/shared/validation/types";

export default function SignUpForm() {
    const router = useRouter();
    const [signUpForm, setSignUpForm] = useState<ApiRequest<"/api/users/signup", "post">>({
        email: "",
        password: "",
        name: "",
        phone: "",
        role: "STUDENT"
    })
    const [error, setError] = useState<InvalidResult | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpForm({
            ...signUpForm,
            [e.target.name]: e.target.value,
        })
    }

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpForm({
            ...signUpForm,
            role: e.target.name as "STUDENT" | "INSTRUCTOR",
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setProcessing(true);
    
            const result = validateSignUpForm(signUpForm);
            if (!result.ok) {
                setError(result);
                return;
            }
            await signUp(signUpForm);
            await signIn({email: signUpForm.email, password: signUpForm.password});
    
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "회원가입 처리 중 오류가 발생했습니다.");
        } finally {
            setProcessing(false);
            router.push('/course/list')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Column gap={20} className='h-full'>
                <LabelInput label="이름" name="name" value={signUpForm.name} onChange={handleChange} error={error} />
                <LabelInput label="이메일" name="email" value={signUpForm.email} onChange={handleChange} error={error} />
                <LabelInput label="휴대폰 번호" name="phone" value={signUpForm.phone} onChange={handleChange} error={error} />
                <LabelInput label="비밀번호" type="password" name="password" value={signUpForm.password} onChange={handleChange} error={error} />
                <Row className='w-full'>
                    <CheckBox label="수강생" className='flex-1' name="STUDENT" checked={signUpForm.role === "STUDENT"} onChange={handleRoleChange} />
                    <CheckBox label="강사" className='flex-1' name="INSTRUCTOR" checked={signUpForm.role === "INSTRUCTOR"} onChange={handleRoleChange} />
                </Row>
            </Column>
            <BottomButton.Container type="submit">
                <BottomButton.Button processing={processing}>회원가입</BottomButton.Button>
            </BottomButton.Container>
        </form>
    )
}