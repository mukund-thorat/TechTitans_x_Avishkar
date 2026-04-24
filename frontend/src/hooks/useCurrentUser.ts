import { useCurrentUserQuery } from "@/api/authHooks";

export const useCurrentUser = () => {
    return useCurrentUserQuery();
};
