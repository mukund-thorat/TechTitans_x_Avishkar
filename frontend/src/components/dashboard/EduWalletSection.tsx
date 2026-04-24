import { useState } from "react";
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
    Lock,
    Unlock,
    Key
} from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { InteractiveFolder } from "@/components/ui/interactive-folder";

export default function EduWalletSection() {
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Folder state
    const [folders, setFolders] = useState<{ id: string, name: string, pin?: string }[]>([
        { id: "f1", name: "Assignments" }
    ]);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    // PIN state
    const [verifyingFolderId, setVerifyingFolderId] = useState<string | null>(null);
    const [pinInput, setPinInput] = useState("");
    const [isSettingPin, setIsSettingPin] = useState(false);
    const [targetFolderIdForPin, setTargetFolderIdForPin] = useState<string | null>(null);
    const [newPin, setNewPin] = useState("");

    // Documents state updated with folderId
    const [documents, setDocuments] = useState<{ id: string, name: string, url: string, size?: string, type?: string, date: string, folderId: string | null }[]>([
        { id: "1", name: "High School Certificate.pdf", url: "#", size: "2.4 MB", type: "PDF", date: "2024-04-20", folderId: null },
        { id: "2", name: "University Transcript.pdf", url: "#", size: "1.1 MB", type: "PDF", date: "2024-04-22", folderId: "f1" },
        { id: "3", name: "Identity Proof.jpg", url: "#", size: "850 KB", type: "JPG", date: "2024-04-23", folderId: null },
    ]);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        toast.info("Uploading to secure vault...");

        try {
            // Simulate network delay for upload
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const newDoc = { 
                id: Date.now().toString(),
                name: file.name, 
                url: URL.createObjectURL(file), // create local object URL instead of Cloudinary URL
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                type: file.name.split('.').pop()?.toUpperCase() || "DOC",
                date: new Date().toISOString().split('T')[0],
                folderId: activeFolderId
            };
            setDocuments(prev => [newDoc, ...prev]);
            toast.success("Document secured in vault!");
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("An error occurred during upload");
        } finally {
            setIsUploading(false);
            if (event.target) event.target.value = '';
        }
    };

    const handleDelete = (id: string) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        toast.success("Document removed from vault");
    };

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) {
            toast.error("Folder name cannot be empty");
            return;
        }
        setFolders(prev => [...prev, { id: Date.now().toString(), name: newFolderName.trim() }]);
        setNewFolderName("");
        setIsCreatingFolder(false);
        toast.success("Folder created");
    };

    const handleDeleteFolder = (id: string) => {
        setDocuments(prev => prev.map(doc => doc.folderId === id ? { ...doc, folderId: null } : doc));
        setFolders(prev => prev.filter(f => f.id !== id));
        toast.success("Folder deleted");
    };

    const handleFolderClick = (folder: { id: string, name: string, pin?: string }) => {
        if (folder.pin) {
            setVerifyingFolderId(folder.id);
            setPinInput("");
        } else {
            setActiveFolderId(folder.id);
        }
    };

    const handleVerifyPin = () => {
        const folder = folders.find(f => f.id === verifyingFolderId);
        if (folder && folder.pin === pinInput) {
            setActiveFolderId(folder.id);
            setVerifyingFolderId(null);
            setPinInput("");
            toast.success("Folder unlocked");
        } else {
            toast.error("Incorrect PIN");
            setPinInput("");
        }
    };

    const handleSetPin = () => {
        if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
            toast.error("PIN must be 4 digits");
            return;
        }
        setFolders(prev => prev.map(f => f.id === targetFolderIdForPin ? { ...f, pin: newPin } : f));
        setIsSettingPin(false);
        setNewPin("");
        setTargetFolderIdForPin(null);
        toast.success("PIN set successfully");
    };

    const handleRemovePin = (id: string) => {
        setFolders(prev => prev.map(f => f.id === id ? { ...f, pin: undefined } : f));
        toast.success("PIN removed");
    };

    const filteredDocs = documents.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) && doc.folderId === activeFolderId
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                        <Shield className="size-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Study</h2>
                        <p className="text-muted-foreground">Securely store and manage your academic documents.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        id="doc-upload"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={isUploading}
                    />
                    <Button 
                        className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95"
                        onClick={() => document.getElementById('doc-upload')?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
                        Upload Document
                    </Button>
                </div>
            </div>

            {/* Stats/Quick Access */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border rounded-2xl p-4 flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
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
                        <Button variant="ghost" onClick={() => setActiveFolderId(null)} className="gap-2 -ml-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                            <ChevronLeft className="size-4" /> Back to Root
                        </Button>
                    ) : (
                        <Button variant="outline" className="gap-2" onClick={() => setIsCreatingFolder(true)}>
                            <Plus className="size-4" /> New Folder
                        </Button>
                    )}
                </div>
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search your vault..."
                        className="pl-10 h-10 rounded-xl focus:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Gallery View */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[400px]">
                {activeFolderId && (
                    <div className="mb-6 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <FolderIcon className="size-5" />
                        </div>
                        <h3 className="text-xl font-bold">{folders.find(f => f.id === activeFolderId)?.name}</h3>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* Folder Creation Input */}
                    {!activeFolderId && isCreatingFolder && (
                        <div className="border-2 border-dashed border-indigo-300 bg-indigo-50/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 animate-in zoom-in-95 duration-200">
                            <FolderIcon className="size-10 text-indigo-300" />
                            <Input 
                                autoFocus
                                placeholder="Folder Name"
                                className="h-8 text-sm text-center"
                                value={newFolderName}
                                onChange={e => setNewFolderName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleCreateFolder();
                                    if (e.key === 'Escape') setIsCreatingFolder(false);
                                }}
                            />
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setIsCreatingFolder(false)}>Cancel</Button>
                                <Button size="sm" className="h-6 text-xs px-2" onClick={handleCreateFolder}>Save</Button>
                            </div>
                        </div>
                    )}

                    {/* Folders List (only at root) */}
                    {!activeFolderId && folders.map(folder => (
                        <div 
                            key={folder.id} 
                            onClick={() => handleFolderClick(folder)} 
                            className="group relative cursor-pointer border bg-background rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:border-indigo-500 hover:shadow-md transition-all duration-200 aspect-square"
                        >
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                            <MoreVertical className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl">
                                        {folder.pin ? (
                                            <>
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setTargetFolderIdForPin(folder.id); setIsSettingPin(true); }} className="cursor-pointer">
                                                    <Key className="size-4 mr-2" /> Change PIN
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRemovePin(folder.id); }} className="cursor-pointer">
                                                    <Unlock className="size-4 mr-2" /> Remove PIN
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setTargetFolderIdForPin(folder.id); setIsSettingPin(true); }} className="cursor-pointer">
                                                <Lock className="size-4 mr-2" /> Lock Folder
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }} className="text-destructive focus:text-destructive cursor-pointer">
                                            <Trash2 className="size-4 mr-2" /> Delete Folder
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {folder.pin && (
                                <div className="absolute top-2 left-2 p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <Lock className="size-3" />
                                </div>
                            )}

                            <div className="flex-1 flex items-center justify-center w-full">
                                <InteractiveFolder 
                                    size={0.7} 
                                    color="#6366f1" // indigo-500
                                    isLocked={!!folder.pin}
                                    items={
                                        folder.pin ? [<Lock key="lock" className="size-8 text-slate-400" />] :
                                        documents.filter(d => d.folderId === folder.id).slice(0, 3).map((doc, i) => (
                                            doc.type === 'JPG' || doc.type === 'PNG' ? 
                                                <FileIcon key={i} className="size-6 text-slate-400" /> : 
                                                <FileText key={i} className="size-6 text-slate-400" />
                                        ))
                                    }
                                />
                            </div>
                            <div className="w-full text-center mt-[-15px] pb-1">
                                <p className="font-medium text-sm truncate px-2 mb-1">{folder.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {folder.pin ? "Locked" : `${documents.filter(d => d.folderId === folder.id).length} files`}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Files List */}
                    {filteredDocs.map((doc) => (
                        <div 
                            key={doc.id} 
                            className="group relative border bg-background rounded-2xl p-3 flex flex-col gap-3 hover:border-indigo-500 hover:shadow-md transition-all duration-200 aspect-square"
                        >
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm">
                                            <MoreVertical className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl">
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <a href={doc.url} target="_blank" rel="noreferrer"><Eye className="size-4 mr-2" /> View</a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Download className="size-4 mr-2" /> Download
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(doc.id)} className="text-destructive focus:text-destructive cursor-pointer">
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
                                ) : (doc.url && doc.url.toLowerCase().endsWith('.pdf')) ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText className="size-12 text-indigo-500 opacity-80" />
                                        <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">PDF</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <FileIcon className="size-12 text-indigo-500 opacity-80" />
                                        <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{doc.type}</span>
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                                    <Eye className="size-6 text-white" />
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
                            {activeFolderId ? <FileText className="size-10 opacity-40" /> : <FolderIcon className="size-10 opacity-40" />}
                        </div>
                        <p className="font-medium">{activeFolderId ? "This folder is empty" : "Your vault is empty"}</p>
                        <p className="text-sm mt-1">{activeFolderId ? "Upload documents to this folder to see them here" : "Create a folder or upload a document to get started"}</p>
                        {!activeFolderId && (
                            <Button 
                                variant="outline" 
                                className="mt-6 gap-2"
                                onClick={() => setIsCreatingFolder(true)}
                            >
                                <Plus className="size-4" /> Create Folder
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* PIN Verification Modal */}
            {verifyingFolderId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card border rounded-3xl p-8 shadow-2xl w-full max-w-sm mx-4 animate-in zoom-in-95 duration-300">
                        <div className="flex flex-col items-center gap-6 text-center">
                            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl">
                                <Lock className="size-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Locked Folder</h3>
                                <p className="text-muted-foreground mt-1">Enter the 4-digit PIN to access this folder.</p>
                            </div>
                            
                            <div className="flex gap-3 justify-center">
                                {[0, 1, 2, 3].map((i) => (
                                    <div 
                                        key={i} 
                                        className={`size-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${pinInput.length > i ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-muted bg-muted/20 text-muted-foreground"}`}
                                    >
                                        {pinInput.length > i ? "•" : ""}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-3 w-full">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "OK"].map((btn) => (
                                    <Button
                                        key={btn.toString()}
                                        variant={btn === "OK" ? "default" : "outline"}
                                        className={`h-14 text-lg rounded-xl font-bold ${btn === "OK" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                                        onClick={() => {
                                            if (btn === "C") setPinInput("");
                                            else if (btn === "OK") handleVerifyPin();
                                            else if (pinInput.length < 4) setPinInput(prev => prev + btn);
                                        }}
                                    >
                                        {btn}
                                    </Button>
                                ))}
                            </div>
                            
                            <Button variant="ghost" onClick={() => { setVerifyingFolderId(null); setPinInput(""); }} className="w-full">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* PIN Setup Modal */}
            {isSettingPin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card border rounded-3xl p-8 shadow-2xl w-full max-w-sm mx-4 animate-in zoom-in-95 duration-300">
                        <div className="flex flex-col items-center gap-6 text-center">
                            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl">
                                <Shield className="size-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{folders.find(f => f.id === targetFolderIdForPin)?.pin ? "Change PIN" : "Set Folder PIN"}</h3>
                                <p className="text-muted-foreground mt-1">Create a 4-digit PIN to secure this folder.</p>
                            </div>

                            <Input 
                                type="password" 
                                maxLength={4}
                                placeholder="Enter 4-digit PIN"
                                className="h-14 text-center text-2xl tracking-[0.2em] font-bold rounded-2xl focus:ring-indigo-600"
                                value={newPin}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    setNewPin(val);
                                }}
                                autoFocus
                            />

                            <div className="flex gap-3 w-full">
                                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => { setIsSettingPin(false); setNewPin(""); setTargetFolderIdForPin(null); }}>
                                    Cancel
                                </Button>
                                <Button className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20" onClick={handleSetPin}>
                                    Save PIN
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
