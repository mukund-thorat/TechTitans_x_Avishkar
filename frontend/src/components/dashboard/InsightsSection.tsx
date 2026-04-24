import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, BarChart3, TrendingUp, Zap, Target } from "lucide-react";

export default function InsightsSection() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Insights</h2>
                <p className="text-muted-foreground">Detailed analytics of your learning progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <Zap className="size-5 text-primary" />
                        <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12 Days</div>
                        <p className="text-xs text-muted-foreground mt-1">+2 from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <Target className="size-5 text-green-500" />
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">84%</div>
                        <p className="text-xs text-muted-foreground mt-1">Top 5% of students</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <TrendingUp className="size-5 text-blue-500" />
                        <CardTitle className="text-sm font-medium">Time Studied</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">42h</div>
                        <p className="text-xs text-muted-foreground mt-1">This month</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="h-64 flex items-center justify-center border-dashed">
                <CardContent className="text-center">
                    <LineChart className="size-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Progress Visualization coming soon</p>
                    <p className="text-xs text-muted-foreground">We're calculating your learning curves...</p>
                </CardContent>
            </Card>
        </div>
    );
}
