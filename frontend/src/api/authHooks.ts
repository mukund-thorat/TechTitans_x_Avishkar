import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authApi from "./auth";
import { invalidateMany } from "./hookUtils";
import { queryKeys } from "./queryKeys";
import {useNavigate} from "react-router-dom";

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: ({ signal }) => authApi.getCurrentUser({ signal }),
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof authApi.updateCurrentUser>[0]) =>
      authApi.updateCurrentUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

export function useUserEmailQuery() {
  return useQuery({
    queryKey: queryKeys.user.email(),
    queryFn: ({ signal }) => authApi.getUserEmail({ signal }),
  });
}

export function useUserAuthProviderQuery() {
  return useQuery({
    queryKey: queryKeys.user.authProvider(),
    queryFn: ({ signal }) => authApi.getUserAuthProvider({ signal }),
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: Parameters<typeof authApi.login>[0]) => authApi.login(payload),
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.access_token)
      navigate("/dashboard")
      await invalidateMany(queryClient, [queryKeys.auth.all, queryKeys.user.all]);
    },
    onError: (error) => {
      console.error("Registration failed", error)
    },
  });
}

export function useRefreshTokenMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    onSuccess: async () => {
      await invalidateMany(queryClient, [queryKeys.auth.all, queryKeys.user.all]);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      await invalidateMany(queryClient, [queryKeys.auth.all, queryKeys.user.all]);
      localStorage.removeItem("access_token");
      queryClient.removeQueries({queryKey: ["me"]});
      navigate("/login", { replace: true });
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof authApi.register>[0]) => authApi.register(payload),
  });
}

export function useRequestLoginOtpMutation() {
  return useMutation({
    mutationFn: (email: string) => authApi.requestLoginOtp(email),
  });
}

export function useVerifyLoginOtpMutation() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof authApi.verifyLoginOtp>[0]) =>
      authApi.verifyLoginOtp(payload),
  });
}

export function useLoginWithTokenMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authApi.loginWithToken(token),
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.access_token);
      await invalidateMany(queryClient, [queryKeys.auth.all, queryKeys.user.all]);
    },
  });
}

export function useRequestPasswordRecoveryOtpMutation() {
  return useMutation({
    mutationFn: (email: string) => authApi.requestPasswordRecoveryOtp(email),
  });
}

export function useVerifyPasswordRecoveryOtpMutation() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof authApi.verifyPasswordRecoveryOtp>[0]) =>
      authApi.verifyPasswordRecoveryOtp(payload),
  });
}

export function useRecoverPasswordMutation() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof authApi.recoverPassword>[0]) =>
      authApi.recoverPassword(payload),
  });
}

export function useVerifyPasswordForChangeMutation() {
  return useMutation({
    mutationFn: (password: string) => authApi.verifyPasswordForChange(password),
  });
}

export function useChangePasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof authApi.changePassword>[0]) =>
      authApi.changePassword(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.authProvider() });
    },
  });
}

export function useVerifyPasswordForDeleteAccountMutation() {
  return useMutation({
    mutationFn: (password: string) => authApi.verifyPasswordForDeleteAccount(password),
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (otp: string) => authApi.deleteAccount(otp),
    onSuccess: async () => {
      await invalidateMany(queryClient, [queryKeys.auth.all, queryKeys.user.all]);
    },
  });
}

export function useGoogleFinalizeMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: { email: string; avatar: string }) =>
      authApi.googleFinalize(payload),
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.access_token);
      await invalidateMany(queryClient, [queryKeys.auth.all, queryKeys.user.all]);
      navigate("/dashboard");
    },
  });
}
