import Column from "@/component/common/flexBox/Column";
import Loading from "@/component/common/ui/Loading";
import Title from "@/component/common/ui/PageTitle";
import SignUpForm from "@/component/content/signUp/SignUpForm";
import { Suspense } from "react";

export default function Signup() {
  return (
    <Column gap={20}> 
      <Title title="회원가입" />

      <Suspense fallback={<Loading />}>
        <SignUpForm />
      </Suspense>
    </Column>
  )
}