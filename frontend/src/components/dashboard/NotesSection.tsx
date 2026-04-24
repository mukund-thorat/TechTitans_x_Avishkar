import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Search, Clock, Video, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function NotesSection() {
    const [ytUrl, setYtUrl] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [notes, setNotes] = useState([
        { id: 1, title: "Quantum Physics Chapter 1", description: "Advanced concepts of wave-particle duality and uncertainty principle...", date: "2 days ago", tags: ["Physics", "Study"] },
        { id: 2, title: "Quantum Physics Chapter 2", description: "Schrödinger's cat and the Copenhagen interpretation explained...", date: "2 days ago", tags: ["Physics", "Theory"] },
        { id: 3, title: "Quantum Physics Chapter 3", description: "Quantum entanglement and Bell's inequality experiments...", date: "2 days ago", tags: ["Physics", "Advanced"] },
    ]);

    const handleGenerateSummary = async () => {
        if (!ytUrl) {
            toast.error("Please enter a YouTube URL");
            return;
        }

        setIsGenerating(true);
        
        // Simulating AI generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newNote = {
            id: Date.now(),
            title: "AI Summary: Deep Learning Basics",
            description: "In this video, we explore the fundamental concepts of neural networks, backpropagation, and gradient descent. We also discuss the importance of activation functions like ReLU and Sigmoid in modern architectures.",
            date: "Just now",
            tags: ["AI", "Video Summary"]
        };

        setNotes([newNote, ...notes]);
        setYtUrl("");
        setIsGenerating(false);
        toast.success("Summary generated and added to your notes!");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
                    <p className="text-muted-foreground">Manage your study materials and Notion-like notes.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="size-4" />
                    New Note
                </Button>
            </div>

            <Card className="border-2 border-primary/20 bg-linear-to-r from-primary/5 via-transparent to-primary/5 overflow-hidden relative">
                <div className="absolute -right-8 -top-8 size-32 bg-primary/5 rounded-full blur-3xl" />
                <CardHeader>
                    <div className="flex items-center gap-2 text-red-500">
                        <Video className="size-6" />
                        <CardTitle className="text-xl text-foreground">AI Video Summary</CardTitle>
                    </div>
                    <CardDescription>
                        Transform any educational YouTube video into structured study notes instantly.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Video className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input 
                                placeholder="Paste YouTube video URL here..." 
                                className="pl-10 h-12 border-primary/20 focus-visible:ring-primary/30" 
                                value={ytUrl}
                                onChange={(e) => setYtUrl(e.target.value)}
                                disabled={isGenerating}
                            />
                        </div>

                        <Button 
                            className="h-12 px-8 gap-2 shadow-lg shadow-primary/20 font-bold"
                            onClick={handleGenerateSummary}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Sparkles className="size-4" />
                            )}
                            {isGenerating ? "Generating..." : "Generate Summary"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Search your notes..." className="pl-10" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                    <Card key={note.id} className="group hover:border-primary/50 transition-all cursor-pointer hover:shadow-xl">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <FileText className="size-5 text-primary" />
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="size-3 mr-1" />
                                    {note.date}
                                </div>
                            </div>
                            <CardTitle className="mt-4">{note.title}</CardTitle>
                            <CardDescription>{note.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                {note.tags.map((tag, j) => (
                                    <span key={j} className="px-2 py-1 bg-muted rounded text-[10px] font-medium uppercase tracking-wider">{tag}</span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

