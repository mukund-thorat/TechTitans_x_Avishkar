import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  PenTool, 
  GraduationCap, 
  Notebook, 
  Ruler, 
  Pencil, 
  Glasses, 
  FileText 
} from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show for 3.5 seconds (half of the 7s cycle) or full cycle
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 1000); // Wait for fade out
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <style>{`
        :root {
          --brand-dark: #0F2D47;
          --gold-core: #FFD700;
          --gold-hot: #FFF5CC;
          --gold-soft: #F59E0B;
          --bg-cream: #FAF9F6;
          --ease-silk: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
        }

        .premium-bg {
          background: radial-gradient(circle at 50% 50%, #ffffff 0%, #F5F3EF 50%, #E8E5DF 100%);
          background-size: 200% 200%;
          animation: bgShift 20s ease infinite alternate;
        }

        @keyframes bgShift {
          0% { background-position: 50% 50%; }
          100% { background-position: 55% 45%; }
        }

        .letter-s { --sx: -400px; --sy: 150px; opacity: 0; animation: converge 7s var(--ease-expo) infinite; }
        .letter-a { --sx: -250px; --sy: -400px; opacity: 0; animation: converge 7s var(--ease-expo) infinite; }
        .letter-g { --sx: 250px; --sy: -400px; opacity: 0; animation: converge 7s var(--ease-expo) infinite; }
        .letter-e { --sx: 400px; --sy: 150px; opacity: 0; animation: converge 7s var(--ease-expo) infinite; }

        @keyframes converge {
          0%, 25% { transform: translate(var(--sx), var(--sy)) rotate(15deg); opacity: 0; filter: blur(15px); }
          60%, 92% { transform: translate(0, 0) rotate(0deg); opacity: 1; filter: blur(0); }
          100% { transform: translate(0, 0); opacity: 0; }
        }

        .cap-anim-container {
          animation: capFall 7s cubic-bezier(0.5, 0, 0.2, 1) infinite;
          transform-origin: center;
        }

        @keyframes capFall {
          0% { transform: translateY(-700px) rotate(-15deg); opacity: 0; }
          15% { opacity: 1; }
          28%, 92% { transform: translateY(0px) rotate(15deg); opacity: 1; }
          100% { opacity: 0; transform: translateY(0px) rotate(15deg); }
        }

        .bulb-glow-main {
          opacity: 0;
          animation: bulbGlowEffect 7s var(--ease-silk) infinite;
        }

        @keyframes bulbGlowEffect {
          0%, 27% { opacity: 0; transform: scale(0.6); }
          30%, 92% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; }
        }

        .light-rays {
          animation: rayRotate 30s linear infinite;
          transform-origin: 50px 50px;
        }

        @keyframes rayRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .volumetric-halo {
          filter: blur(60px);
          animation: breathe 4s ease-in-out infinite alternate;
        }
        @keyframes breathe {
          from { transform: scale(0.9); opacity: 0.5; }
          to { transform: scale(1.3); opacity: 0.8; }
        }

        .core-flare {
          background: radial-gradient(circle, #ffffff 0%, var(--gold-core) 40%, transparent 100%);
          mix-blend-mode: screen;
        }

        .study-item {
          position: absolute;
          color: var(--brand-dark);
          opacity: 0.08;
          filter: blur(1px);
          pointer-events: none;
          animation: float 15s ease-in-out infinite alternate;
        }

        @keyframes float {
          from { transform: translate(0, 0) rotate(var(--rot)); }
          to { transform: translate(20px, 30px) rotate(calc(var(--rot) + 10deg)); }
        }

        .subtitle-reveal {
          opacity: 0; transform: translateY(10px);
          animation: subReveal 7s var(--ease-expo) infinite;
          animation-delay: 0.3s;
        }

        @keyframes subReveal {
          0%, 60% { opacity: 0; transform: translateY(10px); }
          65%, 92% { opacity: 0.8; transform: translateY(0); }
          100% { opacity: 0; }
        }

        .glow-wave {
          animation: wavePulse 7s var(--ease-silk) infinite;
          transform-origin: 50px 50px;
          opacity: 0;
        }

        @keyframes wavePulse {
          0%, 28% { transform: scale(0.4); opacity: 0; }
          29% { opacity: 0.8; }
          60%, 92% { transform: scale(3.5); opacity: 0; }
          100% { opacity: 0; }
        }

        .noise-layer {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0.03; pointer-events: none; z-index: 50;
        }
      `}</style>

      <div className="premium-bg min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Texture */}
        <svg className="noise-layer" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilterSplash">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilterSplash)" />
        </svg>

        {/* Background Study Materials Scattered */}
        <div className="absolute inset-0 z-0">
          <BookOpen className="study-item w-24 h-24" style={{ top: '10%', left: '8%', '--rot': '-15deg', animationDelay: '0.5s' } as any} />
          <PenTool className="study-item w-16 h-16" style={{ top: '25%', left: '5%', '--rot': '45deg', animationDelay: '1.2s' } as any} />
          
          <GraduationCap className="study-item w-32 h-32" style={{ top: '12%', right: '10%', '--rot': '20deg', animationDelay: '2s' } as any} />
          <Notebook className="study-item w-20 h-20" style={{ top: '30%', right: '15%', '--rot': '-10deg', animationDelay: '0.8s' } as any} />
          
          <Ruler className="study-item w-20 h-20" style={{ bottom: '15%', left: '12%', '--rot': '110deg', animationDelay: '3s' } as any} />
          <Pencil className="study-item w-14 h-14" style={{ bottom: '30%', left: '20%', '--rot': '-30deg', animationDelay: '1.5s' } as any} />
          
          <Glasses className="study-item w-24 h-24" style={{ bottom: '12%', right: '10%', '--rot': '5deg', animationDelay: '4.2s' } as any} />
          <FileText className="study-item w-20 h-20" style={{ bottom: '25%', right: '22%', '--rot': '-15deg', animationDelay: '0.1s' } as any} />
          
          {/* Floating Paper Sheets */}
          <div className="study-item w-24 h-32 bg-slate-400/20 rounded-sm border border-slate-400/10" style={{ top: '45%', left: '5%', '--rot': '12deg' } as any}></div>
          <div className="study-item w-32 h-24 bg-slate-400/20 rounded-sm border border-slate-400/10" style={{ top: '60%', right: '4%', '--rot': '-45deg' } as any}></div>
        </div>

        {/* Animation Core Stage */}
        <div className="relative w-full max-w-5xl flex flex-col items-center justify-center z-10">
          
          {/* Lightbulb & Effects Container */}
          <div className="relative w-80 h-80 flex items-center justify-center mb-16">
            
            {/* RADIANT EFFECTS */}
            <div className="bulb-glow-main volumetric-halo absolute w-72 h-72 rounded-full bg-amber-400/40 z-0"></div>
            <div className="bulb-glow-main volumetric-halo absolute w-96 h-96 rounded-full bg-amber-300/20 z-0" style={{ animationDelay: '-1s' }}></div>
            
            {/* CORE FLARE */}
            <div className="bulb-glow-main core-flare absolute w-48 h-48 rounded-full z-20"></div>

            {/* Expanding Wave SVG */}
            <svg viewBox="0 0 100 100" className="absolute w-full h-full pointer-events-none z-10 overflow-visible">
              <circle cx="50" cy="50" r="20" fill="none" stroke="var(--gold-core)" strokeWidth="0.8" className="glow-wave" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="0.5" className="glow-wave" style={{ animationDelay: '0.15s' }} />
              
              {/* Light Rays (Intensified) */}
              <g className="bulb-glow-main light-rays">
                <line x1="50" y1="50" x2="50" y2="-10" stroke="url(#rayGradSplash)" strokeWidth="1.5" opacity="0.9" />
                <line x1="50" y1="50" x2="110" y2="50" stroke="url(#rayGradSplash)" strokeWidth="1.5" opacity="0.9" transform="rotate(45, 50, 50)" />
                <line x1="50" y1="50" x2="110" y2="50" stroke="url(#rayGradSplash)" strokeWidth="1.5" opacity="0.9" transform="rotate(90, 50, 50)" />
                <line x1="50" y1="50" x2="110" y2="50" stroke="url(#rayGradSplash)" strokeWidth="1.5" opacity="0.9" transform="rotate(135, 50, 50)" />
                <line x1="50" y1="50" x2="50" y2="110" stroke="url(#rayGradSplash)" strokeWidth="1.5" opacity="0.9" transform="rotate(180, 50, 50)" />
                <line x1="50" y1="50" x2="-10" y2="50" stroke="url(#rayGradSplash)" strokeWidth="1.5" opacity="0.9" transform="rotate(225, 50, 50)" />
                <line x1="50" y1="50" x2="-10" y2="50" stroke="url(#rayGradSplash)" strokeWidth="1.5" opacity="0.9" transform="rotate(270, 50, 50)" />
                <line x1="50" y1="50" x2="-10" y2="50" stroke="url(#rayGradSplash)" strokeWidth="1.5" opacity="0.9" transform="rotate(315, 50, 50)" />
              </g>

              <defs>
                <linearGradient id="rayGradSplash" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="30%" stopColor="var(--gold-core)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--gold-soft)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Graduation Cap */}
            <div className="cap-anim-container absolute top-[-40px] z-40 flex justify-center w-full drop-shadow-xl">
              <svg width="140" height="140" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Mortarboard */}
                <path d="M10 50 L60 25 L110 50 L60 75 Z" fill="var(--brand-dark)" />
                <path d="M30 60 V72 C30 72 30 84 60 84 C90 84 90 72 90 72 V60" fill="var(--brand-dark)" />
                {/* Tassel Details */}
                <path d="M110 50 V70" stroke="#C0C0C0" strokeWidth="2" />
                <circle cx="110" cy="72" r="3" fill="var(--gold-core)" />
              </svg>
            </div>

            {/* The Brightened Lightbulb */}
            <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-auto z-30 relative overflow-visible mt-16 drop-shadow-[0_0_50px_rgba(255,215,0,0.6)]">
              {/* Glass Envelope */}
              <path className="stroke-[#0F2D47]/30" d="M50 15C33.4315 15 20 28.4315 20 45C20 57.0652 27.1264 67.4649 37.3881 72.2384C40.6974 73.778 43 77.108 43 80.75V82H57V80.75C57 77.108 59.3026 73.778 62.6119 72.2384C72.8736 67.4649 80 57.0652 80 45C80 28.4315 66.5685 15 50 15Z" strokeWidth="1" strokeLinecap="round" />
              
              {/* Glow Inner (Bright) */}
              <path className="bulb-glow-main fill-amber-300" style={{ mixBlendMode: 'soft-light' }} d="M50 15C33.4315 15 20 28.4315 20 45C20 57.0652 27.1264 67.4649 37.3881 72.2384C40.6974 73.778 43 77.108 43 80.75V82H57V80.75C57 77.108 59.3026 73.778 62.6119 72.2384C72.8736 67.4649 80 57.0652 80 45C80 28.4315 66.5685 15 50 15Z" />

              {/* S Glyph Inside (Golden) */}
              <path className="bulb-glow-main stroke-[#ffffff] blur-[1px]" d="M50 32C44 32 40 36 40 40C40 44 44 46 50 48C56 50 60 52 60 58C60 64 56 68 50 68C44 68 40 64 40 64" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path className="bulb-glow-main" d="M50 32C44 32 40 36 40 40C40 44 44 46 50 48C56 50 60 52 60 58C60 64 56 68 50 68C44 68 40 64 40 64" stroke="var(--brand-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Metallic Base */}
              <g className="opacity-80">
                <path d="M43 88H57" stroke="var(--brand-dark)" strokeWidth="2" strokeLinecap="round" />
                <path d="M45 94H55" stroke="var(--brand-dark)" strokeWidth="2" strokeLinecap="round" />
                <path d="M48 102H52" stroke="var(--brand-dark)" strokeWidth="3" strokeLinecap="round" />
              </g>
            </svg>
          </div>

          {/* Text Identity Stage */}
          <div className="text-center relative">
            <h1 id="sage-brand" className="main-text text-[#0F2D47] text-8xl md:text-9xl font-extrabold tracking-tighter flex items-center justify-center relative select-none font-cabinet">
              <span className="letter-s inline-block px-1">S</span>
              <span className="letter-a inline-block px-1">A</span>
              <span className="letter-g inline-block px-1">G</span>
              <span className="letter-e inline-block px-1">E</span>
            </h1>
            
            <p className="subtitle-reveal text-[#0F2D47]/80 text-[11px] md:text-sm uppercase font-bold tracking-[0.8em] mt-12">
              Smart Adaptive Guidance Engine
            </p>

            {/* Reflection Underneath */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-8 bg-black/5 blur-2xl rounded-full"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
