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
  const [showSplash, setShowSplash] = useState(true); // સ્પલેશ કંટ્રોલ કરવા માટે

  useEffect(() => {
    // 1. Supabase સેશન ચેક કરો
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 2. ફરજિયાત ૩ સેકન્ડનો સ્પલેશ ટાઈમર
    const timer = setTimeout(() => {
      setShowSplash(false);
      setLoading(false);
    }, 3000); 

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // --- Splash Screen UI ---
  if (showSplash || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          {/* એપ લોગો (YS) */}
          <div className="w-24 h-24 bg-deep-blue rounded-3xl flex items-center justify-center mb-6 shadow-xl animate-bounce">
            <span className="text-white text-4xl font-bold">YS</span>
          </div>
          
          <h1 className="text-3xl font-bold text-deep-blue font-gujarati mb-2">
            યોગી સમાજ
          </h1>
          <p className="text-gray-400 font-gujarati tracking-widest uppercase text-sm">
            Connecting Community
          </p>
          
          <div className="mt-12 flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-deep-blue animate-spin mb-2" />
            <p className="text-deep-blue font-gujarati text-sm">લોડ થઈ રહ્યું છે...</p>
          </div>
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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route 
          path="/" 
          element={!session ? <LoginScreen /> : <Navigate to="/home" replace />} 
        />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

        <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />

        <Route path="/family" element={<ProtectedRoute><FamilyListScreen /></ProtectedRoute>} />
        <Route path="/family-detail/:id" element={<ProtectedRoute><FamilyDetailScreen /></ProtectedRoute>} />
        <Route path="/family-register" element={<ProtectedRoute><FamilyRegistrationScreen /></ProtectedRoute>} />

        <Route path="/matrimony" element={<ProtectedRoute><MatrimonyScreen /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><RequestsScreen /></ProtectedRoute>} />
        <Route path="/private-chat/:roomId" element={<ProtectedRoute><PrivateChatScreen /></ProtectedRoute>} />
        <Route path="/general-chat" element={<ProtectedRoute><GeneralChatScreen /></ProtectedRoute>} />

        <Route path="/education" element={<ProtectedRoute><EducationHubScreen /></ProtectedRoute>} />
        <Route path="/student-profile" element={<ProtectedRoute><StudentProfileScreen /></ProtectedRoute>} />
        <Route path="/scholarship" element={<ProtectedRoute><ScholarshipScreen /></ProtectedRoute>} />
        <Route path="/achievers" element={<ProtectedRoute><AchieversScreen /></ProtectedRoute>} />
        <Route path="/daily-guidance" element={<ProtectedRoute><DailyGuidanceScreen /></ProtectedRoute>} />

        <Route path="/trust" element={<ProtectedRoute><TrustScreen /></ProtectedRoute>} />

        <Route path="/subscription" element={<ProtectedRoute><SubscriptionScreen /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantScreen /></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutScreen /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}