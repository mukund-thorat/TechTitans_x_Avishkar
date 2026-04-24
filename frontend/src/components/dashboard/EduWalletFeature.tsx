import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
    UploadCloud, 
    FileText, 
    Loader2, 
    Search, 
    MoreVertical, 
    Trash2, 
    Download, 
    Eye,
    File as FileIcon,
    Shield,
    HardDrive,
    Folder as FolderIcon,
    Plus,
    ChevronLeft,
    CheckCircle2,
    AlertCircle,
    Clock,
    Info,
    Calendar,
    ChevronRight,
    SearchCheck,
    GraduationCap
} from "lucide-react";
import { api } from "@/api/client";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { InteractiveFolder } from "@/components/ui/interactive-folder";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// --- Data Models & Mock Data ---

interface ExamRequirement {
    id: string;
    name: string;
    description: string;
    type: 'mandatory' | 'optional' | 'conditional';
    condition?: string; // Logic for visibility
    deadline?: string; // ISO date or relative
}

interface ExamSchema {
    id: string;
    name: string;
    requirements: ExamRequirement[];
}

const EXAM_DATABASE: ExamSchema[] = [
    {
        id: "upsc-2024",
        name: "UPSC Civil Services 2024",
        requirements: [
            { id: "1", name: "Aadhaar Card", description: "Original ID proof for verification", type: 'mandatory' },
            { id: "2", name: "UPSC Hall Ticket", description: "Printed copy of the admit card", type: 'mandatory', deadline: "2024-06-15" },
            { id: "3", name: "Passport Photos (2)", description: "Recent identical photos as backup", type: 'mandatory' },
            { id: "4", name: "Caste Certificate", description: "For SC/ST/OBC category students", type: 'conditional', condition: "category != 'General'" },
            { id: "5", name: "Income Certificate", description: "For EWS category verification", type: 'conditional', condition: "category == 'EWS'" },
            { id: "6", name: "Graduation Marksheet", description: "Proof of eligibility", type: 'optional' },
        ]
    },
    {
        id: "jee-2024",
        name: "JEE Main 2024",
        requirements: [
            { id: "j1", name: "JEE Admit Card", description: "Color printout preferred", type: 'mandatory', deadline: "2024-05-20" },
            { id: "j2", name: "Aadhaar Card", description: "Must match registration details", type: 'mandatory' },
            { id: "j3", name: "PwD Certificate", description: "For candidates claiming reservation", type: 'conditional', condition: "disability == true" },
            { id: "j4", name: "Self Declaration (Undertaking)", description: "Duly filled and signed", type: 'mandatory' },
        ]
    }
];

// Mock User Profile for conditional logic
const USER_PROFILE = {
    category: "OBC",
    disability: false,
    state: "Maharashtra"
};

