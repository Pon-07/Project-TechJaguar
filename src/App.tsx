import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { SplashScreen } from "./components/SplashScreen";
import { Navigation } from "./components/Navigation";
import { FarmerModule } from "./components/FarmerModule";
import { WarehouseModule } from "./components/WarehouseModule";
import { ConsumerModuleWithLiveTracking } from "./components/ConsumerModuleWithLiveTracking";
import { UzhavanSanthaiHub } from "./components/UzhavanSanthaiHub";
import { LoginFlow } from "./components/LoginFlow";
import { EmailLogin } from "./components/auth/EmailLogin";
import { AadhaarLogin } from "./components/auth/AadhaarLogin";
import { PhoneLogin } from "./components/auth/PhoneLogin";
import { LoginMethodSelector } from "./components/auth/LoginMethodSelector";
import { SignUpFlow } from "./components/auth/SignUpFlow";
import { GmailLogin } from "./components/auth/GmailLogin";
import { OAuthCallback } from "./components/auth/OAuthCallback";
import { ProfileManagement } from "./components/ProfileManagement";
import { AdminPanel } from "./components/admin/AdminPanel";
import { Toaster } from "./components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { threeJSSingleton } from "./contexts/ThreeJSSingleton";
import { NotificationDisplay } from "./components/NotificationSystem";
import { ProductMovementNotifications } from "./components/ProductMovementNotifications";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { User } from "./types/user";
import { VIRAChat } from "./components/chat/VIRAChat";

type ViewMode = "farmer" | "warehouse" | "consumer" | "uzhavan" | "profile" | "admin";

