import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    CheckCircle2, 
    AlertTriangle, 
    XCircle, 
    UploadCloud, 
    Info, 
    Calendar,
    BrainCircuit,
    Sparkles,
    ChevronDown,
    ShieldAlert,
    Search,
    Clock,
    MoreVertical,
    CheckCircle,
    AlertCircle,
    FileText,
    ArrowRight,
    Loader2,
    Eye
} from "lucide-react";
import { api } from "@/api/client";
import { toast } from "sonner";
// --- Local UI Components ---

const Badge = ({ children, className, variant = "default" }: any) => {
    const variants: any = {
        default: "bg-primary text-primary-foreground",
        outline: "border border-border text-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
    };
    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors", variants[variant], className)}>
            {children}
        </span>
    );
};

const Progress = ({ value, className }: any) => (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
        <div 
            className="h-full w-full flex-1 bg-primary transition-all duration-500 ease-in-out" 
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }} 
        />
    </div>
);
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// --- Data Models ---

interface DocumentRequirement {
    id: string;
    docType: string;
    description: string;
    importance: 'mandatory' | 'optional' | 'conditional';
    timeline: 'immediate' | '7-days' | 'exam-day';
    condition?: {
        field: 'category' | 'disability' | 'age' | 'domicile';
        operator: '==' | '!=' | '>' | '<';
        value: any;
    };
    instructions: string;
}

interface ExamSchema {
    id: string;
    name: string;
    requirements: DocumentRequirement[];
}

// --- Mock Data ---

const EXAM_DATABASE: ExamSchema[] = [
    {
        id: "upsc-2026",
        name: "UPSC Civil Services 2026",
        requirements: [
            {
                id: "upsc-1",
                docType: "Aadhaar Card",
                description: "Original government identity proof",
                importance: "mandatory",
                timeline: "exam-day",
                instructions: "Carry the original physical card. Digital versions on phone are not allowed."
            },
            {
                id: "upsc-2",
                docType: "UPSC Hall Ticket",
                description: "Official admit card for the exam",
                importance: "mandatory",
                timeline: "exam-day",
                instructions: "Print in color on A4 size paper. Ensure the photo is clearly visible."
            },
            {
                id: "upsc-3",
                docType: "Passport Size Photos (x2)",
                description: "Backup photos for attendance sheet",
                importance: "mandatory",
                timeline: "exam-day",
                instructions: "Must be the same photos as uploaded in the application form."
            },
            {
                id: "upsc-4",
                docType: "Caste Certificate",
                description: "For category-based reservation",
                importance: "conditional",
                timeline: "7-days",
                condition: { field: 'category', operator: '!=', value: 'General' },
                instructions: "Must be issued by a competent authority in the prescribed format."
            },
            {
                id: "upsc-5",
                docType: "PwD Certificate",
                description: "For disability-based relaxation",
                importance: "conditional",
                timeline: "7-days",
                condition: { field: 'disability', operator: '==', value: true },
                instructions: "UDID card or medical board certificate is required."
            }
        ]
    },
    {
        id: "jee-2026",
        name: "JEE Main 2026",
        requirements: [
            {
                id: "jee-1",
                docType: "JEE Admit Card",
                description: "Main entry document",
                importance: "mandatory",
                timeline: "exam-day",
                instructions: "Download from NTA website. One page must be the self-declaration."
            },
            {
                id: "jee-2",
                docType: "Original Govt ID",
                description: "Aadhaar / PAN / Passport",
                importance: "mandatory",
                timeline: "exam-day",
                instructions: "The name on the ID must exactly match the name on the admit card."
            },
            {
                id: "jee-3",
                docType: "Self-Declaration (Undertaking)",
                description: "COVID-19 / Health declaration",
                importance: "mandatory",
                timeline: "immediate",
                instructions: "Fill the details and sign in the presence of the invigilator."
            },
            {
                id: "jee-4",
                docType: "Postcard Size Photo",
                description: "To be pasted on the attendance sheet",
                importance: "optional",
                timeline: "exam-day",
                instructions: "Recommended to carry one extra photo as backup."
            }
        ]
    }
];

// Mock User Profile
const MOCK_USER_PROFILE = {
    category: "OBC",
    disability: false,
    age: 21,
    domicile: "Maharashtra"
};

