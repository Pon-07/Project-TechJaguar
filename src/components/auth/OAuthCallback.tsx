import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function OAuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the session from the URL hash (Supabase OAuth uses hash fragments)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setStatus('error');
          return;
        }

        if (session?.user) {
          // Get role from URL params or localStorage
          const urlParams = new URLSearchParams(window.location.search);
          const role = urlParams.get('role') || localStorage.getItem('pending-role') || 'farmer';
          
          // Update user metadata with role if not set
          if (!session.user.user_metadata?.role) {
            const { error: updateError } = await supabase.auth.updateUser({
              data: {
                ...session.user.user_metadata,
                role: role,
                name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                profileImage: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || ''
              }
            });

            if (updateError) {
              console.warn('Failed to update user metadata:', updateError);
            } else {
              localStorage.removeItem('pending-role');
            }
          }

          // Store user in localStorage for fallback
          const transformedUser = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone || '',
            role: session.user.user_metadata?.role || role,
            profileImage: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
            state: session.user.user_metadata?.state || '',
            district: session.user.user_metadata?.district || '',
            village: session.user.user_metadata?.village || '',
            verified: session.user.email_confirmed_at ? true : false,
            joinDate: session.user.created_at || new Date().toISOString(),
            uzhavarPin: session.user.user_metadata?.uzhavarPin || `UZP-${session.user.id.slice(-6)}`
          };

          localStorage.setItem('greenledger-user', JSON.stringify(transformedUser));
          localStorage.setItem('greenledger-session', JSON.stringify({
            userId: transformedUser.id,
            email: transformedUser.email,
            createdAt: new Date().toISOString(),
            user: transformedUser
          }));

          setStatus('success');
          
          // Clear URL hash and redirect to dashboard
          window.history.replaceState({}, document.title, '/');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          setError('No session found. Please try signing in again.');
          setStatus('error');
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setError(error.message || 'An error occurred during authentication.');
        setStatus('error');
      }
    };

    handleOAuthCallback();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing Sign In...</h2>
            <p className="text-gray-600">Please wait while we complete your authentication.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error || 'An error occurred during authentication.'}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Go to Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Sign In Successful!</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </CardContent>
      </Card>
    </div>
  );
}

