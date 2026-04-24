import { useCurrentUserQuery } from "@/api/authHooks";
import { useNotesQuery } from "@/api/notesHooks";
import { useLeaderboard } from "@/api/statsHooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    CheckCircle2, 
    FileText, 
    Clock, 
    Calendar, 
    Trophy, 
    Zap, 
    Sparkles, 
    Plus, 
    ArrowUpRight,
    Shield,
    Flame,
    TrendingUp,
    PlayCircle
} from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export default function OverviewSection({ onNavigate }: { onNavigate: (section: string) => void }) {
    const { data: user } = useCurrentUserQuery();
    const { data: notes } = useNotesQuery();

    const { data: leaderboard } = useLeaderboard();

    // Derived stats or demo fallbacks
    const stats = useMemo(() => [
        { 
            label: "Tasks Completed", 
            value: "12/15", 
            change: "+3 today", 
            icon: CheckCircle2, 
            color: "text-emerald-600", 
            bg: "bg-emerald-50",
            section: "tasks"
        },
        { 
            label: "Active Notes", 
            value: notes?.length || "8", 
            change: "2 new this week", 
            icon: FileText, 
            color: "text-primary", 
            bg: "bg-primary/10",
            section: "notes"
        },
        { 
            label: "Focused Today", 
            value: "145m", 
            change: "Top 5% today", 
            icon: Clock, 
            color: "text-amber-600", 
            bg: "bg-amber-50",
            section: "exam"
        },
        { 
            label: "Current Streak", 
            value: "12 Days", 
            change: "Personal Best!", 
            icon: Flame, 
            color: "text-orange-600", 
            bg: "bg-orange-50",
            section: "insights"
        }
    ], [notes]);

    const userXP = 1540; // Base from InsightsSection
    const userLevel = Math.floor(userXP / 150) + 1;
    const nextLevelXP = (userLevel) * 150;
    const currentLevelProgress = ((userXP % 150) / 150) * 100;

    // Try to find user rank from leaderboard
    const userRank = useMemo(() => {
        if (!leaderboard || !user) return 4;
        const index = leaderboard.findIndex(u => u.id === user.id);
        return index !== -1 ? index + 1 : 4;
    }, [leaderboard, user]);

    const quickActions = [
        { label: "Capture Task", icon: Plus, section: "tasks" },
        { label: "Write Note", icon: FileText, section: "notes" },
        { label: "Start Focus", icon: PlayCircle, section: "exam" },
    ];

    const priorityTasks = [
        { title: "Advanced Calculus Revision", deadline: "Today, 5:00 PM", priority: "high" },
        { title: "Organic Chemistry mechanisms", deadline: "Tomorrow", priority: "medium" },
        { title: "Mock Test Analysis", deadline: "2 days left", priority: "medium" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-[#1A1917] p-8 text-[#FAF8F4] shadow-2xl border border-white/5 group">
                <div className="absolute -right-20 -top-20 size-80 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-700" />
                <div className="absolute -left-20 -bottom-20 size-60 bg-amber-500/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-bold uppercase tracking-widest text-primary-foreground/90">
                                Welcome Back
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Hey, {user?.firstName || "Scholar"}! <span className="inline-block animate-bounce-subtle">👋</span>
                        </h1>
                        <p className="text-white/70 text-lg max-w-xl font-medium">
                            Your work at a glance. You've completed <span className="text-primary font-bold">80%</span> of your goals this week. Keep up the momentum!
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-inner">
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Daily Goal</p>
                            <p className="text-2xl font-black text-white">4/5 hrs</p>
                        </div>
                        <div className="size-12 rounded-full border-4 border-primary/30 border-t-primary flex items-center justify-center relative">
                            <Zap className="size-5 text-primary fill-primary" />
                        </div>
                    </div>
                </div>
            </div>

            {/* High-level Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="group hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md border-primary/5" onClick={() => onNavigate(stat.section)}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-3 rounded-2xl transition-colors", stat.bg)}>
                                    <stat.icon className={cn("size-6", stat.color)} />
                                </div>
                                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">{stat.label}</p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
                                    <span className="text-[10px] font-bold text-emerald-600">{stat.change}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Progress & Heatmap */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Scholar Level Card */}
                    <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary/5 via-white to-white relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
                                        <Trophy className="size-5" />
                                    </div>
                                    <CardTitle className="text-xl">Scholar Progression</CardTitle>
                                </div>
                                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest border border-primary/10">
                                    Rank #{userRank}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-6">
                            <div className="flex items-end justify-between mb-2">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">Level {userLevel}</p>
                                    <h4 className="text-3xl font-black text-foreground tracking-tight">Master Sage</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-primary">{userXP} / {nextLevelXP} XP</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{nextLevelXP - userXP} XP to next level</p>
                                </div>
                            </div>
                            <div className="relative h-4 w-full bg-muted/50 rounded-full overflow-hidden shadow-inner border border-border">
                                <div 
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                                    style={{ width: `${currentLevelProgress}%` }}
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] bg-[length:200%_100%] animate-shimmer" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Flame className="size-4 text-orange-600" />
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Consistency</p>
                                    </div>
                                    <p className="text-lg font-black">98%</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp className="size-4 text-emerald-600" />
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Growth</p>
                                    </div>
                                    <p className="text-lg font-black">+12.4%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Consistency Heatmap */}
                    <Card className="shadow-lg border-muted/30">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Calendar className="size-5 text-muted-foreground" />
                                    Consistency Map
                                </CardTitle>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-muted-foreground font-bold">Less</span>
                                    <div className="flex gap-1">
                                        {[0, 1, 2, 3, 4].map(i => (
                                            <div key={i} className={cn("size-2 rounded-sm", 
                                                i === 0 ? "bg-muted" : 
                                                i === 1 ? "bg-primary/20" : 
                                                i === 2 ? "bg-primary/40" : 
                                                i === 3 ? "bg-primary/70" : "bg-primary"
                                            )} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-bold ml-0.5">More</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex flex-wrap gap-1.5">
                                {Array.from({ length: 52 }).map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={cn(
                                            "size-3.5 sm:size-4 rounded-sm transition-all duration-300 hover:scale-125 hover:shadow-md cursor-pointer",
                                            Math.random() > 0.3 
                                                ? (Math.random() > 0.5 ? "bg-primary" : "bg-primary/30") 
                                                : "bg-muted/50"
                                        )} 
                                        title={`Activity: ${Math.floor(Math.random() * 100)}%`}
                                    />
                                ))}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-4 font-medium italic">
                                "Success is the sum of small efforts, repeated day in and day out."
                            </p>
                        </CardContent>
                    </Card>

                    {/* Recent Activity / Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-lg border-muted/30 group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg">Priority Queue</CardTitle>
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-primary hover:bg-primary/5" onClick={() => onNavigate('tasks')}>
                                    View All
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {priorityTasks.map((task, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <div className={cn(
                                            "size-2 rounded-full",
                                            task.priority === 'high' ? "bg-rose-500" : "bg-primary"
                                        )} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{task.title}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">{task.deadline}</p>
                                        </div>
                                        <CheckCircle2 className="size-4 text-muted-foreground/30 hover:text-emerald-500 cursor-pointer transition-colors" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-muted/30">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg">Recent Notes</CardTitle>
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-primary hover:bg-primary/5" onClick={() => onNavigate('notes')}>
                                    Open Vault
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {notes?.slice(0, 3).map((note, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-white hover:shadow-sm transition-all cursor-pointer" onClick={() => onNavigate('notes')}>
                                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="size-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{note.title}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">{new Date(note.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )) || (
                                    <div className="text-center py-6">
                                        <p className="text-xs text-muted-foreground">No notes yet</p>
                                        <Button variant="link" className="h-auto text-[10px] p-0" onClick={() => onNavigate('notes')}>Create your first note</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Actions & Schedule */}
                <div className="space-y-8">
                    {/* Quick Launch */}
                    <Card className="shadow-xl border-none bg-foreground text-background overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Sparkles className="size-5 text-primary" />
                                Quick Launch
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">Jump right into action</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            {quickActions.map((action, i) => (
                                <button 
                                    key={i} 
                                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                                    onClick={() => onNavigate(action.section)}
                                >
                                    <action.icon className="size-6 text-primary" />
                                    <span className="text-[11px] font-bold uppercase tracking-tight">{action.label}</span>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Today's Schedule */}
                    <Card className="shadow-lg border-muted/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="size-5 text-muted-foreground" />
                                Today's Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-6">
                            <div className="space-y-4">
                                <div className="relative pl-6 border-l-2 border-primary/30 pb-2">
                                    <div className="absolute -left-1.5 top-0 size-3 rounded-full bg-primary shadow-[0_0_8px_rgba(232,133,42,0.5)]" />
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Now</p>
                                    <p className="text-sm font-bold mt-0.5">Deep Focus Session</p>
                                    <p className="text-xs text-muted-foreground">Quantum Physics module</p>
                                </div>
                                <div className="relative pl-6 border-l-2 border-border pb-2 opacity-60">
                                    <div className="absolute -left-1.5 top-0 size-3 rounded-full bg-muted-foreground/30" />
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">2:00 PM</p>
                                    <p className="text-sm font-bold mt-0.5">Note Consolidation</p>
                                    <p className="text-xs text-muted-foreground">3 YouTube lectures pending</p>
                                </div>
                                <div className="relative pl-6 border-l-2 border-border opacity-60">
                                    <div className="absolute -left-1.5 top-0 size-3 rounded-full bg-muted-foreground/30" />
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">5:00 PM</p>
                                    <p className="text-sm font-bold mt-0.5">Daily Review</p>
                                    <p className="text-xs text-muted-foreground">15 mins wrap-up</p>
                                </div>
                            </div>
                            <Button className="w-full gap-2 rounded-xl h-11 bg-muted text-foreground border border-border hover:bg-accent shadow-none transition-colors" onClick={() => onNavigate('tasks')}>
                                <Calendar className="size-4" />
                                Open Full Planner
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Motivational Quote or AI Insight */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-amber-500/10 border border-primary/20 text-center space-y-3">
                        <div className="size-10 rounded-full bg-background flex items-center justify-center mx-auto shadow-sm">
                            <Sparkles className="size-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-foreground italic leading-relaxed">
                            "You're in the top 5% of active students this week. Your consistency with Advanced Calculus is impressive."
                        </p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">- AI Study Buddy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