export default function EduWalletFeature() {
    const [activeTab, setActiveTab] = useState<'vault' | 'checklist'>('checklist');
    const [selectedExamId, setSelectedExamId] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Folder state
    const [folders, setFolders] = useState<{ id: string, name: string }[]>([
        { id: "f1", name: "Certificates" },
        { id: "f2", name: "Exam Admit Cards" }
    ]);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    // Documents state
    const [documents, setDocuments] = useState<{ id: string, name: string, url: string, size?: string, type?: string, date: string, folderId: string | null, status?: 'valid' | 'expired' | 'unclear' }[]>([
        { id: "1", name: "Aadhaar Card.pdf", url: "#", size: "2.4 MB", type: "PDF", date: "2024-01-20", folderId: "f1", status: 'valid' },
        { id: "2", name: "12th Marksheet.pdf", url: "#", size: "1.1 MB", type: "PDF", date: "2024-02-22", folderId: "f1", status: 'valid' },
        { id: "3", name: "Passport Photo.jpg", url: "#", size: "850 KB", type: "JPG", date: "2024-03-23", folderId: null, status: 'unclear' },
    ]);

    // Manual overrides for checklist
    const [overrides, setOverrides] = useState<Record<string, { n_a: boolean, reason: string }>>({});
    const [viewingDoc, setViewingDoc] = useState<any>(null);

    // Logic for checklist generation
    const checklistData = useMemo(() => {
        if (!selectedExamId) return null;
        const exam = EXAM_DATABASE.find(e => e.id === selectedExamId);
        if (!exam) return null;

        const items = exam.requirements.filter(req => {
            if (req.type !== 'conditional') return true;
            if (!req.condition) return true;
            // Simple rule evaluation
            try {
                if (req.condition.includes("category")) {
                    const parts = req.condition.split(" ");
                    const op = parts[1];
                    const val = parts[2].replace(/'/g, "");
                    if (op === "==") return USER_PROFILE.category === val;
                    if (op === "!=") return USER_PROFILE.category !== val;
                }
                if (req.condition.includes("disability")) {
                    return USER_PROFILE.disability === true;
                }
            } catch (e) { return true; }
            return false;
        }).map(req => {
            // Match against documents
            const matchedDoc = documents.find(doc => 
                doc.name.toLowerCase().includes(req.name.toLowerCase()) ||
                req.name.toLowerCase().includes(doc.name.toLowerCase().split('.')[0])
            );

            let status: 'missing' | 'available' | 'unclear' | 'expired' | 'not_applicable' = 'missing';
            if (overrides[req.id]?.n_a) {
                status = 'not_applicable';
            } else if (matchedDoc) {
                status = matchedDoc.status === 'valid' ? 'available' : matchedDoc.status || 'available';
            }

            return { ...req, matchedDoc, status };
        });

        const mandatoryItems = items.filter(i => i.type === 'mandatory' || (i.type === 'conditional' && i.status !== 'not_applicable'));
        const completedMandatory = mandatoryItems.filter(i => i.status === 'available').length;
        const readinessScore = mandatoryItems.length > 0 ? Math.round((completedMandatory / mandatoryItems.length) * 100) : 0;

        return { items, readinessScore };
    }, [selectedExamId, documents, overrides]);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        toast.info("Uploading to secure vault...");
        try {
            const formData = new FormData();
            formData.append('file', file);

            const data = await api.upload<{ url: string }>("/wallet/upload", formData);
            const cloudinaryUrl = data.url;

            const newDoc = { 
                id: Date.now().toString(),
                name: file.name, 
                url: cloudinaryUrl,
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                type: file.name.split('.').pop()?.toUpperCase() || "DOC",
                date: new Date().toISOString().split('T')[0],
                folderId: activeFolderId,
                status: 'valid' as const
            };
            setDocuments(prev => [newDoc, ...prev]);
            toast.success("Document secured in vault!");
        } catch (error) {
            toast.error("An error occurred during upload");
        } finally {
            setIsUploading(false);
            if (event.target) event.target.value = '';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Navigation Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
                        <Shield className="size-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Edu Wallet</h2>
                        <p className="text-muted-foreground">Smart document management & exam readiness.</p>
                    </div>
                </div>
                <div className="flex bg-muted p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('checklist')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeTab === 'checklist' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Exam Readiness
                    </button>
                    <button 
                        onClick={() => setActiveTab('vault')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeTab === 'vault' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        My Vault
                    </button>
                </div>
            </div>

            {activeTab === 'checklist' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Exam Selection & Checklist */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-md overflow-hidden bg-card/50">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <SearchCheck className="size-5 text-primary" />
                                    Select Your Exam
                                </CardTitle>
                                <CardDescription>Generate a smart checklist based on official exam rules.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <select 
                                        className="w-full pl-10 h-11 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none appearance-none font-medium"
                                        value={selectedExamId}
                                        onChange={(e) => setSelectedExamId(e.target.value)}
                                    >
                                        <option value="">Search or select an exam...</option>
                                        {EXAM_DATABASE.map(exam => (
                                            <option key={exam.id} value={exam.id}>{exam.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {!selectedExamId && (
                                    <div className="mt-12 text-center py-10 border-2 border-dashed rounded-2xl bg-muted/20">
                                        <GraduationCap className="size-12 text-muted-foreground/30 mx-auto mb-4" />
                                        <h3 className="font-medium text-muted-foreground">No exam selected</h3>
                                        <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto mt-1">
                                            Choose an exam above to see required documents and track your readiness.
                                        </p>
                                    </div>
                                )}

                                {checklistData && (
                                    <div className="mt-8 space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-lg text-foreground">Document Checklist</h3>
                                            <Badge variant="outline" className="text-primary border-primary/20">
                                                {checklistData.items.length} Requirements
                                            </Badge>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            {checklistData.items.map((item) => (
                                                <div 
                                                    key={item.id}
                                                    className={cn(
                                                        "group flex items-start gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm",
                                                        item.status === 'available' ? "bg-emerald-50/30 border-emerald-100" : 
                                                        item.status === 'missing' ? "bg-rose-50/30 border-rose-100" : "bg-background"
                                                    )}
                                                >
                                                    <div className="mt-1">
                                                        {item.status === 'available' ? (
                                                            <CheckCircle2 className="size-5 text-emerald-500" />
                                                        ) : item.status === 'missing' ? (
                                                            <AlertCircle className="size-5 text-rose-500" />
                                                        ) : item.status === 'not_applicable' ? (
                                                            <Clock className="size-5 text-slate-400" />
                                                        ) : (
                                                            <Info className="size-5 text-amber-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className={cn("font-medium", item.status === 'not_applicable' && "text-muted-foreground line-through")}>
                                                                {item.name}
                                                            </p>
                                                            <Badge className={cn(
                                                                "capitalize text-[10px]",
                                                                item.type === 'mandatory' ? "bg-rose-100 text-rose-600 hover:bg-rose-100" : 
                                                                item.type === 'conditional' ? "bg-blue-100 text-blue-600 hover:bg-blue-100" : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                                                            )}>
                                                                {item.type}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                                                        
                                                        {item.status === 'available' && item.matchedDoc && (
                                                            <div className="mt-3 flex items-center gap-2 text-xs bg-white/80 p-2 rounded-lg border border-emerald-100">
                                                                <FileText className="size-3 text-emerald-600" />
                                                                <span className="truncate flex-1">{item.matchedDoc.name}</span>
                                                                <button 
                                                                    className="text-emerald-600 font-bold hover:underline"
                                                                    onClick={() => setViewingDoc(item.matchedDoc)}
                                                                >
                                                                    View
                                                                </button>
                                                            </div>
                                                        )}

                                                        {item.status === 'missing' && (
                                                            <div className="mt-3">
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline" 
                                                                    className="h-8 text-xs gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50"
                                                                    onClick={() => {
                                                                        setActiveTab('vault');
                                                                        document.getElementById('doc-upload')?.click();
                                                                    }}
                                                                >
                                                                    <UploadCloud className="size-3" /> Upload Now
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                                                <MoreVertical className="size-4 text-muted-foreground" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => {
                                                                const reason = prompt("Reason for marking as Not Applicable:");
                                                                if (reason !== null) {
                                                                    setOverrides(prev => ({ ...prev, [item.id]: { n_a: true, reason } }));
                                                                }
                                                            }}>
                                                                Mark as N/A
                                                            </DropdownMenuItem>
                                                            {overrides[item.id]?.n_a && (
                                                                <DropdownMenuItem onClick={() => {
                                                                    setOverrides(prev => {
                                                                        const next = { ...prev };
                                                                        delete next[item.id];
                                                                        return next;
                                                                    });
                                                                }}>
                                                                    Re-enable Requirement
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Readiness & Timeline */}
                    <div className="space-y-6">
                        {/* Readiness Score */}
                        <Card className="border-none shadow-md bg-foreground text-background">
                            <CardHeader>
                                <CardTitle className="text-lg">Exam Readiness</CardTitle>
                                <CardDescription className="text-muted-foreground">Overall document preparation score.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold">{checklistData?.readinessScore || 0}%</span>
                                    <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                                        <Shield className="size-6" />
                                    </div>
                                </div>
                                <Progress value={checklistData?.readinessScore || 0} className="h-2 bg-muted/20" />
                                <p className="text-sm text-indigo-100">
                                    {checklistData?.readinessScore === 100 
                                        ? "Excellent! You are fully document-ready for the exam day."
                                        : checklistData?.readinessScore && checklistData.readinessScore > 50 
                                            ? "Looking good! Just a few more documents to secure."
                                            : "Keep going! You need more documents to be exam-ready."}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Smart Suggestions */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Info className="size-5 text-amber-500" />
                                    Smart Suggestions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {checklistData ? (
                                    <>
                                        {checklistData.items.some(i => i.status === 'missing' && i.name.includes('Aadhaar')) && (
                                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-800 leading-relaxed">
                                                "You uploaded Aadhaar, but it seems to be an old version. Ensure it's the latest e-Aadhaar for verification."
                                            </div>
                                        )}
                                        {USER_PROFILE.category !== 'General' && !checklistData.items.find(i => i.name === 'Caste Certificate')?.status === 'available' && (
                                            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-800 LED-relaxed">
                                                "Based on your profile, a central-list Caste Certificate may be required for category benefits."
                                            </div>
                                        )}
                                        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-800 leading-relaxed">
                                            "Pro Tip: Carry 2 printed passport photos as a backup on exam day."
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">Select an exam for suggestions.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Timeline View */}
                        <Card className="border-none shadow-md bg-card/50">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Calendar className="size-5 text-primary" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative pl-6 border-l-2 border-rose-200">
                                        <div className="absolute -left-1.5 top-0 size-3 rounded-full bg-rose-500" />
                                        <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">Immediate</p>
                                        <p className="text-sm font-medium mt-1">Verify Identity Proof</p>
                                        <p className="text-xs text-muted-foreground">Aadhaar mismatch detected in previous attempt.</p>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-indigo-200">
                                        <div className="absolute -left-1.5 top-0 size-3 rounded-full bg-indigo-500" />
                                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Within 7 Days</p>
                                        <p className="text-sm font-medium mt-1">Download Admit Card</p>
                                        <p className="text-xs text-muted-foreground">Expected release window starts tomorrow.</p>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-slate-200">
                                        <div className="absolute -left-1.5 top-0 size-3 rounded-full bg-slate-400" />
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Before Exam Day</p>
                                        <p className="text-sm font-medium mt-1">Final Printouts</p>
                                        <p className="text-xs text-muted-foreground">Keep 2 copies of hall ticket and IDs.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Stats/Quick Access */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-card border rounded-2xl p-4 flex items-center gap-4">
                            <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                <FileIcon className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Files</p>
                                <p className="text-lg font-bold">{documents.length}</p>
                            </div>
                        </div>
                        <div className="bg-card border rounded-2xl p-4 flex items-center gap-4">
                            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                                <HardDrive className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Storage Used</p>
                                <p className="text-lg font-bold">4.35 MB</p>
                            </div>
                        </div>
                        <div className="bg-card border rounded-2xl p-4 flex items-center gap-4">
                            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                                <Shield className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Vault Status</p>
                                <p className="text-lg font-bold">Encrypted</p>
                            </div>
                        </div>
                    </div>

                    {/* Browser Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border">
                        <div className="flex items-center gap-2">
                            {activeFolderId ? (
                                <Button variant="ghost" onClick={() => setActiveFolderId(null)} className="gap-2 -ml-2 text-primary hover:text-primary/80 hover:bg-primary/5">
                                    <ChevronLeft className="size-4" /> Back to Root
                                </Button>
                            ) : (
                                <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/5" onClick={() => setIsCreatingFolder(true)}>
                                    <Plus className="size-4" /> New Folder
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search vault..."
                                    className="pl-10 h-10 rounded-xl focus:ring-primary"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <input
                                type="file"
                                id="doc-upload"
                                className="hidden"
                                onChange={handleUpload}
                                disabled={isUploading}
                            />
                            <Button 
                                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-95 border-none"
                                onClick={() => document.getElementById('doc-upload')?.click()}
                                disabled={isUploading}
                            >
                                {isUploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
                                Upload
                            </Button>
                        </div>
                    </div>

                    {/* Gallery View */}
                    <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[400px]">
                        {activeFolderId && (
                            <div className="mb-6 flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                    <FolderIcon className="size-5" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">{folders.find(f => f.id === activeFolderId)?.name}</h3>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {/* Folder Creation Input */}
                            {!activeFolderId && isCreatingFolder && (
                                <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 animate-in zoom-in-95 duration-200">
                                    <FolderIcon className="size-10 text-primary/30" />
                                    <Input 
                                        autoFocus
                                        placeholder="Folder Name"
                                        className="h-8 text-sm text-center"
                                        value={newFolderName}
                                        onChange={e => setNewFolderName(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                if (!newFolderName.trim()) {
                                                    toast.error("Folder name cannot be empty");
                                                    return;
                                                }
                                                setFolders(prev => [...prev, { id: Date.now().toString(), name: newFolderName.trim() }]);
                                                setNewFolderName("");
                                                setIsCreatingFolder(false);
                                                toast.success("Folder created");
                                            }
                                            if (e.key === 'Escape') setIsCreatingFolder(false);
                                        }}
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setIsCreatingFolder(false)}>Cancel</Button>
                                        <Button size="sm" className="h-6 text-xs px-2" onClick={() => {
                                            if (!newFolderName.trim()) {
                                                toast.error("Folder name cannot be empty");
                                                return;
                                            }
                                            setFolders(prev => [...prev, { id: Date.now().toString(), name: newFolderName.trim() }]);
                                            setNewFolderName("");
                                            setIsCreatingFolder(false);
                                            toast.success("Folder created");
                                        }}>Save</Button>
                                    </div>
                                </div>
                            )}

                            {/* Folders List (only at root) */}
                            {!activeFolderId && folders.map(folder => (
                                <div 
                                    key={folder.id} 
                                    onClick={() => setActiveFolderId(folder.id)} 
                                    className="group relative cursor-pointer border border-primary/10 bg-background rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:border-primary hover:shadow-md transition-all duration-200 aspect-square"
                                >
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    setDocuments(prev => prev.map(doc => doc.folderId === folder.id ? { ...doc, folderId: null } : doc));
                                                    setFolders(prev => prev.filter(f => f.id !== folder.id));
                                                    toast.success("Folder deleted");
                                                }} className="text-destructive focus:text-destructive cursor-pointer">
                                                    <Trash2 className="size-4 mr-2" /> Delete Folder
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center w-full">
                                        <InteractiveFolder 
                                            size={0.7} 
                                            color="#E8852A"
                                            items={
                                                documents.filter(d => d.folderId === folder.id).slice(0, 3).map((doc, i) => (
                                                    <FileIcon key={i} className="size-6 text-slate-400" />
                                                ))
                                            }
                                        />
                                    </div>
                                    <div className="w-full text-center mt-[-15px] pb-1">
                                        <p className="font-medium text-sm truncate px-2 mb-1">{folder.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {documents.filter(d => d.folderId === folder.id).length} files
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Files List */}
                            {documents.filter(doc => 
                                doc.name.toLowerCase().includes(searchQuery.toLowerCase()) && doc.folderId === activeFolderId
                            ).map((doc) => (
                                <div 
                                    key={doc.id} 
                                    onClick={() => setViewingDoc(doc)}
                                    className="group relative border border-primary/10 bg-background rounded-2xl p-3 flex flex-col gap-3 hover:border-primary hover:shadow-md transition-all duration-200 aspect-square cursor-pointer"
                                >
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm">
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem onClick={() => setViewingDoc(doc)} className="cursor-pointer">
                                                    <Eye className="size-4 mr-2" /> View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Download className="size-4 mr-2" /> Download
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    setDocuments(prev => prev.filter(d => d.id !== doc.id));
                                                    toast.success("Document removed");
                                                }} className="text-destructive focus:text-destructive cursor-pointer">
                                                    <Trash2 className="size-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    
                                    <div className="flex-1 bg-muted/40 rounded-xl flex items-center justify-center overflow-hidden relative group/preview">
                                        {(doc.type === 'JPG' || doc.type === 'PNG' || doc.type === 'WEBP') && doc.url && doc.url !== '#' ? (
                                            <img 
                                                src={doc.url} 
                                                alt={doc.name} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-110"
                                            />
                                        ) : (doc.url && doc.url.includes('cloudinary.com') && doc.url.toLowerCase().endsWith('.pdf')) ? (
                                            <img 
                                                src={doc.url.replace(/\.pdf$/i, '.jpg')} 
                                                alt={doc.name} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-110"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                {doc.type === 'PDF' ? (
                                                    <FileText className="size-12 text-destructive opacity-80" />
                                                ) : (
                                                    <FileIcon className="size-12 text-primary opacity-80" />
                                                )}
                                                <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{doc.type}</span>
                                            </div>
                                        )}
                                        
                                        {/* Hover Eye Overlay */}
                                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                                            <div className="p-3 bg-primary text-primary-foreground rounded-full border border-primary/30 shadow-lg transform translate-y-4 group-hover/preview:translate-y-0 transition-transform duration-300">
                                                <Eye className="size-6" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <p className="font-medium text-sm truncate" title={doc.name}>{doc.name}</p>
                                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                                            <span>{doc.size || 'N/A'}</span>
                                            <span className="px-1.5 py-0.5 bg-muted rounded font-bold tracking-wide">{doc.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {!isCreatingFolder && folders.length === 0 && documents.filter(d => d.folderId === activeFolderId).length === 0 && (
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-20">
                                <div className="p-4 bg-muted rounded-full mb-4">
                                    <FolderIcon className="size-10 opacity-40" />
                                </div>
                                <p className="font-medium">Your vault is empty</p>
                                <p className="text-sm mt-1">Upload documents to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

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
                                    <p className="text-xs text-muted-foreground mt-1 uppercase font-black tracking-widest">
                                        {viewingDoc.type} • {viewingDoc.size || "Unknown Size"}
                                    </p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setViewingDoc(null)}
                                className="rounded-full hover:bg-muted"
                            >
                                <ChevronLeft className="size-6 rotate-90 text-foreground" />
                            </Button>
                        </div>
                        
                        <div className="flex-1 bg-background p-4 sm:p-8 overflow-y-auto">
                            {viewingDoc.url && viewingDoc.url !== '#' ? (
                                <div className="w-full h-full min-h-[500px] bg-card rounded-3xl border border-primary/10 shadow-inner flex items-center justify-center relative overflow-hidden">
                                    {/* Simulated Content Background */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-primary p-10 text-center select-none">
                                        <Shield className="size-20 opacity-10 mb-4" />
                                        <p className="text-xl font-black uppercase tracking-tighter opacity-5">Encrypted Document</p>
                                    </div>
                                    
                                    {/* Real Preview */}
                                    {viewingDoc.url.startsWith('blob:') ? (
                                        <iframe 
                                            src={viewingDoc.url} 
                                            className="w-full h-full relative z-10 border-none" 
                                            title="Document Preview"
                                        />
                                    ) : (
                                        <div className="relative z-10 flex flex-col items-center gap-4 text-slate-600">
                                            <FileText className="size-16" />
                                            <div className="text-center">
                                                <p className="font-bold">Digital Archive Preview</p>
                                                <p className="text-xs text-muted-foreground">ID: {viewingDoc.id}</p>
                                            </div>
                                            <Button variant="outline" className="rounded-full mt-4" onClick={() => window.open(viewingDoc.url, '_blank')}>
                                                Open Original File
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                    <AlertCircle className="size-12 mb-4 opacity-20" />
                                    <h3 className="font-bold text-lg">No Preview Available</h3>
                                    <p className="max-w-xs text-center mt-2">This is a mock document. Please upload a real file to see the interactive preview engine in action.</p>
                                    <Button className="mt-8 rounded-full px-8" onClick={() => setViewingDoc(null)}>Close Viewer</Button>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-6 bg-card border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2].map(i => (
                                        <div key={i} className="size-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center">
                                            <CheckCircle2 className="size-4 text-primary" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">End-to-End Encryption Active</p>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Button variant="outline" className="flex-1 sm:flex-none rounded-2xl font-black h-11 px-6 border-primary/20 text-primary hover:bg-primary/5">DOWNLOAD</Button>
                                <Button className="flex-1 sm:flex-none rounded-2xl font-black h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 border-none">VERIFY AUTHENTICITY</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
