import Column from "@/component/common/flexBox/Column";
import Loading from "@/component/common/ui/Loading";
import Title from "@/component/common/ui/PageTitle";
import SignInForm from "@/component/content/signIn/signInForm";
import { Suspense } from "react";

export default function Signup() {
  return (
    <Column gap={20}> 
      <Title title="로그인" />

      <Suspense fallback={<Loading />}>
        <SignInForm />
      </Suspense>
    </Column>
  )
}