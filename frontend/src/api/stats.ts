import { apiRequest } from "./http";
import type { LeaderboardUser } from "./types";

export async function getLeaderboard(): Promise<LeaderboardUser[]> {
  return apiRequest<LeaderboardUser[]>("/stats/leaderboard", {
    method: "GET",
  });
}
