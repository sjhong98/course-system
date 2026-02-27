import type { paths } from "@/lib/api/scheme.d";
import createClient from "openapi-fetch";

type SuccessResponse<T> = { data?: T };
type ErrorResponse = { error: { message: string } };

export const api = createClient<paths>({
    baseUrl: "http://localhost:8080",
});

export const errorHandler = async <T>(
    apiCall: () => Promise<SuccessResponse<T>>
): Promise<T> => {
    try {
        const result = await apiCall();

        const isError = (obj: SuccessResponse<T> | ErrorResponse): obj is ErrorResponse => {
            return "error" in obj;
        };
    
        if (isError(result)) {
            throw new Error(result.error.message);
        }

        return result.data as T;
    } catch (error) {
        if (error instanceof Error) throw error;
        throw error;
    }
};