'use client'

import Column from "@/component/common/flexBox/Column";
import Button from "@/component/common/ui/Button";
import LabelInput from "@/component/common/ui/LabelInput";

export default function SignInForm() {
    return (
        <form>
            <Column gap={20}>
                <LabelInput label="이메일" />
                <LabelInput label="비밀번호" />
            </Column>
            <Button className='absolute bottom-0 left-0 right-0'>로그인</Button>
        </form>
    )
}