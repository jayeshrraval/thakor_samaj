import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';

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

// --- 6. Premium & AI ---
import SubscriptionScreen from './screens/SubscriptionScreen';
import AIAssistantScreen from './screens/AIAssistantScreen';

// --- 7. Settings & Profile ---
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutScreen from './screens/AboutScreen'; 

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. એપ ચાલુ થાય ત્યારે સેશન ચેક કરો
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. લોગીન/લોગઆઉટ થાય ત્યારે લિસન કરો
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // જો હજુ ચેક થતું હોય તો લોડર બતાવો
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-deep-blue animate-spin mb-4" />
          <p className="font-gujarati text-gray-500">લોડ થઈ રહ્યું છે...</p>
        </div>
      </div>
    );
  }

  // --- Protected Route Wrapper ---
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    // Future flags ઉમેર્યા છે જેથી v7 ની વોર્નિંગ્સ દૂર થાય
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

        {/* --- Social & Trust --- */}
        <Route path="/trust" element={<ProtectedRoute><TrustScreen /></ProtectedRoute>} />

        {/* --- Premium & AI --- */}
        <Route path="/subscription" element={<ProtectedRoute><SubscriptionScreen /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantScreen /></ProtectedRoute>} />

        {/* --- Profile & Settings --- */}
        <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutScreen /></ProtectedRoute>} />

        {/* --- 404 Not Found (Redirect to Home) --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}