'use server'

import Column from "@/component/common/flexBox/Column";
import Loading from "@/component/common/ui/Loading";
import PageTitle from "@/component/common/ui/PageTitle";
import SignInForm from "@/component/content/signIn/signInForm";
import { Suspense } from "react";

export default async function SignIn() {
  return (
    <Column gap={20}> 
      <PageTitle title="로그인" />

      <Suspense fallback={<Loading />}>
        <SignInForm />
      </Suspense>
    </Column>
  )
}