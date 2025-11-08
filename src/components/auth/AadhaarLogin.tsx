import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { 
  Shield, 
  Phone, 
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  LogIn,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface AadhaarLoginProps {
  onLoginSuccess?: () => void;
  onCancel?: () => void;
  onSwitchToPhone?: () => void;
}

export function AadhaarLogin({ onLoginSuccess, onCancel, onSwitchToPhone }: AadhaarLoginProps) {
  const { signInWithAadhaar } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'aadhaar' | 'phone' | 'otp'>('aadhaar');
  
  const [formData, setFormData] = useState({
    aadhaar: '',
    phone: '',
    otp: ''
  });

  const validateAadhaar = (aadhaar: string) => {
    const cleaned = aadhaar.replace(/\s/g, '');
    return cleaned.length === 12 && /^\d+$/.test(cleaned);
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
  };

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 12);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    return cleaned;
  };

  const handleAadhaarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const cleanedAadhaar = formData.aadhaar.replace(/\s/g, '');
    if (!cleanedAadhaar) {
      newErrors.aadhaar = 'Aadhaar number is required';
    } else if (!validateAadhaar(cleanedAadhaar)) {
      newErrors.aadhaar = 'Please enter a valid 12-digit Aadhaar number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Verify Aadhaar and proceed to phone step
      const { error } = await signInWithAadhaar(cleanedAadhaar, 'verify-aadhaar');
      
      if (error) {
        setErrors({ general: error.message || 'Invalid Aadhaar number' });
        toast.error(error.message || 'Aadhaar verification failed');
      } else {
        setStep('phone');
        toast.success('Aadhaar verified. Please enter your phone number');
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'An unexpected error occurred' });
      toast.error('Aadhaar verification failed');
    } finally {
      setLoading(false);
    }
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
      const cleanedAadhaar = formData.aadhaar.replace(/\s/g, '');
      const { error } = await signInWithAadhaar(cleanedAadhaar, 'send-otp', cleanedPhone);
      
      if (error) {
        setErrors({ general: error.message || 'Failed to send OTP' });
        toast.error(error.message || 'Failed to send OTP');
      } else {
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
      const cleanedAadhaar = formData.aadhaar.replace(/\s/g, '');
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      const { error, data } = await signInWithAadhaar(cleanedAadhaar, 'verify-otp', cleanedPhone, formData.otp);

      if (error) {
        setErrors({ otp: error.message || 'Invalid OTP' });
        toast.error(error.message || 'Invalid OTP');
      } else {
        toast.success('Login successful!');
        setTimeout(() => {
          onLoginSuccess?.();
        }, 500);
      }
    } catch (error: any) {
      setErrors({ otp: error.message || 'OTP verification failed' });
      toast.error('OTP verification failed');
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
                {step === 'aadhaar' && <Fingerprint className="w-8 h-8 text-white" />}
                {step === 'phone' && <Phone className="w-8 h-8 text-white" />}
                {step === 'otp' && <Shield className="w-8 h-8 text-white" />}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {step === 'aadhaar' && 'Aadhaar Login'}
                {step === 'phone' && 'Phone Verification'}
                {step === 'otp' && 'Verify OTP'}
              </h2>
              <p className="text-gray-600">
                {step === 'aadhaar' && 'Enter your 12-digit Aadhaar number'}
                {step === 'phone' && 'Enter your registered phone number'}
                {step === 'otp' && `Enter the 6-digit OTP sent to +91 ${formData.phone}`}
              </p>
            </div>

            {step === 'aadhaar' && (
              <form onSubmit={handleAadhaarSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012"
                    value={formData.aadhaar}
                    onChange={(e) => {
                      const formatted = formatAadhaar(e.target.value);
                      setFormData(prev => ({ ...prev, aadhaar: formatted }));
                      setErrors({ ...errors, aadhaar: '' });
                    }}
                    className={errors.aadhaar ? 'border-red-500' : ''}
                    disabled={loading}
                    maxLength={14}
                  />
                  {errors.aadhaar && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.aadhaar}
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
                        Verifying...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    {onSwitchToPhone && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onSwitchToPhone}
                        className="flex-1"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Mobile Login
                      </Button>
                    )}
                    {onCancel && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            )}

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

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('aadhaar')}
                    className="flex-1"
                    disabled={loading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
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
                    onClick={() => setStep('phone')}
                    className="flex-1"
                    disabled={loading}
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
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

