import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, ArrowLeft, Loader2, AlertCircle, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User as UserType } from '../../types/user';

interface GmailLoginProps {
  onLoginSuccess?: () => void;
  onCancel?: () => void;
  isSignUp?: boolean;
}

export function GmailLogin({ onLoginSuccess, onCancel, isSignUp = false }: GmailLoginProps) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'farmer' | 'consumer' | 'warehouse' | 'admin'>('farmer');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrors({});

    try {
      // Store role in localStorage for OAuth callback
      if (isSignUp && role) {
        localStorage.setItem('pending-role', role);
      }

      const { error } = await signInWithGoogle(isSignUp ? role : undefined);
      
      if (error) {
        localStorage.removeItem('pending-role');
        setErrors({ general: error.message || 'Failed to sign in with Google. Please try again.' });
        toast.error(error.message || 'Google sign-in failed');
        setLoading(false);
      } else {
        // OAuth redirect will happen, user will be redirected back
        toast.success('Redirecting to Google...');
        // Don't set loading to false as we're redirecting
      }
    } catch (error: any) {
      localStorage.removeItem('pending-role');
      console.error('Google sign-in exception:', error);
      setErrors({ general: error.message || 'An unexpected error occurred' });
      toast.error('Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              {isSignUp ? 'Sign Up with Gmail' : 'Login with Gmail'}
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {isSignUp 
                ? 'Create your account using your Gmail account' 
                : 'Continue with your Gmail account'}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSignUp && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Select Your Role</Label>
                  <Select value={role} onValueChange={(value: any) => setRole(value)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">👨‍🌾 Farmer</SelectItem>
                      <SelectItem value="consumer">🛒 Consumer</SelectItem>
                      <SelectItem value="warehouse">🏭 Warehouse</SelectItem>
                      <SelectItem value="admin">👤 Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Choose the role that best describes you. You can update this later.
                  </p>
                </div>
              </div>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white font-semibold shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  {isSignUp ? 'Sign Up with Gmail' : 'Continue with Gmail'}
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>
                {isSignUp 
                  ? 'By signing up, you agree to our Terms of Service and Privacy Policy'
                  : 'We\'ll use your Gmail account to securely sign you in'}
              </p>
            </div>

            <div className="flex gap-2">
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

