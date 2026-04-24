export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => ["auth", "me"] as const,
  },
  user: {
    all: ["user"] as const,
    email: () => ["user", "email"] as const,
    authProvider: () => ["user", "auth-provider"] as const,
  },
} as const;
