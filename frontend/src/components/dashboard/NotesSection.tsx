import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Search, Clock, Video, Sparkles, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNotesQuery, useGenerateNoteMutation, useDeleteNoteMutation } from "@/api/notesHooks";

export default function NotesSection() {
    const [ytUrl, setYtUrl] = useState("");
    
    const { data: notes, isLoading: isNotesLoading } = useNotesQuery();
    const generateNoteMutation = useGenerateNoteMutation();
    const deleteNoteMutation = useDeleteNoteMutation();
    const navigate = useNavigate();

    const getYouTubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeVideoId(ytUrl);
    const isGenerating = generateNoteMutation.isPending;

    const handleGenerateSummary = async () => {
        if (!ytUrl || !videoId) {
            toast.error("Please enter a valid YouTube URL");
            return;
        }

        try {
            await generateNoteMutation.mutateAsync(ytUrl);
            setYtUrl("");
            toast.success("AI Summary generated and saved successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to generate AI summary");
        }
    };

    const handleDeleteNote = async (e: React.MouseEvent, noteId: string) => {
        e.stopPropagation();

        try {
            await deleteNoteMutation.mutateAsync(noteId);
            toast.success("Note deleted successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete note");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
                    <p className="text-muted-foreground">Manage your study materials and Notion-like notes.</p>
                </div>
                <Button 
                    className="gap-2 shadow-lg shadow-primary/20"
                    onClick={() => navigate("/dashboard/notes/new")}
                >
                    <Plus className="size-4" />
                    New Note
                </Button>
            </div>

            <Card className="border-0 bg-linear-to-br from-primary/10 via-primary/5 to-background overflow-hidden relative shadow-2xl shadow-primary/5 group">
                <div className="absolute -right-12 -top-12 size-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
                <div className="absolute -left-12 -bottom-12 size-48 bg-primary/5 rounded-full blur-3xl" />
                
                <CardHeader className="relative">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-red-500/10 rounded-xl">
                            <Video className="size-6 text-red-500" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">AI Video Summary</CardTitle>
                            <CardDescription className="text-base">
                                Convert YouTube lectures into structured study notes with Gemini AI.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-6 relative">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group/input">
                            <Video className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                            <Input 
                                placeholder="https://www.youtube.com/watch?v=..." 
                                className="pl-12 h-14 bg-background/50 border-primary/10 focus-visible:ring-primary/30 text-base rounded-2xl transition-all shadow-inner" 
                                value={ytUrl}
                                onChange={(e) => setYtUrl(e.target.value)}
                                disabled={isGenerating}
                            />
                        </div>

                        <Button 
                            className="h-14 px-10 gap-3 shadow-xl shadow-primary/25 font-bold rounded-2xl bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95"
                            onClick={handleGenerateSummary}
                            disabled={isGenerating || !videoId}
                        >
                            {isGenerating ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <Sparkles className="size-5" />
                            )}
                            {isGenerating ? "Processing..." : "Generate Notes"}
                        </Button>
                    </div>

                    {videoId && (
                        <div className="flex flex-col md:flex-row gap-6 p-5 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 animate-in fade-in zoom-in-95 duration-500 shadow-xl">
                            <div className="relative aspect-video w-full md:w-64 rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg shrink-0 group/thumb">
                                <img 
                                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                                    }}
                                    alt="Thumbnail"
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover/thumb:scale-110"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/thumb:bg-black/10 transition-colors">
                                    <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30 transform group-hover/thumb:scale-110 transition-transform">
                                        <Video className="size-6 text-white fill-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-full uppercase tracking-widest border border-red-500/20">
                                        Youtube Detected
                                    </span>
                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-500/20">
                                        Ready
                                    </span>
                                </div>
                                <h4 className="font-bold text-xl line-clamp-1">
                                    {ytUrl.includes("Deep Learning") ? "Deep Learning Basics: Neural Networks Explained" : 
                                     ytUrl.includes("Physics") ? "Quantum Mechanics for Beginners" :
                                     "Educational Video Content Detected"}
                                </h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Clock className="size-3" />
                                    Automated summary will be saved to your vault.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>


            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Search your notes..." className="pl-10" />
                </div>
            </div>

            {isNotesLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="size-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes?.map((note) => {
                        const tagsList = note.tags ? note.tags.split(",") : [];
                        const ytIdTag = tagsList.find(tag => tag.trim().startsWith("yt_id:"));
                        const ytId = ytIdTag ? ytIdTag.split("yt_id:")[1].trim() : null;
                        const displayTags = tagsList.filter(tag => !tag.trim().startsWith("yt_id:"));

                        return (
                            <Card 
                                key={note.id} 
                                className="group flex flex-col overflow-hidden hover:border-primary/50 transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-primary/10"
                                onClick={() => navigate(`/dashboard/notes/${note.id}`)}
                            >
                                {ytId ? (
                                    <div className="relative aspect-video w-full overflow-hidden">
                                        <img 
                                            src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`} 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                            alt="Video thumbnail" 
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <div className="flex items-center gap-2 text-white text-xs font-medium">
                                                <Video className="size-3 text-red-500 fill-red-500" />
                                                Video Note
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-white font-bold flex items-center gap-1">
                                            <Video className="size-2.5" />
                                            AI SUMMARY
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-2 w-full bg-linear-to-r from-primary/40 to-primary/10" />
                                )}

                                <CardHeader className="space-y-1 flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        {!ytId && (
                                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                <FileText className="size-5 text-primary" />
                                            </div>
                                        )}
                                        <div className="flex items-center text-[10px] text-muted-foreground font-medium uppercase tracking-wider ml-auto gap-3">
                                            <div className="flex items-center">
                                                <Clock className="size-3 mr-1" />
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                                onClick={(e) => handleDeleteNote(e, note.id)}
                                                disabled={deleteNoteMutation.isPending}
                                            >
                                                {deleteNoteMutation.isPending ? (
                                                    <Loader2 className="size-3 animate-spin" />
                                                ) : (
                                                    <Trash2 className="size-3" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                        {note.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-3 text-sm mt-2 leading-relaxed">
                                        {note.content}
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent className="pt-0">
                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {displayTags.map((tag, j) => (
                                            tag.trim() ? (
                                                <span 
                                                    key={j} 
                                                    className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded-full text-[10px] font-semibold uppercase tracking-tight"
                                                >
                                                    {tag.trim()}
                                                </span>
                                            ) : null
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}


