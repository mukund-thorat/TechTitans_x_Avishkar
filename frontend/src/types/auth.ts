export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface ApiResponse<T = any> {
    code: string;
    message: string;
    data?: T;
}
