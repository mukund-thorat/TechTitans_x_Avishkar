import { useCurrentUserQuery } from "@/api/authHooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { User as UserIcon } from "lucide-react";
import ProfileDropdown from "@/components/profile-dropdown";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { data: user, isLoading } = useCurrentUserQuery();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back to your adventurer hub.</p>
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

                <Card className="overflow-hidden border-2 border-primary/10 shadow-lg">
                    <CardHeader className="bg-primary/5 pb-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                {user?.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt="Avatar" 
                                        className="size-24 rounded-full border-4 border-background shadow-xl"
                                    />
                                ) : (
                                    <div className="size-24 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-xl">
                                        <UserIcon className="size-12 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-green-500 size-6 rounded-full border-4 border-background" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{user?.firstName} {user?.lastName}</CardTitle>
                                <CardDescription className="text-base">{user?.email}</CardDescription>
                                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                    Adventurer Level 1
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-muted/50 border border-border">
                                <p className="text-sm font-medium text-muted-foreground">Quests Completed</p>
                                <p className="text-2xl font-bold">0</p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50 border border-border">
                                <p className="text-sm font-medium text-muted-foreground">Achievement Points</p>
                                <p className="text-2xl font-bold">150</p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50 border border-border">
                                <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                                <p className="text-2xl font-bold text-green-500">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardHeader>
                            <CardTitle className="text-lg">Daily Challenges</CardTitle>
                            <CardDescription>New challenges available every 24 hours.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[30%]" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">3 of 10 challenges remaining</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardHeader>
                            <CardTitle className="text-lg">Guild Messages</CardTitle>
                            <CardDescription>No new messages from your guild members.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="link" className="px-0 h-auto">View Inbox &rarr;</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
