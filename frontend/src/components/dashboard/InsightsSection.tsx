import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Medal, Crown, Star, TrendingUp, Gift, Calendar, CheckCircle2, Sparkles } from "lucide-react";
import { useLeaderboard } from "@/api/statsHooks";
import { useCurrentUserQuery } from "@/api/authHooks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const LAST_CLAIM_DATE_KEY = "last_xp_claim_date";
const USER_BONUS_XP_KEY = "user_bonus_xp_insights";

export default function InsightsSection() {
    const { data: leaderboard, isLoading: isLeaderboardLoading } = useLeaderboard();
    const { data: currentUser, isLoading: isUserLoading } = useCurrentUserQuery();

    const [bonusXP, setBonusXP] = useState(() => {
        const saved = localStorage.getItem(USER_BONUS_XP_KEY);
        return saved ? parseInt(saved, 10) : 0;
    });

    const [hasClaimed, setHasClaimed] = useState(() => {
        const lastClaim = localStorage.getItem(LAST_CLAIM_DATE_KEY);
        const today = new Date().toDateString();
        return lastClaim === today;
    });

    const handleClaimXP = () => {
        if (hasClaimed) return;
        
        const today = new Date().toDateString();
        localStorage.setItem(LAST_CLAIM_DATE_KEY, today);
        setHasClaimed(true);
        
        const newBonus = bonusXP + 100;
        localStorage.setItem(USER_BONUS_XP_KEY, newBonus.toString());
        setBonusXP(newBonus);

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4f46e5', '#7c3aed', '#ec4899', '#fbbf24']
        });
    };

    const displayLeaderboard = useMemo(() => {
        const baseUserXP = 1540;
        const currentUserXP = baseUserXP + bonusXP;

        // Realistic demo data
        const demoUsers = [
            { id: "d1", firstName: "Alex", lastName: "Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", points: 2840, level: 15 },
            { id: "d2", firstName: "Sarah", lastName: "Miller", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", points: 2650, level: 14 },
            { id: "d3", firstName: "David", lastName: "Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", points: 2420, level: 13 },
            { 
                id: currentUser?.id || "current-user", 
                firstName: currentUser?.firstName || "You", 
                lastName: currentUser?.lastName || "", 
                avatar: currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=You", 
                points: currentUserXP,
                level: 12
            },
            { id: "d5", firstName: "Emma", lastName: "Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", points: 1480, level: 11 },
            { id: "d6", firstName: "James", lastName: "Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", points: 1350, level: 10 },
            { id: "d7", firstName: "Olivia", lastName: "Garcia", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia", points: 1210, level: 9 },
            { id: "d8", firstName: "Lucas", lastName: "Martinez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas", points: 1100, level: 8 },
            { id: "d9", firstName: "Sophia", lastName: "Lopez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia", points: 950, level: 7 },
            { id: "d10", firstName: "Daniel", lastName: "Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel", points: 820, level: 6 },
        ];

        // Ensure current user stays in 4th position (index 3) for demo purposes
        // We sort the others around the user
        const others = demoUsers.filter(u => u.id !== (currentUser?.id || "current-user"));
        others.sort((a, b) => b.points - a.points);

        const top3 = others.slice(0, 3);
        const rest = others.slice(3);
        
        return [...top3, demoUsers.find(u => u.id === (currentUser?.id || "current-user"))!, ...rest];
    }, [currentUser, bonusXP]);

    const isLoading = isLeaderboardLoading || isUserLoading;

    const userPoints = useMemo(() => {
        const user = displayLeaderboard.find(u => u.id === currentUser?.id || u.id === "current-user");
        return user?.points || 0;
    }, [displayLeaderboard, currentUser]);

    const userRank = 4; // Fixed as requested

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* User Points & Rank Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl shadow-indigo-500/20 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Star className="size-24" />
                    </div>
                    <CardHeader>
                        <p className="text-indigo-100 text-sm font-medium">Your Total Points</p>
                        <CardTitle className="text-5xl font-extrabold flex items-baseline gap-2">
                            {isLoading ? <Skeleton className="h-12 w-24 bg-white/20" /> : userPoints.toLocaleString()}
                            <span className="text-xl font-normal text-indigo-200">XP</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-indigo-100 bg-white/10 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                            <Crown className="size-4 text-yellow-400" />
                            Level {Math.floor(userPoints / 150) + 1} Scholar
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Trophy className="size-24" />
                    </div>
                    <CardHeader>
                        <p className="text-slate-400 text-sm font-medium">Community Rank</p>
                        <CardTitle className="text-5xl font-extrabold flex items-baseline gap-2">
                            #{isLoading ? <Skeleton className="h-12 w-24 bg-white/20" /> : userRank}
                            <span className="text-xl font-normal text-slate-500">Overall</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-slate-300 bg-white/10 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                            <TrendingUp className="size-4 text-emerald-400" />
                            Top 1% of students this week
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily XP Claim Card */}
            <Card className="border-none shadow-lg bg-white overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                    
                    <div className="flex items-center gap-5 z-10">
                        <div className={cn(
                            "size-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                            hasClaimed ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600 group-hover:rotate-12"
                        )}>
                            {hasClaimed ? <CheckCircle2 className="size-8" /> : <Gift className="size-8" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                Daily Reward
                                {!hasClaimed && <span className="flex size-2 rounded-full bg-indigo-500 animate-pulse" />}
                            </h3>
                            <p className="text-slate-500 text-sm font-medium">
                                {hasClaimed ? "You've collected today's XP! Come back tomorrow." : "Claim your 100 XP daily bonus to climb the leaderboard."}
                            </p>
                        </div>
                    </div>

                    <Button 
                        onClick={handleClaimXP}
                        disabled={hasClaimed}
                        className={cn(
                            "relative overflow-hidden h-12 px-8 rounded-xl font-bold transition-all duration-300 active:scale-95 shadow-lg",
                            hasClaimed 
                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none" 
                                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                        )}
                    >
                        {hasClaimed ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="size-4" /> Claimed
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Claim 100 XP <Sparkles className="size-4" />
                            </span>
                        )}
                    </Button>
                </div>
            </Card>

            {/* Leaderboard Card */}
            <Card className="shadow-lg border-muted/40 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 bg-slate-50/50">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="size-6 text-yellow-500" />
                            Global Leaderboard
                        </CardTitle>
                        <CardDescription>Top performers based on weekly activity and performance</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 uppercase tracking-widest">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Results
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4">
                                    <Skeleton className="size-10 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-3 w-1/4" />
                                    </div>
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            ))
                        ) : displayLeaderboard.map((user, index) => {
                            const isCurrentUser = user.id === currentUser?.id || user.id === "current-user";
                            const isTop3 = index < 3;
                            
                            return (
                                <div 
                                    key={user.id} 
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group",
                                        isCurrentUser 
                                            ? "bg-indigo-50/80 border border-indigo-100 ring-4 ring-indigo-500/5 shadow-md scale-[1.01] z-10 relative" 
                                            : "hover:bg-slate-50 border border-transparent"
                                    )}
                                >
                                    <div className="flex items-center justify-center size-10 rounded-xl bg-slate-100 text-sm font-black text-slate-500 transition-colors group-hover:bg-white group-hover:shadow-sm">
                                        {index === 0 ? <Crown className="size-6 text-yellow-500 drop-shadow-sm animate-bounce-subtle" /> : 
                                         index === 1 ? <Trophy className="size-6 text-slate-400 drop-shadow-sm" /> :
                                         index === 2 ? <Trophy className="size-6 text-amber-600 drop-shadow-sm" /> :
                                         <span className="opacity-60">{index + 1}</span>}
                                    </div>
                                    
                                    <div className="relative">
                                        <Avatar className={cn(
                                            "size-12 border-2 shadow-sm transition-transform duration-500 group-hover:scale-110",
                                            isCurrentUser ? "border-indigo-400" : "border-white"
                                        )}>
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{user.firstName[0]}{user.lastName ? user.lastName[0] : ""}</AvatarFallback>
                                        </Avatar>
                                        {isTop3 && (
                                            <div className={cn(
                                                "absolute -top-1 -right-1 size-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm",
                                                index === 0 ? "bg-yellow-500" : index === 1 ? "bg-slate-300" : "bg-amber-600"
                                            )}>
                                                <Star className="size-2.5 text-white fill-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-900 leading-none">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            {isCurrentUser && (
                                                <span className="text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm shadow-indigo-200">
                                                    You
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight flex items-center gap-1">
                                                Level {user.level || Math.floor(user.points / 200) + 1}
                                            </p>
                                            <span className="size-1 rounded-full bg-slate-300" />
                                            <p className="text-[11px] text-indigo-500 font-bold uppercase tracking-tight">
                                                {isCurrentUser ? "Active Now" : "2h ago"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className={cn(
                                            "text-lg font-black tracking-tighter leading-none",
                                            isCurrentUser ? "text-indigo-600" : "text-slate-900"
                                        )}>
                                            {user.points.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">XP</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

