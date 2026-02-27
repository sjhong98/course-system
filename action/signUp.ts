import { api, errorHandler } from "@/shared/libs/api/api";
import { ApiRequest, ApiResponse } from "@/shared/libs/utils/typeGenerator";

const SIGNUP_PATH = "/api/users/signup";

export async function signUp(signUpForm: ApiRequest<typeof SIGNUP_PATH, "post">) {
    return errorHandler(async () => {
        return api.POST(SIGNUP_PATH, {
            body: signUpForm,
        });
    });
}
