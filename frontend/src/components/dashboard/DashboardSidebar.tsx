import { cn } from "@/lib/utils";
import { 
    LayoutDashboard, 
    FileText, 
    GraduationCap, 
    LineChart, 
    Wallet, 
    CheckSquare,
    Settings,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

export default function DashboardSidebar({ activeSection, setActiveSection }: SidebarProps) {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'notes', label: 'Notes', icon: FileText },
        { id: 'exam', label: 'Exam', icon: GraduationCap },
        { id: 'insights', label: 'Insights', icon: LineChart },
        { id: 'edu-wallet', label: 'Edu Wallet', icon: Wallet },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    ];

    return (
        <div className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                        <GraduationCap className="size-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">TechTitans</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                            activeSection === item.id 
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon className={cn(
                            "size-5 transition-colors",
                            activeSection === item.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                    <Settings className="size-5" />
                    Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/5">
                    <LogOut className="size-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
