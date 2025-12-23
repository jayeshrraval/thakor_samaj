import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// --- Auth & Main ---
import SplashScreen from './screens/SplashScreen';
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from './screens/HomeScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

// --- Family Module ---
import FamilyListScreen from './screens/FamilyListScreen';
import FamilyDetailScreen from './screens/FamilyDetailScreen';
import FamilyRegistrationScreen from './screens/FamilyRegistrationScreen';

// --- Matrimony & Chat ---
import MatrimonyScreen from './screens/MatrimonyScreen';
import RequestsScreen from './screens/RequestsScreen'; 
import PrivateChatScreen from './screens/PrivateChatScreen';
import GeneralChatScreen from './screens/GeneralChatScreen';

// --- Education Hub ---
import EducationHubScreen from './screens/EducationHubScreen';
import StudentProfileScreen from './screens/StudentProfileScreen';
import ScholarshipScreen from './screens/ScholarshipScreen';
import AchieversScreen from './screens/AchieversScreen';
import DailyGuidanceScreen from './screens/DailyGuidanceScreen';

// --- Social & Trust ---
import TrustScreen from './screens/TrustScreen';
import SamuhLagnaForm from './screens/SamuhLagnaForm'; 

// --- Emergency Aid ---
import AccidentalAidScreen from './screens/AccidentalAidScreen';

// --- Job & Career ---
import JobPostScreen from './screens/JobPostScreen';

// --- Premium & AI ---
import SubscriptionScreen from './screens/SubscriptionScreen';
import AIAssistantScreen from './screens/AIAssistantScreen';
import KrishnaChatScreen from './screens/KrishnaChatScreen';

// --- Settings & Profile ---
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutScreen from './screens/AboutScreen'; 

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // સેશન ચેક કરો
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // ઓથ સ્ટેટ ચેન્જ હેન્ડલર
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // સ્પલેશ સ્ક્રીન ટાઈમર
    const timer = setTimeout(() => {
      setShowSplash(false);
      setLoading(false);
    }, 3000); 

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (showSplash || loading) {
    return <SplashScreen />;
  }

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* --- Authentication --- */}
        <Route 
          path="/" 
          element={!session ? <LoginScreen /> : <Navigate to="/home" replace />} 
        />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

        {/* --- Main Routes --- */}
        <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />

        {/* --- Family Module (FIXED ROUTES) --- */}
        <Route path="/family-list" element={<ProtectedRoute><FamilyListScreen /></ProtectedRoute>} />
        <Route path="/family-details/:id" element={<ProtectedRoute><FamilyDetailScreen /></ProtectedRoute>} />
        <Route path="/family-registration" element={<ProtectedRoute><FamilyRegistrationScreen /></ProtectedRoute>} />

        {/* --- Matrimony & Chat --- */}
        <Route path="/matrimony" element={<ProtectedRoute><MatrimonyScreen /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><RequestsScreen /></ProtectedRoute>} />
        <Route path="/private-chat/:roomId" element={<ProtectedRoute><PrivateChatScreen /></ProtectedRoute>} />
        <Route path="/general-chat" element={<ProtectedRoute><GeneralChatScreen /></ProtectedRoute>} />

        {/* --- Education Module --- */}
        <Route path="/education" element={<ProtectedRoute><EducationHubScreen /></ProtectedRoute>} />
        <Route path="/student-profile" element={<ProtectedRoute><StudentProfileScreen /></ProtectedRoute>} />
        <Route path="/scholarship" element={<ProtectedRoute><ScholarshipScreen /></ProtectedRoute>} />
        <Route path="/achievers" element={<ProtectedRoute><AchieversScreen /></ProtectedRoute>} />
        <Route path="/daily-guidance" element={<ProtectedRoute><DailyGuidanceScreen /></ProtectedRoute>} />

        {/* --- Job & Career --- */}
        <Route path="/jobs" element={<ProtectedRoute><JobPostScreen /></ProtectedRoute>} />

        {/* --- Social & Emergency --- */}
        <Route path="/trust" element={<ProtectedRoute><TrustScreen /></ProtectedRoute>} />
        <Route path="/samuh-lagna-form" element={<ProtectedRoute><SamuhLagnaForm /></ProtectedRoute>} /> 
        <Route path="/accidental-aid" element={<ProtectedRoute><AccidentalAidScreen /></ProtectedRoute>} />

        {/* --- Premium & AI --- */}
        <Route path="/subscription" element={<ProtectedRoute><SubscriptionScreen /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantScreen /></ProtectedRoute>} />
        <Route path="/krishna-chat" element={<ProtectedRoute><KrishnaChatScreen /></ProtectedRoute>} /> 

        {/* --- Profile & Settings --- */}
        <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutScreen /></ProtectedRoute>} />

        {/* --- 404 Catch-all --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}