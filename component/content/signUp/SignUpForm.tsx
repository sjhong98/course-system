'use client'

import Column from "@/component/common/flexBox/Column";
import Row from "@/component/common/flexBox/Row";
import Button from "@/component/common/ui/Button";
import CheckBox from "@/component/common/ui/CheckBox";
import LabelInput from "@/component/common/ui/LabelInput";
import { useState } from "react";

export default function SignUpForm() {
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        name: "",
        phone: "",
        role: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpForm({
            ...signUpForm,
            [e.target.name]: e.target.value,
        })
    }

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpForm({
            ...signUpForm,
            role: e.target.name,
        })
    }

    return (
        <form>
            <Column gap={20} className='h-full'>
                <LabelInput label="이름" name="name" value={signUpForm.name} onChange={handleChange} />
                <LabelInput label="이메일" name="email" value={signUpForm.email} onChange={handleChange} />
                <LabelInput label="휴대폰 번호" name="phone" value={signUpForm.phone} onChange={handleChange} />
                <LabelInput label="비밀번호" type="password" name="password" value={signUpForm.password} onChange={handleChange} />
                <Row className='w-full'>
                    <CheckBox label="수강생" className='flex-1' name="STUDENT" checked={signUpForm.role === "STUDENT"} onChange={handleRoleChange} />
                    <CheckBox label="강사" className='flex-1' name="INSTRUCTOR" checked={signUpForm.role === "INSTRUCTOR"} onChange={handleRoleChange} />
                </Row>
            </Column>
            <Button className='absolute bottom-0 left-0 right-0'>회원가입</Button>
        </form>
    )
}