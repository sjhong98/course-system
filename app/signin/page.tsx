'use server'

import Column from "@/component/common/flexBox/Column";
import PageTitle from "@/component/common/ui/PageTitle";
import SignInForm from "@/component/feature/signIn/signInForm"

export default async function SignIn() {
  return (
    <Column gap={20}>
      <PageTitle title="로그인" />
      <SignInForm />
    </Column>
  )
}