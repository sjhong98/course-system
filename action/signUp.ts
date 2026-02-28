import { api, serializableResponse } from '@/shared/libs/api/api'
import { ApiRequest } from '@/shared/libs/utils/typeGenerator'

const SIGNUP_PATH = '/api/users/signup'

export async function signUp(signUpForm: ApiRequest<typeof SIGNUP_PATH, 'post'>) {
  return serializableResponse(() => api.POST(SIGNUP_PATH, { body: signUpForm }))
}
