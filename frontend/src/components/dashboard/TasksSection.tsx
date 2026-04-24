"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Plus, Clock, AlertCircle, 
    Trash2, Edit2, Sparkles, Check, X 
} from "lucide-react";
import { toast } from "sonner";

interface Subtask {
    id: string;
    title: string;
    done: boolean;
    isEditing?: boolean;
}

interface Task {
    id: string;
    title: string;
    time: string;
    priority: 'high' | 'medium' | 'low';
    done: boolean;
    subtasks: Subtask[];
    aiSuggestions?: string[];
    showAI?: boolean;
    isEditing?: boolean;
}

export default function TasksSection() {
    const [tasks, setTasks] = useState<Task[]>([
        { 
            id: '1',
            title: "Complete Physics Assignment", 
            time: "10:00 AM", 
            priority: "high", 
            done: false,
            subtasks: [
                { id: 's1', title: "Review Newton's Laws", done: true },
                { id: 's2', title: "Complete problems 1-10", done: false },
            ],
            aiSuggestions: [
                "Recommended: Feynman Technique for better retention.",
                "Estimated time: 45 mins.",
                "Tip: Focus on the 3rd law problems first."
            ]
        },
        { 
            id: '2',
            title: "Revise Organic Chemistry", 
            time: "02:00 PM", 
            priority: "medium", 
            done: true,
            subtasks: [],
            aiSuggestions: ["Use flashcards for reaction mechanisms."]
        },
        { 
            id: '3',
            title: "Solve Mock Test #4", 
            time: "05:00 PM", 
            priority: "high", 
            done: false,
            subtasks: [
                { id: 's3', title: "Setup timer for 3 hours", done: false },
                { id: 's4', title: "Analyze previous mistakes", done: false },
            ]
        },
    ]);

    const [newTaskTitle, setNewTaskTitle] = useState("");

    // Task Actions
    const addTask = () => {
        if (!newTaskTitle.trim()) return;
        const newTask: Task = {
            id: Date.now().toString(),
            title: newTaskTitle,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            priority: 'medium',
            done: false,
            subtasks: [],
            aiSuggestions: ["Break this down into smaller steps.", "Set a timer for 25 minutes."]
        };
        setTasks([newTask, ...tasks]);
        setNewTaskTitle("");
        toast.success("Task added successfully");
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const newDone = !t.done;
                return { 
                    ...t, 
                    done: newDone, 
                    subtasks: t.subtasks.map(s => ({ ...s, done: newDone })) 
                };
            }
            return t;
        }));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
        toast.info("Task removed");
    };

    const renameTask = (id: string, newTitle: string) => {
        if (!newTitle.trim()) return;
        setTasks(tasks.map(t => t.id === id ? { ...t, title: newTitle, isEditing: false } : t));
    };

    // Subtask Actions
    const addSubtask = (parentId: string) => {
        setTasks(tasks.map(t => {
            if (t.id === parentId) {
                return {
                    ...t,
                    subtasks: [
                        ...t.subtasks, 
                        { id: `s-${Date.now()}`, title: "New subtask", done: false, isEditing: true }
                    ],
                    done: false // Parent cannot be fully done if new subtask is added
                };
            }
            return t;
        }));
    };

    const toggleSubtask = (parentId: string, subId: string) => {
        setTasks(tasks.map(t => {
            if (t.id === parentId) {
                const updatedSubtasks = t.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s);
                const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every(s => s.done);
                return { ...t, subtasks: updatedSubtasks, done: allDone };
            }
            return t;
        }));
    };

    const deleteSubtask = (parentId: string, subId: string) => {
        setTasks(tasks.map(t => {
            if (t.id === parentId) {
                const updatedSubtasks = t.subtasks.filter(s => s.id !== subId);
                const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every(s => s.done);
                return { ...t, subtasks: updatedSubtasks, done: allDone };
            }
            return t;
        }));
    };

    const renameSubtask = (parentId: string, subId: string, newTitle: string) => {
        if (!newTitle.trim()) return;
        setTasks(tasks.map(t => {
            if (t.id === parentId) {
                return {
                    ...t,
                    subtasks: t.subtasks.map(s => s.id === subId ? { ...s, title: newTitle, isEditing: false } : s)
                };
            }
            return t;
        }));
    };

    // AI Actions
    const toggleAI = (taskId: string) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, showAI: !t.showAI } : t));
    };

    const generateSubtasksWithAI = (taskId: string) => {
        const aiSteps = ["Phase 1: Initial Research", "Phase 2: Drafting", "Phase 3: Final Review"];
        setTasks(tasks.map(t => {
            if (t.id === taskId) {
                const newSubtasks = aiSteps.map((step, i) => ({
                    id: `ai-s-${Date.now()}-${i}`,
                    title: step,
                    done: false
                }));
                return { ...t, subtasks: [...t.subtasks, ...newSubtasks], done: false, showAI: false };
            }
            return t;
        }));
        toast.success("AI broke down your task!");
    };

    const completedCount = tasks.filter(t => t.done).length;
    const pendingCount = tasks.length - completedCount;
    const overdueCount = 2; // Hardcoded as per original design

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
                    <p className="text-muted-foreground">Stay organized and productive with your study schedule.</p>
                </div>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Add a new task..." 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        className="w-full sm:w-64"
                    />
                    <Button onClick={addTask} className="gap-2 shrink-0">
                        <Plus className="size-4" />
                        Add Task
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{pendingCount}</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{completedCount}</div>
                    </CardContent>
                </Card>
                <Card className="bg-red-500/5 border-red-500/20 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 text-red-500">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="size-4" />
                            Overdue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-500">{overdueCount}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Today's Schedule</h3>
                {tasks.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl opacity-50">
                        <p>No tasks for today. Add one above!</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="space-y-2 group/task">
                            <div className={`flex items-start gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all ${task.done ? 'bg-muted/30' : ''}`}>
                                <div className="mt-1">
                                    <input 
                                        type="checkbox" 
                                        checked={task.done} 
                                        onChange={() => toggleTask(task.id)}
                                        className="size-4 rounded border-primary cursor-pointer accent-primary" 
                                    />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    {task.isEditing ? (
                                        <div className="flex items-center gap-2">
                                            <Input 
                                                autoFocus
                                                defaultValue={task.title}
                                                onBlur={(e) => renameTask(task.id, e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && renameTask(task.id, e.currentTarget.value)}
                                                className="h-8 text-sm py-0 px-2"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <p className={`font-medium break-words ${task.done ? 'line-through text-muted-foreground' : ''}`}>
                                                {task.title}
                                                {task.subtasks.length > 0 && (
                                                    <span className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-normal">
                                                        {task.subtasks.filter(s => s.done).length}/{task.subtasks.length}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <div className="flex items-center gap-1">
                                            <Clock className="size-3 text-muted-foreground" />
                                            <span className="text-[11px] text-muted-foreground">{task.time}</span>
                                        </div>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-tight ${
                                            task.priority === 'high' ? 'bg-red-500/10 text-red-500' : 
                                            task.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-blue-500/10 text-blue-500'
                                        }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="size-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50" 
                                        onClick={() => toggleAI(task.id)}
                                        title="AI Help"
                                    >
                                        <Sparkles className="size-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="size-8 text-muted-foreground hover:text-foreground" 
                                        onClick={() => addSubtask(task.id)}
                                        title="Add Subtask"
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="size-8 text-muted-foreground hover:text-foreground" 
                                        onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, isEditing: true} : t))}
                                        title="Rename"
                                    >
                                        <Edit2 className="size-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                        onClick={() => deleteTask(task.id)}
                                        title="Delete"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* AI Suggestions Section */}
                            {task.showAI && (
                                <div className="ml-8 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 space-y-3 animate-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <Sparkles className="size-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Smart Assistant</span>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-7 text-[10px] gap-1 px-2 border-blue-200 hover:bg-blue-50 text-blue-700"
                                            onClick={() => generateSubtasksWithAI(task.id)}
                                        >
                                            <Plus className="size-3" />
                                            Break down task
                                        </Button>
                                    </div>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {(task.aiSuggestions || []).map((suggestion, idx) => (
                                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2 bg-white/50 p-2 rounded-lg border border-blue-500/10">
                                                <div className="size-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Subtasks Section */}
                            {task.subtasks.length > 0 && (
                                <div className="ml-8 space-y-2 border-l-2 border-muted pl-4">
                                    {task.subtasks.map((sub) => (
                                        <div key={sub.id} className="flex items-center gap-3 p-2 px-3 rounded-lg border bg-card/40 group/sub hover:bg-card/80 transition-colors">
                                            <input 
                                                type="checkbox" 
                                                checked={sub.done} 
                                                onChange={() => toggleSubtask(task.id, sub.id)}
                                                className="size-3.5 rounded border-primary cursor-pointer accent-primary" 
                                            />
                                            <div className="flex-1 min-w-0">
                                                {sub.isEditing ? (
                                                    <Input 
                                                        autoFocus
                                                        defaultValue={sub.title}
                                                        onBlur={(e) => renameSubtask(task.id, sub.id, e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && renameSubtask(task.id, sub.id, e.currentTarget.value)}
                                                        className="h-7 text-xs py-0 px-2"
                                                    />
                                                ) : (
                                                    <p className={`text-sm ${sub.done ? 'line-through text-muted-foreground' : ''}`}>
                                                        {sub.title}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="size-7 text-muted-foreground hover:text-foreground"
                                                    onClick={() => setTasks(tasks.map(t => t.id === task.id ? {
                                                        ...t, 
                                                        subtasks: t.subtasks.map(s => s.id === sub.id ? {...s, isEditing: true} : s)
                                                    } : t))}
                                                >
                                                    <Edit2 className="size-3" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                                    onClick={() => deleteSubtask(task.id, sub.id)}
                                                >
                                                    <Trash2 className="size-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

