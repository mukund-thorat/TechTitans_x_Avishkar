import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Timer, Trophy, ArrowRight } from "lucide-react";

export default function ExamSection() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Exam Prep</h2>
                    <p className="text-muted-foreground">Test your knowledge and prepare for your finals.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Trophy className="size-4 text-yellow-500" />
                    Leaderboard
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="relative overflow-hidden border-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
                    <CardHeader>
                        <GraduationCap className="size-10 text-primary mb-2" />
                        <CardTitle className="text-2xl">Adaptive Mock Test</CardTitle>
                        <CardDescription>
                            A personalized test that adapts to your performance levels.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <div className="flex items-center gap-1.5">
                                <Timer className="size-4 text-muted-foreground" />
                                45 Mins
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Trophy className="size-4 text-muted-foreground" />
                                100 Points
                            </div>
                        </div>
                        <Button className="w-full gap-2">
                            Start Exam
                            <ArrowRight className="size-4" />
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Upcoming Exams</h3>
                    {[
                        { title: "Mathematics Final", date: "Oct 24", time: "10:00 AM" },
                        { title: "Organic Chemistry", date: "Oct 26", time: "02:00 PM" },
                    ].map((exam, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="bg-muted size-10 rounded-lg flex items-center justify-center font-bold text-primary">
                                    {exam.date.split(' ')[1]}
                                </div>
                                <div>
                                    <p className="font-medium">{exam.title}</p>
                                    <p className="text-xs text-muted-foreground">{exam.date} • {exam.time}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">Details</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
