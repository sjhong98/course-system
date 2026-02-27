import type { paths } from "@/lib/api/scheme";

export type ApiResponse<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath]
> = paths[TPath][TMethod] extends {
  responses: { 200: { content: { [media: string]: infer R } } };
}
  ? R
  : never;

export type ApiRequest<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath]
> = paths[TPath][TMethod] extends {
  requestBody: { content: { [media: string]: infer R } };
}
  ? R
  : never;