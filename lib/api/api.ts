import type { paths } from "@/lib/api/scheme.d";
import createClient from "openapi-fetch";

export const api = createClient<paths>({
    baseUrl: "http://localhost:8080",
});

export const errorHandler = async <T, E>(
    apiCall: () => Promise<{ data?: T; error?: { message?: string } }>,
    options?: { errorMessage?: string }
): Promise<T | E> => {
    try {
        const result = await apiCall();

        // 2xx 응답이 아닌 경우 에러 처리
        if (result.error) {
            throw new Error(result.error.message)
        }
    
        return result.data as T
    } catch (error) {
        if (error instanceof Error) {
            throw error
        }
        throw error
    }
};