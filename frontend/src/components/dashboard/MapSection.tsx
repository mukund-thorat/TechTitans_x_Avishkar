import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Navigation, 
    MapPin, 
    Clock, 
    AlertTriangle, 
    Info, 
    ChevronRight, 
    Upload,
    CheckCircle2,
    Route as RouteIcon,
    Timer,
    Zap,
    Map as MapIcon,
    Car,
    FileText
} from 'lucide-react';
import gsap from 'gsap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Custom Icons for User and Exam Center
const userIcon = L.divIcon({
    className: 'custom-user-icon',
    html: `<div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
            <div class="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const examIcon = L.divIcon({
    className: 'custom-exam-icon',
    html: `<div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 bg-orange-500/20 rounded-full animate-pulse"></div>
            <div class="relative w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center border-2 border-white shadow-xl transform rotate-45">
                <div class="transform -rotate-45">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
            </div>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

// Animated Route Component
function AnimatedRoute({ positions }: { positions: [number, number][] }) {
    const polylineRef = useRef<L.Polyline>(null);

    useEffect(() => {
        if (polylineRef.current) {
            const path = polylineRef.current.getElement();
            if (path) {
                const length = path.getTotalLength();
                
                gsap.set(path, { 
                    strokeDasharray: length, 
                    strokeDashoffset: length 
                });

                gsap.to(path, {
                    strokeDashoffset: 0,
                    duration: 2.5,
                    ease: "power2.inOut",
                    delay: 0.8
                });
            }
        }
    }, [positions]);

    return (
        <Polyline 
            ref={polylineRef} 
            positions={positions} 
            pathOptions={{ 
                color: '#E8852A', 
                weight: 6, 
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: '1, 10', // Default dash for background
                className: 'route-line-main'
            }} 
        />
    );
}

// Map Controller for focus and bounds
function MapController({ positions }: { positions: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [100, 100], animate: true, duration: 1.5 });
        }
    }, [positions, map]);
    return null;
}

