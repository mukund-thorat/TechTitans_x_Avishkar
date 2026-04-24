import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Trophy, 
    UploadCloud, 
    BrainCircuit, 
    FileText, 
    Loader2, 
    Sparkles, 
    CheckCircle2, 
    AlertCircle,
    ListChecks
} from "lucide-react";

// Mock topics type
type Topic = {
    id: string;
    name: string;
    priority: number;
    reason: string;
    questions: string[];
};

export default function ExamSection() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<Topic[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAnalysisResult(null); // Reset on new file
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsUploading(true);
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsUploading(false);

        setIsAnalyzing(true);
        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 2500));
        setIsAnalyzing(false);

        // Mock result
        setAnalysisResult([
            {
                id: "1",
                name: "Advanced Calculus & Limits",
                priority: 1,
                reason: "Historically comprises 35% of the final exam. Foundational for subsequent topics.",
                questions: [
                    "Explain the precise definition of a limit and provide an example of a non-existent limit.",
                    "How do you apply L'Hopital's rule to indeterminate forms?",
                    "Evaluate the integral of a rational function using partial fractions."
                ]
            },
            {
                id: "2",
                name: "Series & Sequences Convergence",
                priority: 2,
                reason: "Crucial conceptual weight, often tested via multiple-choice and short answer.",
                questions: [
                    "State the Ratio Test and provide a scenario where it fails to determine convergence.",
                    "Determine the radius and interval of convergence for a given power series."
                ]
            },
            {
                id: "3",
                name: "Vector Applications",
                priority: 3,
                reason: "Important but usually only accounts for 1 or 2 long-form questions.",
                questions: [
                    "Find the equation of a plane given three points in 3D space.",
                    "Calculate the cross product of two vectors and explain its geometric meaning."
                ]
            }
        ]);
    };

    const resetAnalysis = () => {
        setFile(null);
        setAnalysisResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

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

            {/* AI Analyzer Section */}
            <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 via-transparent to-transparent">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <BrainCircuit className="size-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">AI Study Analyzer</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                        Upload your notes, PDFs, or study reports. Our AI will extract the most important topics, rank them by priority, and generate likely exam questions to help you study smarter.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!analysisResult ? (
                        <div className="space-y-4">
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center gap-4 text-center ${
                                    file ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                                }`}
                                onClick={() => !isUploading && !isAnalyzing && fileInputRef.current?.click()}
                                style={{ cursor: isUploading || isAnalyzing ? 'default' : 'pointer' }}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.txt"
                                    disabled={isUploading || isAnalyzing}
                                />
                                {file ? (
                                    <>
                                        <div className="p-3 bg-primary/10 rounded-full">
                                            <FileText className="size-8 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-lg">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-muted rounded-full">
                                            <UploadCloud className="size-8 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-lg">Click to upload study material</p>
                                            <p className="text-sm text-muted-foreground">Supports PDF, DOCX, and TXT (Max 50MB)</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                {file && (
                                    <Button variant="ghost" onClick={(e) => { e.stopPropagation(); resetAnalysis(); }} disabled={isUploading || isAnalyzing}>
                                        Cancel
                                    </Button>
                                )}
                                <Button 
                                    onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} 
                                    disabled={!file || isUploading || isAnalyzing} 
                                    className="gap-2 min-w-[140px]"
                                >
                                    {isUploading ? (
                                        <><Loader2 className="size-4 animate-spin" /> Uploading...</>
                                    ) : isAnalyzing ? (
                                        <><Sparkles className="size-4 animate-spin text-yellow-300" /> Analyzing...</>
                                    ) : (
                                        <><BrainCircuit className="size-4" /> Analyze Material</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <CheckCircle2 className="size-5 text-green-500" />
                                        Analysis Complete
                                    </h3>
                                    <p className="text-muted-foreground text-sm">We've identified the most critical areas to focus your study time on.</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={resetAnalysis} className="gap-2">
                                    <UploadCloud className="size-4" /> Analyze Another
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                {analysisResult.map((topic) => (
                                    <Card key={topic.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: topic.priority === 1 ? '#ef4444' : topic.priority === 2 ? '#f59e0b' : '#3b82f6' }}>
                                        <CardHeader className="pb-3 bg-muted/20">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                            topic.priority === 1 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                            topic.priority === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                        }`}>
                                                            Priority {topic.priority}
                                                        </span>
                                                        <CardTitle className="text-lg">{topic.name}</CardTitle>
                                                    </div>
                                                    <CardDescription className="flex items-start gap-1.5 mt-2 text-sm text-foreground/80">
                                                        <AlertCircle className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                                                        {topic.reason}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4 space-y-3">
                                            <p className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                                <ListChecks className="size-4" /> Likely Exam Questions:
                                            </p>
                                            <ul className="space-y-2">
                                                {topic.questions.map((q, idx) => (
                                                    <li key={idx} className="flex gap-3 text-sm items-start p-3 rounded-lg bg-muted/40 border border-muted">
                                                        <span className="flex items-center justify-center size-5 rounded-full bg-primary/10 text-primary font-medium text-[10px] shrink-0 mt-0.5">
                                                            {idx + 1}
                                                        </span>
                                                        <span>{q}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
