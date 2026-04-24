import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNoteQuery, useUpdateNoteMutation, useCreateNoteMutation } from "@/api/notesHooks";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NoteEditor() {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const isNew = noteId === "new";

    const { data: noteResponse, isLoading: isNoteLoading } = useNoteQuery(isNew ? "" : (noteId || ""));
    const updateMutation = useUpdateNoteMutation();
    const createMutation = useCreateNoteMutation();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (noteResponse) {
            setTitle(noteResponse.title);
            setContent(noteResponse.content);
            setTags(noteResponse.tags || "");
        }
    }, [noteResponse]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [content]);

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error("Title cannot be empty");
            return;
        }

        try {
            if (isNew) {
                const newNote = await createMutation.mutateAsync({ title, content, tags });
                toast.success("Note created successfully");
                navigate(`/dashboard/notes/${newNote.id}`, { replace: true });
            } else {
                await updateMutation.mutateAsync({ id: noteId!, data: { title, content, tags } });
                toast.success("Note saved successfully");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to save note");
        }
    };

    const isSaving = updateMutation.isPending || createMutation.isPending;
    const isLoading = !isNew && isNoteLoading;

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                    <ArrowLeft className="size-4" />
                    Back
                </Button>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleSave} disabled={isSaving || isLoading}>
                        {isSaving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-8 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="size-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Untitled Note"
                            className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/30 focus:ring-0 p-0"
                        />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground border-b border-transparent hover:border-border transition-colors pb-2">
                            <span className="font-medium">Tags:</span>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Add tags (comma separated)..."
                                className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0"
                            />
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Start writing..."
                            className="w-full min-h-[500px] text-lg leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40 focus:ring-0 p-0"
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
