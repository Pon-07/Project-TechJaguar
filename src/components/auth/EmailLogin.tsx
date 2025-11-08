import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Mail, 
  Lock, 
  ArrowRight,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface EmailLoginProps {
  onLoginSuccess?: () => void;
  onCancel?: () => void;
  onSwitchToSignUp?: () => void;
  onSignupClick?: () => void;
}

export function EmailLogin({ onLoginSuccess, onCancel, onSwitchToSignUp }: EmailLoginProps) {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { error, data } = await signIn(formData.email, formData.password);

      if (error) {
        setErrors({ general: error.message || 'Invalid email or password' });
        toast.error(error.message || 'Login failed');
        setLoading(false);
      } else {
        toast.success('Login successful! Redirecting to dashboard...');
        // Don't call onLoginSuccess immediately - let the user state update trigger the dashboard
        // The AuthContext has already updated the user state, so App.tsx will automatically
        // detect the user and show the dashboard. We just need to clear login mode.
        // The onLoginSuccess callback will be called but it's mainly to clear loginMode
        // The actual dashboard display is controlled by the user state in App.tsx
        setTimeout(() => {
          onLoginSuccess?.();
        }, 500);
      }
    } catch (error: any) {
      console.error('Login exception:', error);
      setErrors({ general: error.message || 'An unexpected error occurred' });
      toast.error('Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">GL</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            GreenLedger Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Login</h2>
              <p className="text-gray-600">Enter your email and password to continue</p>
            </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, email: e.target.value }));
              setErrors({ ...errors, email: '' });
            }}
            className={errors.email ? 'border-red-500' : ''}
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, password: e.target.value }));
              setErrors({ ...errors, password: '' });
            }}
            className={errors.password ? 'border-red-500' : ''}
            disabled={loading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.general}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {onSwitchToSignUp && (
            <Button
              type="button"
              variant="ghost"
              onClick={onSwitchToSignUp}
              className="w-full"
            >
              Don't have an account? Sign up
            </Button>
          )}

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

