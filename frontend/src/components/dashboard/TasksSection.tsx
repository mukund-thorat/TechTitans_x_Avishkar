import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus, Clock, AlertCircle } from "lucide-react";


export default function TasksSection() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
                    <p className="text-muted-foreground">Stay organized and productive with your study schedule.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="size-4" />
                    Add Task
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">8</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">3</div>
                    </CardContent>
                </Card>
                <Card className="bg-red-500/5 border-red-500/20">
                    <CardHeader className="pb-2 text-red-500">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="size-4" />
                            Overdue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-500">2</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Today's Schedule</h3>
                {[
                    { title: "Complete Physics Assignment", time: "10:00 AM", priority: "high", done: false },
                    { title: "Revise Organic Chemistry", time: "02:00 PM", priority: "medium", done: true },
                    { title: "Solve Mock Test #4", time: "05:00 PM", priority: "high", done: false },
                ].map((task, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow ${task.done ? 'opacity-60' : ''}`}>
                        <input type="checkbox" checked={task.done} readOnly className="size-4 rounded border-primary" />
                        <div className="flex-1">
                            <p className={`font-medium ${task.done ? 'line-through' : ''}`}>{task.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Clock className="size-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{task.time}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                                    task.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                                }`}>
                                    {task.priority}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