function AppContent() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [loginMode, setLoginMode] = useState<'method' | 'aadhaar' | 'phone' | 'email' | 'signup' | 'gmail' | 'gmail-signup' | 'oauth-callback' | null>('method');
  const [activeModule, setActiveModule] = useState<ViewMode>("farmer");
  const [error, setError] = useState<string | null>(null);

  // Debug: Log user state changes
  useEffect(() => {
    console.log('🔍 AppContent - User state changed:', { 
      hasUser: !!user, 
      user: user ? { id: user.id, name: user.name, email: user.email } : null,
      authLoading,
      loginMode 
    });
  }, [user, authLoading, loginMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Check for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    // Check if this is an OAuth callback
    if (window.location.pathname === '/auth/callback' || 
        hashParams.has('access_token') || 
        urlParams.has('code')) {
      // OAuth callback - let OAuthCallback component handle it
      setLoginMode('oauth-callback');
      return;
    }
  }, []);

  // Set login mode based on user state
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        // User is logged in, clear login mode to show dashboard
        setLoginMode(null);
      } else if (!loginMode || loginMode === 'oauth-callback') {
        // No user and no login mode set, show method selector by default
        // But don't override oauth-callback
        if (loginMode !== 'oauth-callback') {
          setLoginMode('method');
        }
      }
    }
  }, [user, authLoading]);

  const handleLoginSuccess = useCallback(() => {
    console.log('✅ handleLoginSuccess called');
    setLoginMode(null);
    setActiveModule("farmer");
    setError(null);
    // Note: The user state should already be set by AuthContext
    // If user is set, the app will automatically show the dashboard
    // due to the conditional rendering below
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut();
    setActiveModule("farmer");
    setLoginMode('method');
  }, [signOut]);

  // Initialize Three.js singleton early with error handling
  useEffect(() => {
    const initializeThreeJS = async () => {
      try {
        // Check if threeJSSingleton exists and is valid
        if (!threeJSSingleton) {
          console.warn('⚠️ ThreeJSSingleton instance is null or undefined');
          return;
        }
        
        // Verify singleton instance and methods
        console.log('🔍 Checking ThreeJSSingleton instance type:', typeof threeJSSingleton);
        
        // Check if methods exist before calling them
        if (typeof threeJSSingleton.getIsLoaded !== 'function') {
          console.error('❌ getIsLoaded method not found on threeJSSingleton');
          console.error('Available properties:', Object.getOwnPropertyNames(threeJSSingleton));
          console.error('Available prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(threeJSSingleton)));
          return;
        }
        
        if (typeof threeJSSingleton.getIsLoading !== 'function') {
          console.error('❌ getIsLoading method not found on threeJSSingleton');
          return;
        }
        
        if (typeof threeJSSingleton.loadLibraries !== 'function') {
          console.error('❌ loadLibraries method not found on threeJSSingleton');
          return;
        }
        
        // Only initialize if not already loaded to prevent multiple instances
        const isLoaded = threeJSSingleton.getIsLoaded();
        const isLoading = threeJSSingleton.getIsLoading();
        
        console.log('📊 ThreeJSSingleton status - isLoaded:', isLoaded, 'isLoading:', isLoading);
        
        if (!isLoaded && !isLoading) {
          console.log('🚀 Starting Three.js libraries loading...');
          await threeJSSingleton.loadLibraries();
          console.log('✅ Three.js singleton initialized successfully - No duplicate instances');
        } else {
          console.log('📋 Three.js singleton already initialized, skipping...');
        }
      } catch (error) {
        console.warn('⚠️ Three.js singleton initialization failed:', error);
        console.warn('⚠️ This is expected in production - 3D features will use fallbacks');
        // Continue without 3D features - app will use fallbacks
      }
    };

    // Add a small delay to ensure all modules are loaded
    setTimeout(initializeThreeJS, 100);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login forms if no user is logged in
  if (!user) {
    return (
      <div className="min-h-screen">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 mx-4 mt-4">
            {error}
          </div>
        )}
        
        {loginMode === 'method' && (
          <LoginMethodSelector
            onSelectGmail={() => setLoginMode('gmail')}
            onSelectAadhaar={() => setLoginMode('aadhaar')}
            onSelectPhone={() => setLoginMode('phone')}
            onSelectSignUp={() => setLoginMode('gmail-signup')}
            onCancel={() => setLoginMode(null)}
          />
        )}
        
        {loginMode === 'gmail' && (
          <GmailLogin
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setLoginMode('method')}
            isSignUp={false}
          />
        )}
        
        {loginMode === 'gmail-signup' && (
          <GmailLogin
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setLoginMode('method')}
            isSignUp={true}
          />
        )}
        
        {loginMode === 'oauth-callback' && (
          <OAuthCallback />
        )}
        
        {loginMode === 'aadhaar' && (
          <AadhaarLogin
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setLoginMode('method')}
            onSwitchToPhone={() => setLoginMode('phone')}
          />
        )}
        
        {loginMode === 'phone' && (
          <PhoneLogin
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setLoginMode('method')}
            onSwitchToAadhaar={() => setLoginMode('aadhaar')}
          />
        )}
        
        {loginMode === 'signup' && (
          <SignUpFlow
            onSignUpSuccess={handleLoginSuccess}
            onCancel={() => setLoginMode('method')}
          />
        )}
        
        {loginMode === 'email' && (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <EmailLogin
              onLoginSuccess={handleLoginSuccess}
              onSignupClick={() => setLoginMode('signup')}
              onCancel={() => setLoginMode('method')}
            />
          </div>
        )}
        
        <Toaster />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 mx-4 mt-4">
            {error}
          </div>
        )}
        
        <Navigation
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          user={user}
          onLogout={handleLogout}
        />

        <main className="pt-16">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeModule === "farmer" && user && (
              <FarmerModule user={user} setUser={(updatedUser) => {
                // Update user in AuthContext if needed
                // This allows FarmerModule to update user data
              }} />
            )}
            {activeModule === "warehouse" && <WarehouseModule />}
            {activeModule === "consumer" && <ConsumerModuleWithLiveTracking />}
            {activeModule === "uzhavan" && <UzhavanSanthaiHub />}
            {activeModule === "profile" && <ProfileManagement />}
            {activeModule === "admin" && <AdminPanel />}
          </motion.div>
        </main>

        <Toaster />
        <NotificationDisplay />
        <ProductMovementNotifications />
        {/* Global VIRA Chatbot - visible on all routes when logged in */}
        {user && (
          <VIRAChat
            user={user}
            role={
              activeModule === 'farmer' ? 'farmer' :
              activeModule === 'warehouse' ? 'warehouse' :
              activeModule === 'consumer' ? 'consumer' :
              activeModule === 'admin' ? 'admin' :
              // For uzhavan, profile, or other modules, default to farmer or use user role
              (user.role === 'farmer' || user.role === 'consumer' || user.role === 'warehouse' || user.role === 'admin')
                ? (user.role as 'farmer' | 'consumer' | 'warehouse' | 'admin')
                : 'farmer'
            }
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;