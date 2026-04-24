import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "./stats";
import { queryKeys } from "./queryKeys";

export function useLeaderboard() {
  return useQuery({
    queryKey: [queryKeys.STATS, "leaderboard"],
    queryFn: getLeaderboard,
  });
}
