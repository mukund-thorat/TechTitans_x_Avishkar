import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import LoginPage from '@/pages/auth/Login'
import SignupPage from '@/pages/auth/Signup'
import OAuthCallbackPage from '@/pages/auth/OAuthCallback'
import './App.css'
import SignupOtpPage from "@/pages/auth/SignupOtp.tsx";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword.tsx";
import ForgotPasswordOtpPage from "@/pages/auth/ForgotPasswordOtp.tsx";
import ResetPasswordPage from "@/pages/auth/ResetPassword.tsx";
import PickAvatarPage from "@/pages/auth/PickAvatar.tsx";
import DashboardPage from "@/pages/Dashboard.tsx";
import NoteEditor from "@/pages/NoteEditor.tsx";
import LandingPage from "@/pages/LandingPage.tsx";
import SplashScreen from "@/components/common/SplashScreen.tsx";
import { useState } from "react";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className={showSplash ? 'hidden' : 'block'}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/otp" element={<SignupOtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/forgot-password/otp" element={<ForgotPasswordOtpPage />} />
            <Route path="/forgot-password/reset" element={<ResetPasswordPage />} />
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
            <Route path="/pick_avatar" element={<PickAvatarPage />} />
          {/* Placeholder for dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/notes/:noteId" element={<NoteEditor />} />
          
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
      <Toaster position="top-center" richColors />
    </> 
  )
}

export default App
