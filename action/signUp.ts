import { api, errorHandler } from "@/lib/api/api";
import { ApiRequest, ApiResponse } from "@/lib/utils/typeGenerator";

const SIGNUP_PATH = "/api/users/signup";

export async function signUp(signUpForm: ApiRequest<typeof SIGNUP_PATH, "post">) {
    return errorHandler(async () => {
        const response = await api.POST(SIGNUP_PATH, {
            body: signUpForm,
        });
        return response as ApiResponse<typeof SIGNUP_PATH, "post">;
    }, { 
        errorMessage: "회원가입에 실패했습니다.",
    });
}
