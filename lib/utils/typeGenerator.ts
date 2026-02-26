import type { paths } from "@/api/scheme";

/** path + method 의 200 응답 body 타입 (scheme의 Response 등) */
export type ApiResponse<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath]
> = paths[TPath][TMethod] extends {
  responses: { 200: { content: { [media: string]: infer R } } };
}
  ? R
  : never;