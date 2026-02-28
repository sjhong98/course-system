'use server'

import SignUpForm from '@/features/auth/components/SignUpForm'
import Column from '@/shared/components/flexBox/Column'
import PageTitle from '@/shared/components/ui/PageTitle'

export default async function Signup() {
  return (
    <Column gap={20}>
      <PageTitle title="회원가입" />
      <SignUpForm />
    </Column>
  )
}
