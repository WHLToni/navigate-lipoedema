import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Home from './pages/Home';
import BodyMap from './pages/BodyMap';
import Habits from './pages/Habits';
import Medication from './pages/Medication';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Trends from './pages/Trends';
import WelcomeScreen from './components/WelcomeScreen';

const WELCOME_KEY = "nl_welcome_seen";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeChecked, setWelcomeChecked] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_KEY);
    if (!seen) setShowWelcome(true);
    setWelcomeChecked(true);
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem(WELCOME_KEY, "true");
    setShowWelcome(false);
  };

  if (isLoadingPublicSettings || isLoadingAuth || !welcomeChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/welcome" element={<WelcomeScreen onGetStarted={handleGetStarted} />} />
      {showWelcome && <Route path="*" element={<WelcomeScreen onGetStarted={handleGetStarted} />} />}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/body-map" element={<BodyMap />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/medication" element={<Medication />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/trends" element={<Trends />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;