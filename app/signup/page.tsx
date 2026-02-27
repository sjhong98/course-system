'use server'

import Column from "@/components/common/flexBox/Column";
import Loading from "@/components/common/ui/Loading";
import PageTitle from "@/components/common/ui/PageTitle";
import SignUpForm from "@/components/feature/signUp/SignUpForm";
import { Suspense } from "react";

export default async function Signup() {
  return (
    <Column gap={20}>
      <PageTitle title="회원가입" />
      <SignUpForm />
    </Column>
  )
}