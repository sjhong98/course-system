import type { paths } from '@/shared/libs/api/scheme'

// scheme 타입 자동 생성

export type ApiResponse<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = paths[TPath][TMethod] extends {
  responses: { 200: { content: { [media: string]: infer R } } }
}
  ? R
  : never

export type ApiRequest<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = paths[TPath][TMethod] extends {
  requestBody: { content: { [media: string]: infer R } }
}
  ? R
  : never
