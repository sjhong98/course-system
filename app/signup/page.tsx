'use server'

import Column from "@/component/common/flexBox/Column";
import Loading from "@/component/common/ui/Loading";
import PageTitle from "@/component/common/ui/PageTitle";
import SignUpForm from "@/component/content/signUp/SignUpForm";
import { Suspense } from "react";  

export default async function Signup() {
  return (
    <Column gap={20}> 
      <PageTitle title="회원가입" />

      <Suspense fallback={<Loading />}>
        <SignUpForm />  
      </Suspense>
    </Column>
  )
}