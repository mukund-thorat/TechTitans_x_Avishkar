import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Coins } from "lucide-react";

export default function EduWalletSection() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edu Wallet</h2>
                    <p className="text-muted-foreground">Manage your educational tokens and rewards.</p>
                </div>
                <Button className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    <Coins className="size-4" />
                    Buy Tokens
                </Button>
            </div>

            <Card className="bg-slate-950 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Wallet className="size-32" />
                </div>
                <CardHeader>
                    <p className="text-slate-400 text-sm font-medium">Total Balance</p>
                    <CardTitle className="text-5xl font-bold">2,450 <span className="text-xl text-slate-500">EDT</span></CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white gap-2">
                        <ArrowUpRight className="size-4" />
                        Send
                    </Button>
                    <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white gap-2">
                        <ArrowDownLeft className="size-4" />
                        Receive
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <History className="size-5 text-muted-foreground" />
                        Recent Transactions
                    </h3>
                    <Button variant="link" size="sm">View All</Button>
                </div>
                {[
                    { title: "Exam Reward", amount: "+50 EDT", type: "credit", date: "Today" },
                    { title: "Course Purchase", amount: "-500 EDT", type: "debit", date: "Yesterday" },
                    { title: "Daily Login", amount: "+10 EDT", type: "credit", date: "2 days ago" },
                ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card">
                        <div className="flex gap-4 items-center">
                            <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {tx.type === 'credit' ? <ArrowDownLeft className="size-5" /> : <ArrowUpRight className="size-5" />}
                            </div>
                            <div>
                                <p className="font-medium">{tx.title}</p>
                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                        </div>
                        <p className={`font-bold ${tx.type === 'credit' ? 'text-green-500' : 'text-foreground'}`}>
                            {tx.amount}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
