'use client'

import Column from "@/component/common/flexBox/Column";

import LabelInput from "@/component/common/ui/LabelInput";
import { useState } from "react";

export default function SignInForm() {
    const [signInForm, setSignInForm] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignInForm({
            ...signInForm,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <form>
            <Column gap={20}>
                <LabelInput label="이메일" name="email" value={signInForm.email} onChange={handleChange} />
                <LabelInput label="비밀번호" name="password" value={signInForm.password} onChange={handleChange} />
            </Column>
            {/* <BottomButton /> */}
        </form>
    )
}