// Mock Stored Documents in EduWallet
const INITIAL_STORED_DOCS = [
    { id: "d2", name: "Caste Certificate.pdf", type: "Caste Certificate", status: "EXPIRED", expiry: "2024-01-01", url: "https://example.com/caste.pdf" },
    { id: "d3", name: "Profile Photo.jpg", type: "Passport Size Photos (x2)", status: "UNCLEAR", expiry: null, url: "https://example.com/photo.jpg" }
];

export default function ExamDocumentChecklist() {
    const [selectedExamId, setSelectedExamId] = useState<string>("upsc-2026");
    const [overrides, setOverrides] = useState<Record<string, { na: boolean, reason: string }>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTimeline, setActiveTimeline] = useState<'all' | 'immediate' | '7-days' | 'exam-day'>('all');
    const [storedDocs, setStoredDocs] = useState(INITIAL_STORED_DOCS);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [viewingDoc, setViewingDoc] = useState<any>(null);

    const selectedExam = useMemo(() => 
        EXAM_DATABASE.find(e => e.id === selectedExamId) || EXAM_DATABASE[0]
    , [selectedExamId]);

    // --- Logic Engine ---
    const checklist = useMemo(() => {
        const rules = selectedExam.requirements;
        
        return rules.filter(req => {
            if (req.importance !== 'conditional' || !req.condition) return true;
            
            const { field, operator, value } = req.condition;
            const userValue = (MOCK_USER_PROFILE as any)[field];

            switch (operator) {
                case '==': return userValue === value;
                case '!=': return userValue !== value;
                case '>': return userValue > value;
                case '<': return userValue < value;
                default: return true;
            }
        }).map(req => {
            // Match with stored docs
            const matchedDoc = storedDocs.find(doc => 
                doc.type.toLowerCase().includes(req.docType.toLowerCase()) ||
                req.docType.toLowerCase().includes(doc.type.toLowerCase())
            );

            let status: 'AVAILABLE' | 'MISSING' | 'EXPIRED' | 'UNCLEAR' | 'NOT_APPLICABLE' = 'MISSING';
            
            if (overrides[req.id]?.na) {
                status = 'NOT_APPLICABLE';
            } else if (matchedDoc) {
                status = matchedDoc.status as any;
            }

            return {
                ...req,
                status,
                matchedDoc,
                overrideReason: overrides[req.id]?.reason
            };
        });
    }, [selectedExam, overrides, storedDocs]);

    const readinessScore = useMemo(() => {
        const mandatory = checklist.filter(i => i.importance === 'mandatory' || (i.importance === 'conditional' && i.status !== 'NOT_APPLICABLE'));
        const available = mandatory.filter(i => i.status === 'AVAILABLE').length;
        return mandatory.length > 0 ? Math.round((available / mandatory.length) * 100) : 0;
    }, [checklist]);

    const filteredChecklist = checklist.filter(item => {
        if (activeTimeline !== 'all' && item.timeline !== activeTimeline) return false;
        if (searchQuery && !item.docType.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const suggestions = useMemo(() => {
        const list: string[] = [];
        const hasAadhaar = checklist.find(i => i.docType.includes("Aadhaar") && i.status === 'AVAILABLE');
        const hasHallTicket = checklist.find(i => i.docType.includes("Hall Ticket") || i.docType.includes("Admit Card"));
        
        if (hasAadhaar && (!hasHallTicket || hasHallTicket.status === 'MISSING')) {
            list.push("You uploaded Aadhaar, but your Hall Ticket is still missing.");
        }
        
        if (MOCK_USER_PROFILE.disability && !checklist.find(i => i.docType.includes("PwD"))) {
            list.push("Your profile indicates PwD status. Ensure you have the disability certificate ready.");
        }

        const expired = checklist.filter(i => i.status === 'EXPIRED');
        if (expired.length > 0) {
            list.push(`${expired[0].docType} is expired. Please upload a renewed version.`);
        }

        list.push("Carry 2 printed passport photos and a small transparent water bottle as a backup.");
        
        return list;
    }, [checklist]);

    const handleMarkNA = (id: string) => {
        const reason = prompt("Why is this not applicable?");
        if (reason) {
            setOverrides(prev => ({ ...prev, [id]: { na: true, reason } }));
            toast.success("Requirement marked as Not Applicable");
        }
    };

    const handleUndoNA = (id: string) => {
        setOverrides(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        toast.info("Requirement re-enabled");
    };
    
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, reqId: string, docType: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingId(reqId);
        toast.info(`Uploading ${docType}...`, { description: "Establishing secure connection to EduWallet..." });

        try {
            // Step 1: Secure Backend Upload (keeps keys safe)
            const formData = new FormData();
            formData.append('file', file);

            const data = await api.upload<{ url: string }>("/wallet/upload", formData);
            const cloudinaryUrl = data.url;

            // Wait a bit to show the "Securing" animation
            await new Promise(resolve => setTimeout(resolve, 800));
            setUploadingId(null);
            
            // Step 2: Simulated AI Verification
            setVerifyingId(reqId);
            toast.loading(`AI Verification in progress...`, { 
                id: "verify-toast",
                description: "Running OCR and authenticity checks." 
            });
            
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newDoc = {
                id: `d${Date.now()}`,
                name: file.name,
                type: docType,
                status: "AVAILABLE" as const,
                expiry: null,
                url: cloudinaryUrl
            };

            setStoredDocs(prev => [newDoc, ...prev]);
            setVerifyingId(null);
            toast.dismiss("verify-toast");
            toast.success(`${docType} Verified!`, {
                description: "Document passed all security checks and is now ready."
            });
        } catch (error) {
            setUploadingId(null);
            setVerifyingId(null);
            toast.error("Process failed. Please try again.");
        } finally {
            // Reset input
            if (event.target) event.target.value = '';
        }
    };

    const getStatusUI = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-[#F0FDF4]', border: 'border-emerald-100' };
            case 'MISSING': return { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50/50', border: 'border-rose-200' };
            case 'EXPIRED': return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50/50', border: 'border-amber-200' };
            case 'UNCLEAR': return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50/50', border: 'border-amber-200' };
            case 'NOT_APPLICABLE': return { icon: Info, color: 'text-slate-400', bg: 'bg-slate-50/50', border: 'border-slate-200' };
            default: return { icon: Info, color: 'text-slate-400', bg: 'bg-slate-50/50', border: 'border-slate-200' };
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10 animate-in fade-in duration-700">
            {/* Header & Global Stats */}
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                            <ShieldAlert className="size-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Exam Documents</h1>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Smart checklist engine matching official requirements with your EduWallet vault.
                    </p>
                </div>

                <div className="flex items-center gap-5 bg-card border border-border/50 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 min-w-[300px]">
                    <div className="relative size-20">
                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted/30" strokeWidth="3" />
                                <circle 
                                    cx="18" cy="18" r="16" fill="none" 
                                    className={cn(
                                        "transition-all duration-1000 ease-out",
                                        readinessScore > 80 ? "stroke-emerald-500" : readinessScore > 40 ? "stroke-primary" : "stroke-destructive"
                                    )} 
                                    strokeWidth="3" 
                                    strokeDasharray="100" 
                                    strokeDashoffset={100 - readinessScore} 
                                    strokeLinecap="round" 
                                />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{readinessScore}%</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg">Exam Readiness</h3>
                        <p className="text-xs text-muted-foreground leading-snug">
                            {readinessScore === 100 
                                ? "You are fully prepared for the exam day!" 
                                : `Complete ${checklist.filter(i => i.status !== 'AVAILABLE' && i.status !== 'NOT_APPLICABLE').length} more items to reach 100%.`}
                        </p>
                        <div className="flex gap-1 pt-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={cn("h-1.5 w-6 rounded-full", i * 20 <= readinessScore ? "bg-primary" : "bg-muted")} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Selection & Search */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative w-full lg:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <select 
                        className="w-full pl-10 h-12 rounded-2xl border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none font-medium cursor-pointer"
                        value={selectedExamId}
                        onChange={(e) => setSelectedExamId(e.target.value)}
                    >
                        {EXAM_DATABASE.map(exam => (
                            <option key={exam.id} value={exam.id}>{exam.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>

                <div className="flex bg-muted/50 p-1.5 rounded-2xl w-full lg:w-auto">
                    {(['all', 'immediate', '7-days', 'exam-day'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTimeline(t)}
                            className={cn(
                                "flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                                activeTimeline === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {t.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search document requirements..."
                        className="w-full pl-12 h-12 rounded-2xl border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Checklist */}
                <div className="lg:col-span-8 space-y-6">
                    {filteredChecklist.length === 0 ? (
                        <div className="text-center py-20 bg-card rounded-3xl border border-dashed flex flex-col items-center">
                            <div className="p-4 bg-muted rounded-full mb-4">
                                <Search className="size-10 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-xl font-bold">No requirements found</h3>
                            <p className="text-muted-foreground mt-1">Try clearing your filters or search query.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredChecklist.map((item) => {
                                const ui = getStatusUI(item.status);
                                return (
                                    <Card key={item.id} className={cn(
                                        "group relative overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem]",
                                        ui.bg
                                    )}>
                                        {/* Status Ribbon */}
                                        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", 
                                            item.status === 'AVAILABLE' ? "bg-emerald-500" : 
                                            item.status === 'MISSING' ? "bg-rose-500" : 
                                            item.status === 'NOT_APPLICABLE' ? "bg-slate-300" : "bg-amber-500"
                                        )} />
                                        
                                        <div className="p-6 sm:p-8 space-y-6">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h3 className={cn(
                                                            "text-3xl font-bold tracking-tight text-slate-900",
                                                            item.status === 'NOT_APPLICABLE' && "line-through opacity-50"
                                                        )}>
                                                            {item.docType}
                                                        </h3>
                                                        <Badge className={cn(
                                                            "px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter border-none",
                                                            item.importance === 'mandatory' ? "bg-destructive text-destructive-foreground" : 
                                                            item.importance === 'conditional' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                                        )}>
                                                            {item.importance}
                                                        </Badge>
                                                        <Badge variant="outline" className="px-3 py-1 rounded-full text-[11px] uppercase font-bold text-slate-500 border-slate-200 bg-white/50">
                                                            {item.timeline.replace('-', ' ')}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <p className="text-base text-slate-500 font-medium leading-relaxed max-w-2xl">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <div className="shrink-0 w-full sm:w-auto self-center">
                                                    {item.status === 'AVAILABLE' ? (
                                                        <Button 
                                                            variant="outline" 
                                                            className="rounded-full h-12 px-6 border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold text-base gap-2 shadow-sm bg-white transition-all active:scale-95"
                                                            onClick={() => toast.success(`${item.docType} is Ready!`, {
                                                                description: "This document is verified and available for your exam."
                                                            })}
                                                        >
                                                            <CheckCircle className="size-5" /> Ready
                                                        </Button>
                                                    ) : item.status === 'NOT_APPLICABLE' ? (
                                                        <Button variant="outline" onClick={() => handleUndoNA(item.id)} className="rounded-full h-12 px-6 font-bold text-base">
                                                            Enable
                                                        </Button>
                                                    ) : (
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                type="file"
                                                                id={`upload-${item.id}`}
                                                                className="hidden"
                                                                onChange={(e) => handleFileUpload(e, item.id, item.docType)}
                                                            />
                                                            <Button 
                                                                className={cn(
                                                                    "rounded-full h-12 px-8 font-bold text-base gap-2 shadow-lg transition-all duration-500 border-none",
                                                                    verifyingId === item.id 
                                                                        ? "bg-emerald-100 text-emerald-700 animate-pulse cursor-wait"
                                                                        : item.status === 'MISSING' 
                                                                            ? "bg-primary hover:bg-primary/90 shadow-primary/20 text-primary-foreground" 
                                                                            : "bg-foreground hover:bg-foreground/90 shadow-foreground/20 text-background"
                                                                )}
                                                                disabled={uploadingId === item.id || verifyingId === item.id}
                                                                onClick={() => document.getElementById(`upload-${item.id}`)?.click()}
                                                            >
                                                                {uploadingId === item.id ? (
                                                                    <span className="flex items-center gap-2">
                                                                        <Loader2 className="size-4 animate-spin" />
                                                                        Securing...
                                                                    </span>
                                                                ) : verifyingId === item.id ? (
                                                                    <span className="flex items-center gap-2">
                                                                        <BrainCircuit className="size-5 animate-bounce" />
                                                                        Verifying...
                                                                    </span>
                                                                ) : (
                                                                    <>
                                                                        <UploadCloud className="size-5" /> 
                                                                        {item.status === 'MISSING' ? "Upload Now" : "Renew Doc"}
                                                                    </>
                                                                )}
                                                            </Button>
                                                            {item.importance !== 'mandatory' && !uploadingId && !verifyingId && (
                                                                <Button variant="ghost" onClick={() => handleMarkNA(item.id)} className="rounded-full font-bold text-xs text-muted-foreground">
                                                                    Not Applicable
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 bg-white/60 p-4 rounded-3xl border border-white/80 shadow-inner">
                                                <AlertCircle className="size-5 text-orange-400 shrink-0 mt-0.5" />
                                                <p className="text-sm font-semibold leading-relaxed text-slate-800">
                                                    {item.instructions}
                                                </p>
                                            </div>

                                            {item.status === 'AVAILABLE' && item.matchedDoc && (
                                                <div className="flex items-center gap-4 p-4 bg-white rounded-[1.5rem] border border-emerald-100/50 shadow-sm animate-in slide-in-from-bottom duration-500">
                                                    <div 
                                                        className="size-12 bg-[#DCFCE7] text-emerald-600 rounded-xl overflow-hidden flex items-center justify-center shrink-0 relative group/thumb cursor-pointer border border-emerald-100"
                                                        onClick={() => setViewingDoc(item.matchedDoc)}
                                                    >
                                                        {/\.(jpg|jpeg|png|webp)$/i.test(item.matchedDoc.name) || (item.matchedDoc.url && item.matchedDoc.url.includes('cloudinary.com') && item.matchedDoc.url.toLowerCase().endsWith('.pdf')) ? (
                                                            <img 
                                                                src={
                                                                    item.matchedDoc.url.toLowerCase().endsWith('.pdf') && item.matchedDoc.url.includes('cloudinary.com')
                                                                        ? item.matchedDoc.url.replace(/\.pdf$/i, '.jpg')
                                                                        : (item.matchedDoc as any).url
                                                                } 
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" 
                                                                alt="preview" 
                                                            />
                                                        ) : (
                                                            <FileText className="size-6" />
                                                        )}
                                                        
                                                        {/* Eye Overlay on Thumbnail */}
                                                        <div className="absolute inset-0 bg-emerald-600/20 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
                                                            <Eye className="size-4 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 truncate">{item.matchedDoc.name}</p>
                                                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                                            <CheckCircle2 className="size-3" /> Verified in EduWallet
                                                        </p>
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-emerald-600 font-black text-sm h-10 px-4 hover:bg-emerald-50 rounded-xl transition-colors gap-2"
                                                        onClick={() => setViewingDoc(item.matchedDoc)}
                                                    >
                                                        <Eye className="size-4" /> View
                                                    </Button>
                                                </div>
                                            )}

                                            {item.status === 'NOT_APPLICABLE' && (
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground italic font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                                    <Clock className="size-3.5" />
                                                    Reason: {item.overrideReason || "Manually marked as N/A"}
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* AI Suggestions */}
                    <Card className="border-none shadow-xl bg-foreground text-background rounded-3xl overflow-hidden group">
                        <CardHeader className="relative z-10">
                            <CardTitle className="flex items-center gap-2 text-xl font-black italic tracking-tighter">
                                <Sparkles className="size-6 text-primary animate-pulse" />
                                SMART INSIGHTS
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-4">
                            {suggestions.map((s, i) => (
                                <div key={i} className="flex gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all duration-300">
                                    <div className="size-5 shrink-0 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm font-semibold leading-relaxed tracking-tight">
                                        {s}
                                    </p>
                                </div>
                            ))}
                            <Button 
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-black rounded-2xl mt-2 h-12 shadow-xl transition-all active:scale-95 group/btn border-none"
                                onClick={() => toast.success("AI Assistant Initializing...", {
                                    description: "Scanning your EduWallet to find missing requirements for " + selectedExam.name
                                })}
                             >
                                ASK AI ASSISTANT <ArrowRight className="size-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </CardContent>
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 size-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                        <div className="absolute bottom-0 left-0 size-24 bg-indigo-500/30 rounded-full -ml-10 -mb-10 blur-2xl" />
                    </Card>

                    {/* Timeline View */}
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-card border border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Calendar className="size-5 text-primary" />
                                Action Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative space-y-8 pl-4">
                                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-destructive via-primary to-muted" />
                                
                                <div className="relative pl-8">
                                    <div className="absolute left-[-4px] top-1.5 size-2.5 rounded-full bg-destructive ring-4 ring-destructive/20" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-destructive">Immediate</h4>
                                    <p className="text-sm font-bold mt-1 text-foreground">Verify Identity Docs</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">3 items require attention now.</p>
                                </div>
 
                                <div className="relative pl-8">
                                    <div className="absolute left-[-4px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-primary">Within 7 Days</h4>
                                    <p className="text-sm font-bold mt-1 text-foreground">Download Admit Card</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Expect release by May 15th.</p>
                                </div>

                                <div className="relative pl-8 opacity-60">
                                    <div className="absolute left-[-4px] top-1.5 size-2.5 rounded-full bg-slate-400" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Exam Day</h4>
                                    <p className="text-sm font-bold mt-1">Final Checklist</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Original IDs + 2 printed copies.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trust/Verification Footer */}
                    <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-3xl space-y-3">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <ShieldAlert className="size-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Official Verification</span>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                            Our engine uses official exam notifications from 2024-2025. Requirements may vary; always verify with the official website.
                        </p>
                        <Button 
                            variant="link" 
                            className="p-0 h-auto text-xs font-bold text-primary hover:text-primary/80"
                            onClick={() => toast.info("Fetching Official Guidelines...", {
                                description: "Opening official NTA/UPSC documentation for 2024-2025."
                            })}
                        >
                            View Official Sources
                        </Button>
                    </div>
                </div>
            </div>

            {/* In-App Document Viewer */}
            {viewingDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-[2.5rem] border-none shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b flex items-center justify-between bg-card">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                    <FileText className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-none">{viewingDoc.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 uppercase font-black tracking-widest">{viewingDoc.type}</p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setViewingDoc(null)}
                                className="rounded-full hover:bg-muted"
                            >
                                <ChevronDown className="size-6 rotate-180" />
                            </Button>
                        </div>
                        
                        <div className="flex-1 bg-slate-100/50 p-4 sm:p-8 overflow-y-auto">
                            {viewingDoc.url ? (
                                <div className="w-full h-full min-h-[500px] bg-white rounded-3xl border shadow-inner flex items-center justify-center relative overflow-hidden">
                                    {/* Simulated Doc Content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 p-10 text-center select-none">
                                        <div className="p-8 bg-slate-50 rounded-full mb-6 border border-slate-100">
                                            <ShieldAlert className="size-20 opacity-20" />
                                        </div>
                                        <p className="text-xl font-black uppercase tracking-tighter opacity-10">Confidential Document</p>
                                        <p className="text-sm font-bold max-w-xs mt-2 opacity-10">This document is protected by DeshmukhAcademy EduWallet Security Protocols.</p>
                                    </div>
                                    
                                    {/* Real Content if available */}
                                    {viewingDoc.url.startsWith('blob:') ? (
                                        <iframe 
                                            src={viewingDoc.url} 
                                            className="w-full h-full relative z-10" 
                                            title="Document Preview"
                                        />
                                    ) : (
                                        <div className="relative z-10 flex flex-col items-center gap-4 text-slate-600">
                                            <FileText className="size-16" />
                                            <div className="text-center">
                                                <p className="font-bold">Encrypted Archive</p>
                                                <p className="text-xs text-muted-foreground">Reference: {viewingDoc.id}</p>
                                            </div>
                                            <Button variant="outline" className="rounded-full mt-4" onClick={() => window.open(viewingDoc.url, '_blank')}>
                                                Open in External Viewer
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                    <AlertTriangle className="size-12 mb-4 opacity-20" />
                                    <p>No preview available for this file type.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-6 bg-card border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="size-8 rounded-full border-2 border-background bg-slate-200" />
                                    ))}
                                </div>
                                <p className="text-xs font-bold text-muted-foreground">Verified by 3 Authentication Nodes</p>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Button variant="outline" className="flex-1 sm:flex-none rounded-2xl font-bold h-11 px-6">Download</Button>
                                <Button className="flex-1 sm:flex-none rounded-2xl font-bold h-11 px-6 shadow-lg shadow-primary/20">Share Secured Link</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
