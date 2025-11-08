import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { 
  Phone, 
  Lock, 
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  LogIn,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface PhoneLoginProps {
  onLoginSuccess?: () => void;
  onCancel?: () => void;
  onSwitchToSignUp?: () => void;
  onSwitchToAadhaar?: () => void;
}

export function PhoneLogin({ onLoginSuccess, onCancel, onSwitchToSignUp, onSwitchToAadhaar }: PhoneLoginProps) {
  const { signInWithPhone } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'phone' | 'otp' | 'password'>('phone');
  const [otpSent, setOtpSent] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    password: ''
  });

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    return cleaned;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (!cleanedPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(cleanedPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Send OTP
      const { error } = await signInWithPhone(cleanedPhone, 'send-otp');
      
      if (error) {
        setErrors({ general: error.message || 'Failed to send OTP' });
        toast.error(error.message || 'Failed to send OTP');
      } else {
        setOtpSent(true);
        setStep('otp');
        toast.success('OTP sent to your phone number');
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'An unexpected error occurred' });
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    if (formData.otp.length !== 6) {
      setErrors({ otp: 'Please enter a 6-digit OTP' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      const { error, data } = await signInWithPhone(cleanedPhone, 'verify-otp', formData.otp);

      if (error) {
        setErrors({ otp: error.message || 'Invalid OTP' });
        toast.error(error.message || 'Invalid OTP');
      } else {
        // Check if user needs to set password (new user)
        if (data?.requiresPassword) {
          setStep('password');
          toast.info('Please set a password for your account');
        } else {
          toast.success('Login successful!');
          setTimeout(() => {
            onLoginSuccess?.();
          }, 500);
        }
      }
    } catch (error: any) {
      setErrors({ otp: error.message || 'OTP verification failed' });
      toast.error('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || formData.password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      const { error } = await signInWithPhone(cleanedPhone, 'set-password', undefined, formData.password);

      if (error) {
        setErrors({ password: error.message || 'Failed to set password' });
        toast.error(error.message || 'Failed to set password');
      } else {
        toast.success('Account created! Login successful!');
        setTimeout(() => {
          onLoginSuccess?.();
        }, 500);
      }
    } catch (error: any) {
      setErrors({ password: error.message || 'An unexpected error occurred' });
      toast.error('Failed to create account');
    } finally {
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
                {step === 'phone' && <Phone className="w-8 h-8 text-white" />}
                {step === 'otp' && <Shield className="w-8 h-8 text-white" />}
                {step === 'password' && <Lock className="w-8 h-8 text-white" />}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {step === 'phone' && 'Phone Login'}
                {step === 'otp' && 'Verify OTP'}
                {step === 'password' && 'Set Password'}
              </h2>
              <p className="text-gray-600">
                {step === 'phone' && 'Enter your phone number to receive OTP'}
                {step === 'otp' && `Enter the 6-digit OTP sent to +91 ${formData.phone}`}
                {step === 'password' && 'Create a password for your account'}
              </p>
            </div>

            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setFormData(prev => ({ ...prev, phone: formatted }));
                      setErrors({ ...errors, phone: '' });
                    }}
                    className={errors.phone ? 'border-red-500' : ''}
                    disabled={loading}
                    maxLength={10}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
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
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    {onSwitchToAadhaar && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onSwitchToAadhaar}
                        className="flex-1"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Aadhaar Login
                      </Button>
                    )}
                    {onSwitchToSignUp && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={onSwitchToSignUp}
                        className="flex-1"
                      >
                        Sign Up
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={formData.otp}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, otp: value }));
                      setErrors({ ...errors, otp: '' });
                    }}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="w-12 h-12 text-lg border-2" />
                      <InputOTPSlot index={1} className="w-12 h-12 text-lg border-2" />
                      <InputOTPSlot index={2} className="w-12 h-12 text-lg border-2" />
                      <InputOTPSlot index={3} className="w-12 h-12 text-lg border-2" />
                      <InputOTPSlot index={4} className="w-12 h-12 text-lg border-2" />
                      <InputOTPSlot index={5} className="w-12 h-12 text-lg border-2" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {errors.otp && (
                  <p className="text-red-500 text-sm text-center flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.otp}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep('phone');
                      setFormData(prev => ({ ...prev, otp: '' }));
                    }}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleOTPVerify}
                    disabled={loading || formData.otp.length !== 6}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify OTP
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password (min 8 characters)"
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

