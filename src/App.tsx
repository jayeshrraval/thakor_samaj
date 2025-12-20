import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// --- તારી નવી પ્રીમિયમ સ્પલેશ સ્ક્રીન ---
import SplashScreen from './screens/SplashScreen';

// --- 1. Auth & Main ---
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from './screens/HomeScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

// --- 2. Family Module ---
import FamilyListScreen from './screens/FamilyListScreen';
import FamilyDetailScreen from './screens/FamilyDetailScreen';
import FamilyRegistrationScreen from './screens/FamilyRegistrationScreen';

// --- 3. Matrimony & Chat ---
import MatrimonyScreen from './screens/MatrimonyScreen';
import RequestsScreen from './screens/RequestsScreen'; 
import PrivateChatScreen from './screens/PrivateChatScreen';
import GeneralChatScreen from './screens/GeneralChatScreen';

// --- 4. Education Hub ---
import EducationHubScreen from './screens/EducationHubScreen';
import StudentProfileScreen from './screens/StudentProfileScreen';
import ScholarshipScreen from './screens/ScholarshipScreen';
import AchieversScreen from './screens/AchieversScreen';
import DailyGuidanceScreen from './screens/DailyGuidanceScreen';

// --- 5. Social & Trust ---
import TrustScreen from './screens/TrustScreen';

// --- 6. Emergency Aid (નવું ઉમેર્યું) ---
import AccidentalAidScreen from './screens/AccidentalAidScreen';

// --- 7. Premium & AI ---
import SubscriptionScreen from './screens/SubscriptionScreen';
import AIAssistantScreen from './screens/AIAssistantScreen';

// --- 8. Settings & Profile ---
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutScreen from './screens/AboutScreen'; 

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 1. એપ શરૂ થાય ત્યારે સેશન ચેક કરો
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. લોગીન/લોગઆઉટ સ્ટેટ મેન્ટેન કરો
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. ફરજિયાત ૩ સેકન્ડનો સ્પલેશ ટાઈમર
    const timer = setTimeout(() => {
      setShowSplash(false);
      setLoading(false);
    }, 3000); 

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // --- જ્યારે એપ લોડ થાય અથવા ૩ સેકન્ડ પૂરી ન થઈ હોય ત્યારે તારી સ્ક્રીન બતાવો ---
  if (showSplash || loading) {
    return <SplashScreen />;
  }

  // --- Protected Route Wrapper ---
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

        {/* --- Main Routes (Protected) --- */}
        <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />

        {/* --- Family Module --- */}
        <Route path="/family" element={<ProtectedRoute><FamilyListScreen /></ProtectedRoute>} />
        <Route path="/family-detail/:id" element={<ProtectedRoute><FamilyDetailScreen /></ProtectedRoute>} />
        <Route path="/family-register" element={<ProtectedRoute><FamilyRegistrationScreen /></ProtectedRoute>} />

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

        {/* --- Social, Trust & Aid --- */}
        <Route path="/trust" element={<ProtectedRoute><TrustScreen /></ProtectedRoute>} />
        <Route path="/accidental-aid" element={<ProtectedRoute><AccidentalAidScreen /></ProtectedRoute>} />

        {/* --- Premium & AI --- */}
        <Route path="/subscription" element={<ProtectedRoute><SubscriptionScreen /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantScreen /></ProtectedRoute>} />

        {/* --- Profile & Settings --- */}
        <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutScreen /></ProtectedRoute>} />

        {/* --- 404 Not Found --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}