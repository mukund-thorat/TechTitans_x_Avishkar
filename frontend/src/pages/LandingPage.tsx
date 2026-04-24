import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LibraryBig, 
  Navigation2, 
  Building2, 
  MapPin, 
  CalendarRange, 
  ListTodo, 
  ShieldCheck, 
  FileDigit, 
  Fingerprint, 
  FileText, 
  Share2, 
  Zap, 
  Medal, 
  BrainCircuit, 
  Sparkles, 
  PenLine, 
  Link as LinkIcon, 
  ArrowDown 
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const bookRef = useRef<HTMLDivElement>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const leftContentAreaRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);

  const sidebarData = [
    {
      meta: "The Concept",
      title: "Workspace. <br/><span class='opacity-40'>Refined.</span>",
      desc: "SAGE unifies your academic life into a single, high-performance workspace designed for focus."
    },
    {
      meta: "Module 01: Capture",
      title: "Freedom of <br/><span class='opacity-40'>Thought.</span>",
      desc: "Our node-based logic ensures that every idea you capture is instantly searchable and cross-referenced."
    },
    {
      meta: "Module 02: Intelligence",
      title: "Cognitive <br/><span class='opacity-40'>Augmentation.</span>",
      desc: "SAGE AI analyzes your curriculum to predict likely exam patterns and reveal knowledge gaps."
    },
    {
      meta: "Module 03: Performance",
      title: "Drive to <br/><span class='opacity-40'>Excel.</span>",
      desc: "Gamify your growth with global rankings and activity streaks that turn discipline into a habit."
    },
    {
      meta: "Module 04: Archives",
      title: "Centralized <br/><span class='opacity-40'>Resource.</span>",
      desc: "One home for every PDF, link, and recording. Annotated, summarized, and ready for review."
    },
    {
      meta: "Module 05: Privacy",
      title: "Academic <br/><span class='opacity-40'>Security.</span>",
      desc: "Military-grade encryption for your sensitive documents, transcripts, and credentials."
    },
    {
      meta: "Module 06: Planning",
      title: "Total <br/><span class='opacity-40'>Clarity.</span>",
      desc: "Smart task priority scoring helps you tackle what matters most, exactly when it needs to happen."
    },
    {
      meta: "Module 07: Logistics",
      title: "Seamless <br/><span class='opacity-40'>Arrival.</span>",
      desc: "Navigate the physical world with the same precision as your academic one. Arrive early, arrive ready."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Handle Page Turns
      for (let i = 0; i <= 7; i++) {
        const page = document.getElementById(`page-${i === 0 ? 'cover' : i+1 === 1 ? 'cover' : i+1 === 0 ? 'cover' : i+1}`);
        // Adjusting logic to match the 8 pages in the HTML
        // Cover is page-cover, then page-2, page-3... page-8
      }
      
      const pageIds = ['page-cover', 'page-2', 'page-3', 'page-4', 'page-5', 'page-6', 'page-7', 'page-8'];
      pageIds.forEach((id, index) => {
        const page = document.getElementById(id);
        const triggerPoint = (index + 0.15) * vh;
        if (page) {
          if (scrollY > triggerPoint) page.classList.add('page-turn');
          else page.classList.remove('page-turn');
        }
      });

      // Handle Sidebar Content
      const newActiveIndex = Math.min(Math.floor(scrollY / vh), sidebarData.length - 1);
      if (newActiveIndex !== activeIndex && newActiveIndex >= 0) {
        setActiveIndex(newActiveIndex);
      }

      // Handle Book Transformations
      if (bookRef.current && bookContainerRef.current && finalCtaRef.current && scrollIndicatorRef.current) {
        if (scrollY < vh * 8) {
          const rotY = -28 + (scrollY * 0.002);
          const rotX = 8 - (scrollY * 0.001);
          bookRef.current.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(-1deg)`;
          bookContainerRef.current.style.opacity = '1';
          bookContainerRef.current.style.transform = 'scale(1)';
          finalCtaRef.current.classList.remove('final-cta-active');
          scrollIndicatorRef.current.style.opacity = '1';
        } else if (scrollY >= vh * 8 && scrollY < vh * 9) {
          const closeProgress = (scrollY - (vh * 8)) / vh;
          bookRef.current.style.transform = `rotateY(${-28 + (vh * 8 * 0.002) - (closeProgress * 60)}deg) rotateX(${8 - (vh * 8 * 0.001)}deg)`;
          bookContainerRef.current.style.transform = `scale(${1 - (closeProgress * 0.2)}) translateZ(${-closeProgress * 500}px)`;
          bookContainerRef.current.style.opacity = (1 - closeProgress).toString();
          scrollIndicatorRef.current.style.opacity = (1 - closeProgress).toString();
          finalCtaRef.current.classList.remove('final-cta-active');
        } else {
          bookContainerRef.current.style.opacity = '0';
          finalCtaRef.current.classList.add('final-cta-active');
          scrollIndicatorRef.current.style.opacity = '0';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  return (
    <div className="min-h-[1000vh] relative bg-[#FAF8F4] text-[#1A1917] font-satoshi selection:bg-[#E8852A]/20">
      <style>{`
        :root {
          --ease-premium: cubic-bezier(0.2, 0, 0, 1);
        }
        
        .font-satoshi {
          font-family: 'Satoshi', sans-serif;
        }
        
        .font-cabinet {
          font-family: 'Cabinet Grotesk', sans-serif;
        }

        .book-container {
          perspective: 3000px;
          width: min(90vw, 1100px);
          height: min(70vh, 700px);
          position: relative;
          transition: all 0.8s var(--ease-premium);
        }

        .book {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transform: rotateY(-28deg) rotateX(8deg) rotateZ(-1deg);
          transition: transform 0.6s ease-out;
        }

        .page {
          width: 50%;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          transform-origin: left;
          transform-style: preserve-3d;
          transition: transform 2s var(--ease-premium), box-shadow 2s var(--ease-premium), filter 2s var(--ease-premium);
          background: transparent;
          border-radius: 2px 16px 16px 2px;
          overflow: visible;
        }

        .page-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          padding: 48px;
          display: flex;
          flex-direction: column;
          background: #F2EFE8;
          box-shadow: 
            inset 3px 0 10px rgba(26,25,23,0.02), 
            20px 20px 60px rgba(26,25,23,0.08),
            1px 1px 0px rgba(255,255,255,0.8);
          border: 1px solid rgba(26,25,23,0.05);
        }

        .page-back {
          transform: rotateY(180deg);
          background-color: #F2EFE8;
          border-radius: 16px 2px 2px 16px;
          box-shadow: none;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
        }

        .left-side-static {
          width: 50%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          background: #FAF8F4;
          border-radius: 16px 2px 2px 16px;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: inset -8px 0 20px rgba(26,25,23,0.01);
          border: 1px solid rgba(26,25,23,0.04);
          z-index: 0;
        }

        .page-turn {
          transform: rotateY(-179.9deg) rotateZ(-0.3deg) scale(1.002);
          z-index: 10 !important;
          box-shadow: -20px 20px 50px rgba(26,25,23,0.05);
        }

        .page-face::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: opacity 1.8s var(--ease-premium);
          opacity: 0;
          z-index: 50;
        }

        .page-turn .page-face:not(.page-back)::after {
          background: linear-gradient(to right, rgba(26,25,23,0.04) 0%, transparent 15%);
          opacity: 1;
        }

        .page-turn .page-back::after {
          background: linear-gradient(to left, rgba(26,25,23,0.02) 0%, transparent 15%);
          opacity: 1;
        }

        .page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 30px;
          height: 100%;
          background: linear-gradient(to right, rgba(26,25,23,0.02), transparent);
          z-index: 60;
          pointer-events: none;
        }

        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 100;
        }

        .feature-visual-card {
          background: #FAF8F4;
          border: 1px solid rgba(26,25,23,0.06);
          border-radius: 20px;
          box-shadow: 0 10px 25px -5px rgba(26,25,23,0.02);
          overflow: hidden;
          transition: transform 0.6s var(--ease-premium);
        }

        .final-cta-overlay {
          position: fixed;
          inset: 0;
          background: #FAF8F4;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 1s var(--ease-premium);
          z-index: 100;
        }

        .final-cta-active {
          opacity: 1;
          pointer-events: auto;
        }

        .benefit-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(26,25,23,0.02);
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6B6860;
        }

        .spine-effect {
          position: absolute;
          left: 50%;
          top: 0;
          width: 32px;
          height: 100%;
          background: linear-gradient(to right, 
            rgba(26,25,23,0.03) 0%, 
            rgba(26,25,23,0.01) 20%, 
            rgba(255,255,255,0.4) 50%, 
            rgba(26,25,23,0.01) 80%, 
            rgba(26,25,23,0.03) 100%);
          transform: translateX(-50%);
          z-index: 30;
          pointer-events: none;
        }

        .back-title-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .back-title {
          position: relative;
          font-size: 2.25rem;
          line-height: 1.1;
          font-weight: 700;
          color: #1A1917;
          font-family: 'Cabinet Grotesk', sans-serif;
        }
        
        .back-title.amber {
          color: #E8852A;
        }

        .back-accent-line {
          width: 48px;
          height: 3px;
          background: #E8852A;
          border-radius: 2px;
        }

        .glow-sphere {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, #E8852A 0%, transparent 70%);
          filter: blur(140px);
          opacity: 0.04;
          z-index: -1;
        }
        
        h1, h2, h3, h4 {
          font-family: 'Cabinet Grotesk', sans-serif;
          letter-spacing: -0.03em;
        }
      `}</style>

      {/* Global Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="glow-sphere top-[-10%] left-[-10%]"></div>
        <div className="glow-sphere bottom-[-10%] right-[-10%]"></div>
        <div className="grain"></div>
      </div>

      {/* Persistent Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[120] py-8 px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#1A1917] rounded-2xl flex items-center justify-center shadow-lg">
            <LibraryBig className="text-[#FAF8F4] w-6 h-6" />
          </div>
          <span className="text-3xl font-bold tracking-tight uppercase text-[#1A1917] font-cabinet">SAGE</span>
        </div>
        <div className="hidden md:flex gap-12 items-center text-sm font-bold uppercase tracking-widest text-[#6B6860]">
          <a href="#" className="hover:text-[#E8852A] transition-colors">The Ecosystem</a>
          <a href="#" className="hover:text-[#E8852A] transition-colors">Academic AI</a>
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-3 rounded-full bg-[#1A1917] text-[#FAF8F4] hover:scale-105 transition-transform"
          >
            Early Access
          </button>
        </div>
      </nav>

      {/* The Central Experience */}
      <div id="experienceContainer" className="fixed inset-0 flex items-center justify-center z-10">
        <div id="bookContainer" ref={bookContainerRef} className="book-container">
          <div id="mainBook" ref={bookRef} className="book">
            <div className="spine-effect"></div>

            {/* Static Left Base */}
            <div className="left-side-static">
              <div 
                ref={leftContentAreaRef} 
                className="transition-all duration-500"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)'
                }}
              >
                <span className="text-[#E8852A] font-bold tracking-widest text-[10px] uppercase mb-4 block">
                  {sidebarData[activeIndex].meta}
                </span>
                <h2 className="text-5xl font-bold text-[#1A1917] mb-8 leading-tight" dangerouslySetInnerHTML={{ __html: sidebarData[activeIndex].title }} />
                <p className="text-[#6B6860] text-xl leading-relaxed max-w-sm font-medium">
                  {sidebarData[activeIndex].desc}
                </p>
              </div>
            </div>

            {/* Page 8: Exam Map */}
            <div className="page z-[1]" id="page-8">
              <div className="page-face">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#6B6860] mb-6 block">Module 07</span>
                <h3 className="text-5xl font-bold text-[#1A1917] mb-2">Exam Map</h3>
                <p className="text-lg text-[#6B6860] mb-10">Arrive composed and on time, every single time.</p>
                <div className="space-y-4 mb-10">
                  <div className="benefit-tag"><Navigation2 className="text-[#E8852A] w-4 h-4" /> Traffic-Aware Routing</div>
                  <div className="benefit-tag"><Building2 className="text-[#E8852A] w-4 h-4" /> Entrance Specific Location</div>
                </div>
                <div className="feature-visual-card p-6 h-full flex flex-col justify-center bg-[#FAF8F4]">
                  <div className="w-full aspect-video bg-[#F2EFE8] rounded-xl shadow-inner border border-black/5 overflow-hidden relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#1A1917] text-[#FAF8F4] px-4 py-2 rounded-full text-xs font-bold">
                      <MapPin className="w-3 h-3" /> YOUR CENTER
                    </div>
                  </div>
                </div>
              </div>
              <div className="page-face page-back">
                <div className="back-title-container">
                  <h4 className="back-title amber">Ready To Dive<br/>Into The App?</h4>
                  <div className="back-accent-line"></div>
                </div>
              </div>
            </div>

            {/* Page 7: Task */}
            <div className="page z-[2]" id="page-7">
              <div className="page-face">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#6B6860] mb-6 block">Module 06</span>
                <h3 className="text-5xl font-bold text-[#1A1917] mb-2">Smart Tasks</h3>
                <p className="text-lg text-[#6B6860] mb-10">Turn academic goals into daily execution.</p>
                <div className="grid grid-cols-2 gap-3 mb-10">
                  <div className="benefit-tag"><CalendarRange className="w-4 h-4" /> Timeline View</div>
                  <div className="benefit-tag"><ListTodo className="w-4 h-4" /> Priority Scoring</div>
                </div>
                <div className="feature-visual-card p-8 bg-[#FAF8F4]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-[#F2EFE8] p-3 rounded-xl shadow-sm">
                      <div className="w-5 h-5 border-2 border-[#E8852A] rounded-md"></div>
                      <div className="h-2 w-3/4 bg-[#6B6860]/10 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="page-face page-back">
                <div className="back-title-container">
                  <h4 className="back-title">Exam Map</h4>
                  <div className="back-accent-line"></div>
                </div>
              </div>
            </div>

            {/* Page 6: Exam Documents */}
            <div className="page z-[3]" id="page-6">
              <div className="page-face">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#6B6860] mb-6 block">Module 05</span>
                <h3 className="text-5xl font-bold text-[#1A1917] mb-2">Secure Docs</h3>
                <p className="text-lg text-[#6B6860] mb-10">Your entire academic life, encrypted and organized.</p>
                <div className="space-y-4 mb-10">
                  <div className="benefit-tag"><ShieldCheck className="w-4 h-4" /> Encryption</div>
                  <div className="benefit-tag"><FileDigit className="w-4 h-4" /> Digital Wallet</div>
                </div>
                <div className="feature-visual-card p-10 bg-[#FAF8F4] border-dashed border-2 border-[#6B6860]/20 flex flex-col items-center justify-center gap-4">
                  <Fingerprint className="w-12 h-12 text-[#1A1917] opacity-20" />
                  <span className="text-sm font-bold text-[#6B6860]">Vault Enabled</span>
                </div>
              </div>
              <div className="page-face page-back">
                <div className="back-title-container">
                  <h4 className="back-title">Smart Tasks</h4>
                  <div className="back-accent-line"></div>
                </div>
              </div>
            </div>

            {/* Page 5: Study Materials */}
            <div className="page z-[4]" id="page-5">
              <div className="page-face">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#6B6860] mb-6 block">Module 04</span>
                <h3 className="text-5xl font-bold text-[#1A1917] mb-2">Resource Hub</h3>
                <p className="text-lg text-[#6B6860] mb-10">The library that lives where you do.</p>
                <div className="grid grid-cols-2 gap-3 mb-10">
                  <div className="benefit-tag"><FileText className="w-4 h-4" /> Annotation</div>
                  <div className="benefit-tag"><Share2 className="w-4 h-4" /> Peer Exchange</div>
                </div>
                <div className="feature-visual-card overflow-hidden h-40 flex items-center justify-center bg-[#FAF8F4]">
                  <div className="flex -space-x-8">
                    <div className="w-24 h-32 bg-[#F2EFE8] rounded-lg border shadow-xl rotate-[-10deg]"></div>
                    <div className="w-24 h-32 bg-[#F2EFE8] rounded-lg border shadow-xl z-10"></div>
                  </div>
                </div>
              </div>
              <div className="page-face page-back">
                <div className="back-title-container">
                  <h4 className="back-title">Secure Docs</h4>
                  <div className="back-accent-line"></div>
                </div>
              </div>
            </div>

            {/* Page 4: Leaderboard */}
            <div className="page z-[5]" id="page-4">
              <div className="page-face">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#6B6860] mb-6 block">Module 03</span>
                <h3 className="text-5xl font-bold text-[#1A1917] mb-2">Competition</h3>
                <p className="text-lg text-[#6B6860] mb-10">Stay motivated with community-driven progress.</p>
                <div className="space-y-4 mb-10">
                  <div className="benefit-tag"><Zap className="text-[#E8852A] w-4 h-4" /> Activity Streaks</div>
                  <div className="benefit-tag"><Medal className="text-[#E8852A] w-4 h-4" /> Global Rankings</div>
                </div>
                <div className="feature-visual-card p-6 bg-[#FAF8F4]">
                  <div className="flex items-end justify-between h-24 gap-4 px-4">
                    <div className="w-full bg-[#E8852A]/20 h-1/2 rounded-t-lg"></div>
                    <div className="w-full bg-[#E8852A] h-full rounded-t-lg shadow-lg"></div>
                    <div className="w-full bg-[#E8852A]/40 h-3/4 rounded-t-lg"></div>
                  </div>
                </div>
              </div>
              <div className="page-face page-back">
                <div className="back-title-container">
                  <h4 className="back-title">Resource Hub</h4>
                  <div className="back-accent-line"></div>
                </div>
              </div>
            </div>

            {/* Page 3: Exam Assistance */}
            <div className="page z-[6]" id="page-3">
              <div className="page-face">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#6B6860] mb-6 block">Module 02</span>
                <h3 className="text-5xl font-bold text-[#1A1917] mb-2">Exam AI</h3>
                <p className="text-lg text-[#6B6860] mb-10">The tutor that knows everything you don't.</p>
                <div className="grid grid-cols-2 gap-3 mb-10">
                  <div className="benefit-tag"><BrainCircuit className="w-4 h-4" /> Analysis</div>
                  <div className="benefit-tag"><Sparkles className="w-4 h-4" /> Weak Point ID</div>
                </div>
                <div className="feature-visual-card p-6 bg-[#1A1917] text-[#FAF8F4]">
                  <p className="text-sm italic opacity-80">"Explain Quantum Entanglement simply..."</p>
                  <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E8852A] w-2/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="page-face page-back">
                <div className="back-title-container">
                  <h4 className="back-title">Competition</h4>
                  <div className="back-accent-line"></div>
                </div>
              </div>
            </div>

            {/* Page 2: Notes */}
            <div className="page z-[7]" id="page-2">
              <div className="page-face">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#6B6860] mb-6 block">Module 01</span>
                <h3 className="text-5xl font-bold text-[#1A1917] mb-2">Fluid Notes</h3>
                <p className="text-lg text-[#6B6860] mb-10">Knowledge isn't linear. Your notes shouldn't be either.</p>
                <div className="space-y-4 mb-10">
                  <div className="benefit-tag"><PenLine className="w-4 h-4" /> Handwriting</div>
                  <div className="benefit-tag"><LinkIcon className="w-4 h-4" /> Bidirectional</div>
                </div>
                <div className="feature-visual-card p-8 bg-[#FAF8F4]">
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-[#6B6860]/10 rounded-full"></div>
                    <div className="h-2 w-5/6 bg-[#6B6860]/10 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="page-face page-back">
                <div className="back-title-container">
                  <h4 className="back-title">Exam AI</h4>
                  <div className="back-accent-line"></div>
                </div>
              </div>
            </div>

            {/* Page 1: Hero Cover */}
            <div className="page z-[8]" id="page-cover">
              <div className="page-face justify-between p-16 bg-[#F2EFE8] overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E8852A]/5 rounded-full"></div>
                <div>
                  <span className="px-4 py-1.5 bg-[#1A1917] text-[#FAF8F4] text-[10px] font-black tracking-[0.3em] uppercase rounded-full mb-8 inline-block">Product Manual v.01</span>
                  <h1 className="text-7xl font-bold text-[#1A1917] mb-6 leading-[0.85] tracking-tighter">
                    SAGE<br/><span className="text-[#E8852A]">STUDY</span>
                  </h1>
                  <p className="text-2xl text-[#6B6860] font-medium max-w-sm leading-snug">
                    The evolution of academic workspace design.
                  </p>
                </div>
                <div className="flex items-center gap-5 text-[#6B6860]">
                  <div className="w-12 h-12 flex items-center justify-center border-2 border-[#1A1917]/10 rounded-full animate-bounce">
                    <ArrowDown className="text-xl" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Scroll to interact</span>
                </div>
              </div>
              <div className="page-face page-back">
                <div className="back-title-container">
                  <h4 className="back-title">Fluid Notes</h4>
                  <div className="back-accent-line"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Final CTA Overlay */}
      <div id="finalCta" ref={finalCtaRef} className="final-cta-overlay">
        <div className="text-center max-w-2xl px-8">
          <h2 className="text-7xl md:text-8xl font-bold mb-8 tracking-tighter text-[#1A1917]">Ready To Dive <br/> Into The App?</h2>
          <p className="text-xl md:text-2xl text-[#6B6860] mb-12 leading-relaxed font-medium">
            Join 50,000+ students who are redefining their academic trajectory with the intelligent power of SAGE.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-[#1A1917] text-[#FAF8F4] px-12 py-5 rounded-full text-xl font-bold hover:scale-105 hover:bg-[#E8852A] transition-all duration-300 shadow-2xl"
            >
              Enter SAGE
            </button>
          </div>
        </div>
      </div>

      <div id="scrollIndicator" ref={scrollIndicatorRef} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-3 transition-opacity duration-500">
        <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 text-[#6B6860]">Manual Navigation</span>
        <div className="w-[2px] h-16 bg-gradient-to-b from-transparent via-[#1A1917]/20 to-transparent"></div>
      </div>

      <div className="h-screen"></div> 
      <div className="h-screen"></div> 
      <div className="h-screen"></div> 
      <div className="h-screen"></div> 
      <div className="h-screen"></div> 
      <div className="h-screen"></div> 
      <div className="h-screen"></div> 
      <div className="h-screen"></div> 
      <div className="h-screen"></div> 
      <div className="h-screen"></div>
    </div>
  );
};

export default LandingPage;
