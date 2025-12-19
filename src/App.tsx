import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import MatrimonyScreen from './pages/MatrimonyScreen';
import YogigramScreen from './pages/YogigramScreen';
import MessagesScreen from './pages/MessagesScreen';
import TrustScreen from './pages/TrustScreen';
import SubscriptionScreen from './pages/SubscriptionScreen';
import AIAssistantScreen from './pages/AIAssistantScreen';
import ProfileScreen from './pages/ProfileScreen';
import SettingsScreen from './pages/SettingsScreen';
import NotificationsScreen from './pages/NotificationsScreen';
import AboutScreen from './pages/AboutScreen';
import FamilyRegistrationScreen from './pages/FamilyRegistrationScreen';
import FamilyListScreen from './pages/FamilyListScreen';
import FamilyDetailScreen from './pages/FamilyDetailScreen';
// Education Module Screens
import EducationHubScreen from './pages/EducationHubScreen';
import StudentProfileScreen from './pages/StudentProfileScreen';
import ScholarshipScreen from './pages/ScholarshipScreen';
import AchieversScreen from './pages/AchieversScreen';
import DailyGuidanceScreen from './pages/DailyGuidanceScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Splash & Auth */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        {/* Main App Screens */}
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/matrimony" element={<MatrimonyScreen />} />
        <Route path="/yogigram" element={<YogigramScreen />} />
        <Route path="/messages" element={<MessagesScreen />} />
        <Route path="/trust" element={<TrustScreen />} />
        <Route path="/subscription" element={<SubscriptionScreen />} />
        <Route path="/ai-assistant" element={<AIAssistantScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        
        {/* Family Registration */}
        <Route path="/family-register" element={<FamilyRegistrationScreen />} />
        <Route path="/family-list" element={<FamilyListScreen />} />
        <Route path="/family/:id" element={<FamilyDetailScreen />} />

        {/* Education Module */}
        <Route path="/education" element={<EducationHubScreen />} />
        <Route path="/education/students" element={<StudentProfileScreen />} />
        <Route path="/education/scholarships" element={<ScholarshipScreen />} />
        <Route path="/education/achievers" element={<AchieversScreen />} />
        <Route path="/education/daily-guidance" element={<DailyGuidanceScreen />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
