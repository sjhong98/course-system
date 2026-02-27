'use server'

import { Suspense } from "react";

import Column from "@/shared/components/flexBox/Column";
import Loading from "@/shared/components/ui/Loading";
import PageTitle from "@/shared/components/ui/PageTitle";
import SignUpForm from "@/features/auth/components/SignUpForm";

export default async function Signup() {
  return (
    <Column gap={20}>
      <PageTitle title="회원가입" />
      <SignUpForm />
    </Column>
  )
}