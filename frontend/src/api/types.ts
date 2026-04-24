export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ResponseModel {
  code: string;
  message: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface LoginOtpRequest {
  email: string;
  otp: string;
}

export interface LoginOtpResponse {
  loginToken: string;
  tokenType: string;
}

export interface PasswordRecoveryOtpVerifyRequest {
  email: string;
  otp: string;
}

export interface PasswordRecoveryTokenResponse {
  recoveryToken: string;
  tokenType: string;
}

export interface PasswordRecoveryRequest {
  password?: string;
}

export interface UserProfileUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | null;
}

export interface UserEmailResponse {
  email: string;
}

export interface UserAuthProviderResponse {
  authServiceProvider: string;
}

export interface PasswordChangeRequest {
  otp: string;
  newPassword?: string;
}

export type MediaType = "image" | "video" | "audio" | "document" | "other";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface LeaderboardUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  points: number;
}

