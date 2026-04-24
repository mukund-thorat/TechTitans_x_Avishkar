import { useState } from "react";
import { useCurrentUserQuery } from "@/api/authHooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { User as UserIcon, GraduationCap } from "lucide-react";
import ProfileDropdown from "@/components/profile-dropdown";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NotesSection from "@/components/dashboard/NotesSection";
import ExamSection from "@/components/dashboard/ExamSection";
import InsightsSection from "@/components/dashboard/InsightsSection";
import EduWalletSection from "@/components/dashboard/EduWalletSection";
import TasksSection from "@/components/dashboard/TasksSection";
import OverviewSection from "@/components/dashboard/OverviewSection";
import ExamDocumentChecklist from "@/components/dashboard/ExamDocumentChecklist";
import MapSection from "@/components/dashboard/MapSection";

export default function DashboardPage() {
    const { data: user, isLoading } = useCurrentUserQuery();
    const [activeSection, setActiveSection] = useState("overview");

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    const renderSection = () => {
        switch (activeSection) {
            case "notes":
                return <NotesSection />;
            case "exam":
                return <ExamSection />;
            case "insights":
                return <InsightsSection />;
            case "study":
                return <EduWalletSection />;

            case "exam-docs":
                return <ExamDocumentChecklist />;
            case "tasks":
                return <TasksSection />;
            case "map":
                return <MapSection />;
            default:
                return <OverviewSection onNavigate={setActiveSection} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 space-y-8 w-full">
                    <header className="flex items-center justify-between w-full">
                        <div>
                            <h1 className="text-sm font-medium capitalize">
                                Dashboard / {activeSection.replace('-', ' ')}
                            </h1>
                        </div>
                        <ProfileDropdown 
                            name={`${user?.firstName} ${user?.lastName}`}
                            email={user?.email || ""}
                            avatar={user?.avatar || ""}
                            trigger={
                                <button className="relative size-10 rounded-full hover:ring-2 hover:ring-primary/50 transition-all outline-none">
                                    <Avatar className="size-10">
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </button>
                            }
                        />
                    </header>

                    {renderSection()}
                </div>
            </main>
        </div>
    );
}