export default function MapSection() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDetected, setIsDetected] = useState(false);
    const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
    const [examLoc, setExamLoc] = useState<[number, number] | null>(null);
    const [routePositions, setRoutePositions] = useState<[number, number][]>([]);
    
    // Mock Data
    const examInfo = {
        name: "IIT Bombay - Main Gate",
        address: "Powai, Mumbai, Maharashtra 400076",
        reportingTime: "08:30 AM",
        examStart: "09:30 AM",
        coords: [19.1334, 72.9133] as [number, number]
    };

    const userMockLoc: [number, number] = [19.0760, 72.8777];

    const handleFileUpload = () => {
        setIsProcessing(true);
        // Simulate extraction delay
        setTimeout(() => {
            setIsProcessing(false);
            setIsDetected(true);
            setUserLoc(userMockLoc);
            setExamLoc(examInfo.coords);
            
            // Generate mock route points
            const points: [number, number][] = [
                userMockLoc,
                [19.0850, 72.8900],
                [19.1000, 72.9000],
                [19.1150, 72.9050],
                examInfo.coords
            ];
            setRoutePositions(points);
        }, 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
                
                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2 no-scrollbar">
                    
                    {/* Step 1: Upload Hall Ticket */}
                    <Card className="border-primary/20 bg-card/50 backdrop-blur-xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="size-5 text-primary" />
                                Hall Ticket Analysis
                            </CardTitle>
                            <CardDescription>
                                Upload your exam hall ticket to automatically detect the venue and optimize your route.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!isDetected ? (
                                <div 
                                    className={cn(
                                        "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer hover:bg-primary/5 hover:border-primary/40",
                                        isProcessing ? "opacity-50 pointer-events-none" : "border-muted"
                                    )}
                                    onClick={handleFileUpload}
                                >
                                    <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        {isProcessing ? (
                                            <Zap className="size-6 text-primary animate-spin" />
                                        ) : (
                                            <Upload className="size-6 text-primary" />
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">
                                            {isProcessing ? "Scanning Document..." : "Click or drag to upload"}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG (Max 5MB)</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-3">
                                        <CheckCircle2 className="size-5 text-green-500" />
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Venue Detected Successfully</span>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="size-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-bold text-sm">{examInfo.name}</p>
                                                <p className="text-xs text-muted-foreground">{examInfo.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Reporting</span>
                                                <span className="text-sm font-semibold">{examInfo.reportingTime}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Exam Starts</span>
                                                <span className="text-sm font-semibold">{examInfo.examStart}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Step 2: Route & Timing (Visible only when detected) */}
                    <AnimatePresence>
                        {isDetected && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <Card className="border-primary/20 bg-card/50 backdrop-blur-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3">
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1">
                                            <Zap className="size-3 fill-current" />
                                            Optimal Route
                                        </Badge>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <RouteIcon className="size-5 text-primary" />
                                            Smart Departure
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-3xl font-bold tracking-tight">07:40 <span className="text-lg font-medium text-muted-foreground">AM</span></p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Timer className="size-3" /> Recommended Departure
                                                </p>
                                            </div>
                                            <div className="h-12 w-px bg-border mx-4" />
                                            <div className="space-y-1 text-right">
                                                <p className="text-3xl font-bold tracking-tight">08:25 <span className="text-lg font-medium text-muted-foreground">AM</span></p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                                    <Clock className="size-3" /> Estimated Arrival
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                                                <p className="text-xl font-bold">12.4 <span className="text-xs font-normal text-muted-foreground">km</span></p>
                                                <p className="text-[10px] uppercase text-muted-foreground font-bold mt-1">Distance</p>
                                            </div>
                                            <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                                                <p className="text-xl font-bold">45 <span className="text-xs font-normal text-muted-foreground">min</span></p>
                                                <p className="text-[10px] uppercase text-muted-foreground font-bold mt-1">Est. Time</p>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                                            <div className="bg-amber-500 rounded-full p-1 mt-0.5">
                                                <AlertTriangle className="size-3 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Heavy Traffic Alert</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">Expect 10-15 mins delay near Powai Flyover. Leaving by 7:40 AM ensures 5 mins buffer.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* AI Hints */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">AI Assistant Hints</p>
                                    <div className="space-y-2">
                                        {[
                                            "Route includes 2 tolls. Ensure FASTag has balance.",
                                            "Weather forecast: Light rain expected during commute.",
                                            "Carry a physical copy of the Hall Ticket extracted."
                                        ].map((hint, i) => (
                                            <motion.div 
                                                key={i}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 * i }}
                                                className="group p-3 bg-card border hover:border-primary/40 transition-all rounded-xl flex items-center gap-3 cursor-help"
                                            >
                                                <div className="size-8 bg-primary/5 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                    <Info className="size-4 text-primary" />
                                                </div>
                                                <p className="text-xs font-medium">{hint}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Map Display */}
                <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-border/50 bg-muted/30 relative group shadow-2xl">
                    <div className="absolute inset-0 z-0">
                        <MapContainer 
                            center={[19.0760, 72.8777]} 
                            zoom={12} 
                            scrollWheelZoom={true} 
                            className="h-full w-full grayscale-[0.5] invert-[0.05]"
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                            
                            {isDetected && (
                                <>
                                    <Marker position={userLoc!} icon={userIcon}>
                                        <Popup className="custom-popup">You are here</Popup>
                                    </Marker>
                                    <Marker position={examLoc!} icon={examIcon}>
                                        <Popup className="custom-popup">{examInfo.name}</Popup>
                                    </Marker>
                                    <AnimatedRoute positions={routePositions} />
                                    <MapController positions={[userLoc!, examLoc!]} />
                                </>
                            )}
                        </MapContainer>
                    </div>

                    {/* Map Overlays */}
                    {!isDetected && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-sm">
                            <div className="text-center space-y-4 max-w-sm px-6">
                                <div className="size-16 bg-card border rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                                    <MapIcon className="size-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Interactive Exam Map</h3>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Upload your hall ticket or manually enter locations to unlock smart route tracking.
                                    </p>
                                </div>
                                <Button onClick={handleFileUpload} className="gap-2 shadow-lg shadow-primary/20">
                                    <Upload className="size-4" />
                                    Simulate Detection
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Floating Map Controls */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                        <button className="size-10 bg-card/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center shadow-lg hover:bg-card transition-colors">
                            <Car className="size-5 text-primary" />
                        </button>
                        <button className="size-10 bg-card/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center shadow-lg hover:bg-card transition-colors">
                            <Navigation className="size-5" />
                        </button>
                    </div>

                    {/* Legend */}
                    {isDetected && (
                        <div className="absolute bottom-6 left-6 z-10 p-3 bg-card/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="size-3 bg-blue-500 rounded-full" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Current Location</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-3 bg-orange-500 rounded-full" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Exam Venue</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .leaflet-container {
                    background: transparent !important;
                }
                .leaflet-bar {
                    border: none !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                }
                .leaflet-control-zoom-in, .leaflet-control-zoom-out {
                    background: #fff !important;
                    color: #000 !important;
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    background: rgba(30, 30, 30, 0.9);
                    backdrop-filter: blur(8px);
                    color: white;
                    border-radius: 12px;
                    padding: 4px;
                }
                .custom-popup .leaflet-popup-tip {
                    background: rgba(30, 30, 30, 0.9);
                }
                .route-line-main {
                    filter: drop-shadow(0 0 8px rgba(232, 133, 42, 0.6));
                }
            ` }} />
        </div>
    );
}
