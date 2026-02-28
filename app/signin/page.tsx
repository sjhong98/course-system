'use server'

import Column from '@/shared/components/flexBox/Column'
import PageTitle from '@/shared/components/ui/PageTitle'
import SignInForm from '@/features/auth/components/signInForm'

export default async function SignInPage() {
  return (
    <Column gap={20}>
      <PageTitle title="로그인" />
      <SignInForm />
    </Column>
  )
}
