import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { 
  Smartphone, 
  Shield, 
  User, 
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  SmartphoneIcon,
  Fingerprint,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LoginFlowProps } from '../types/user';
import { toast } from 'sonner@2.0.3';

type LoginStep = 'aadhaar' | 'phone' | 'otp' | 'success';

// Dummy OTP for demo purposes
const DEMO_OTP = '123456';

// API Service Mock
const authService = {
  sendOtp: async (phone: string) => {
    // In a real app, this would call your backend
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  },
  
  verifyOtp: async (phone: string, otp: string) => {
    // In a real app, this would call your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: otp === DEMO_OTP,
          user: {
            id: 'user-123',
            name: 'Demo User',
            phone,
            aadhaar: '123456789012',
            role: 'farmer'
          }
        });
      }, 1000);
    });
  }
};

export function LoginFlow({ onLoginSuccess, onCancel }: LoginFlowProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<LoginStep>('aadhaar');
  const [formData, setFormData] = useState({
    aadhaar: '',
    phone: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const validateAadhaar = useCallback((aadhaar: string) => {
    const cleaned = aadhaar.replace(/\s/g, '');
    return cleaned.length === 12 && /^\d+$/.test(cleaned);
  }, []);

  const validatePhone = useCallback((phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    return cleaned.length === 10;
  }, []);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 12) {
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, aadhaar: formatted }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      setFormData(prev => ({ ...prev, phone: cleaned }));
    }
  };

  const handleOtpChange = (value: string) => {
    setFormData(prev => ({ ...prev, otp: value }));
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!formData.phone.trim()) {
      setErrors({ phone: 'Mobile number is required' });
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrors({ phone: 'Please enter a valid 10-digit mobile number' });
      return;
    }

    setLoading(true);
    try {
      await authService.sendOtp(formData.phone);
      setOtpSent(true);
      setCurrentStep('otp');
      toast.success('OTP sent successfully');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setLoading(true);
    try {
      const result = await authService.verifyOtp(formData.phone, formData.otp);
      if (result.success) {
        setOtpVerified(true);
        toast.success('OTP verified successfully');
        // In a real app, you would handle the login success here
        setTimeout(() => {
          onLoginSuccess?.(result.user);
          setCurrentStep('success');
        }, 1000);
      } else {
        setErrors({ otp: 'Invalid OTP. Please try again.' });
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authService.sendOtp(formData.phone);
      toast.success('OTP resent successfully');
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    return formatted;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.slice(0, 10);
  };

  const handleAadhaarSubmit = () => {
    const cleanedAadhaar = formData.aadhaar.replace(/\s/g, '');
    
    if (!validateAadhaar(cleanedAadhaar)) {
      setErrors({ aadhaar: 'Please enter a valid 12-digit Aadhaar number' });
      return;
    }

    if (cleanedAadhaar !== DUMMY_AADHAAR) {
      setErrors({ aadhaar: 'Invalid Aadhaar number. Use 1234 5678 9012 for demo' });
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      // Generate random PIN for demo
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedPin(pin);
      setFormData(prev => ({ ...prev, pin }));
      setCurrentStep('pin');
      setLoading(false);
      toast.success(t('login.pinGenerated'));
    }, 1500);
  };

  const handlePinCopy = () => {
    navigator.clipboard.writeText(generatedPin);
    toast.success(t('login.pinCopied'));
  };

  const handleProceedToPhone = () => {
    setCurrentStep('phone');
  };

  const handlePhoneSubmit = () => {
    if (!validatePhone(formData.phone)) {
      setErrors({ phone: 'Please enter a valid 10-digit phone number' });
      return;
    }

    if (formData.pin !== DUMMY_PIN) {
      setErrors({ pin: 'Invalid PIN. Use 4521 for demo' });
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setCurrentStep('otp');
      setLoading(false);
      toast.success(t('login.otpSent'));
    }, 1000);
  };

  const handleOTPVerify = () => {
    if (formData.otp !== DUMMY_OTP) {
      setErrors({ otp: 'Invalid OTP. Use 112233 for demo' });
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setCurrentStep('success');
      setLoading(false);
      
      setTimeout(() => {
        const userData = {
          id: 'FARM001',
          name: 'Ramesh Kumar',
          aadhaar: formData.aadhaar,
          phone: formData.phone,
          state: 'Maharashtra',
          district: 'Pune',
          pin: formData.pin,
          loginTime: new Date().toISOString()
        };
        
        onLoginSuccess(userData);
        toast.success(t('login.loginSuccess'));
      }, 2000);
    }, 1500);
  };

  const handleMethodSelect = (method: LoginMethod) => {
    setLoginMethod(method);
    if (method === 'mobile') {
      setCurrentStep('phone');
    } else {
      setCurrentStep('aadhaar');
    }
  };

  const renderStep = () => {
    // Aadhaar Input Step
    if (currentStep === 'aadhaar') {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center">
            <Fingerprint className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Aadhaar Verification</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your 12-digit Aadhaar number to continue
            </p>
          </div>

          <form onSubmit={handleAadhaarSubmit} className="space-y-4">
            <div>
              <Label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">
                Aadhaar Number
              </Label>
              <div className="mt-1">
                <Input
                  id="aadhaar"
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 9012"
                  value={formData.aadhaar}
                  onChange={handleAadhaarChange}
                  className={`w-full ${errors.aadhaar ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.aadhaar && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.aadhaar}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !formData.aadhaar.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={onCancel}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </form>

          <div className="text-center text-xs text-gray-500 mt-4">
            Your Aadhaar number is safe with us. We use bank-level security to protect your data.
          </div>
        </motion.div>
      );
    }

    // Phone Number Step
    if (currentStep === 'phone') {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center">
            <SmartphoneIcon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Mobile Verification</h2>
            <p className="mt-2 text-sm text-gray-600">
              We'll send an OTP to your registered mobile number
            </p>
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">+91</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="98765 43210"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`pl-12 ${errors.phone ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.phone}
                </p>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !validatePhone(formData.phone)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setCurrentStep('aadhaar')}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Aadhaar
              </Button>
            </div>
          </form>
        </motion.div>
      );
    }

    // OTP Verification Step
    if (currentStep === 'otp') {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter the 6-digit OTP sent to +91 {formData.phone}
            </p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={formData.otp}
                onChange={handleOtpChange}
                disabled={loading || otpVerified}
                className={`${errors.otp ? 'border-red-500' : ''}`}
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="h-12 w-12 text-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {errors.otp && (
              <p className="text-sm text-red-600 text-center flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-1" /> {errors.otp}
              </p>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || otpVerified || formData.otp.length !== 6}
              >
                {otpVerified ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verified Successfully
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => setCurrentStep('phone')}
                disabled={loading || otpVerified}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Change Number
              </Button>
            </div>
          </form>
        </motion.div>
      );
    }

    // Success Step
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Login Successful!</h2>
        <p className="text-gray-600">
          You're being redirected to your dashboard...
        </p>
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={onCancel}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </motion.div>
    );
    switch (currentStep) {
      case 'method':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center"
          >
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Choose Login Method</h2>
              <p className="text-gray-600">Select how you want to log in</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => handleMethodSelect('aadhaar')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Aadhaar Based Login</h3>
                    <p className="text-sm text-gray-500">Login using your Aadhaar number</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect('mobile')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Mobile Number Login</h3>
                    <p className="text-sm text-gray-500">Login using your mobile number</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </motion.div>
        );

      case 'aadhaar':
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Aadhaar Verification</h2>
              <p className="text-gray-600">Enter your Aadhaar number to get started</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="aadhaar">{t('login.aadhaarNumber')}</Label>
                <Input
                  id="aadhaar"
                  type="text"
                  placeholder={t('login.aadhaarPlaceholder')}
                  value={formData.aadhaar}
                  onChange={(e) => {
                    const formatted = formatAadhaar(e.target.value);
                    setFormData(prev => ({ ...prev, aadhaar: formatted }));
                    setErrors({});
                  }}
                  className={errors.aadhaar ? 'border-red-500' : ''}
                  maxLength={14}
                />
                {errors.aadhaar && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.aadhaar}
                  </p>
                )}
              </div>

              <Badge variant="outline" className="w-full justify-center py-2">
                Demo: Use 1234 5678 9012
              </Badge>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={handleAadhaarSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  {t('login.generatePin')}
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case 'pin':
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t('login.uzhavarPin')}</h2>
              <p className="text-gray-600">{t('login.pinGenerated')}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border-2 border-orange-200">
                <div className="text-center">
                  <Label className="text-orange-800 font-medium">Your Uzhavar PIN</Label>
                  <div className="text-3xl font-bold text-orange-600 mt-2 tracking-widest">
                    {generatedPin}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePinCopy}
                    className="mt-3 border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {t('login.copyPin')}
                  </Button>
                </div>
              </div>

              <Badge variant="outline" className="w-full justify-center py-2 bg-green-50 border-green-200 text-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                PIN Generated Successfully
              </Badge>

              <Button
                onClick={handleProceedToPhone}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                {t('login.proceedToVerification')}
              </Button>
            </div>
          </motion.div>
        );

      case 'phone':
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {loginMethod === 'aadhaar' ? 'Phone Verification' : 'Mobile Login'}
              </h2>
              <p className="text-gray-600">
                {loginMethod === 'aadhaar' 
                  ? 'Enter your phone number to receive OTP' 
                  : 'Enter your mobile number to login'}
              </p>
            </div>

            <div className="space-y-4">
              {loginMethod === 'aadhaar' && (
                <div>
                  <Label htmlFor="pin">Uzhavar PIN</Label>
                  <Input
                    id="pin"
                    type="text"
                    placeholder="Enter your Uzhavar PIN"
                    value={formData.pin}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, pin: e.target.value }));
                      setErrors({});
                    }}
                    className={errors.pin ? 'border-red-500' : ''}
                    maxLength={4}
                  />
                  {errors.pin && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.pin}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="phone">{t('login.phoneNumber')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setFormData(prev => ({ ...prev, phone: formatted }));
                    setErrors({});
                  }}
                  className={errors.phone ? 'border-red-500' : ''}
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <Badge variant="outline" className="w-full justify-center py-2">
                {loginMethod === 'aadhaar' 
                  ? 'Demo: PIN: 4521, Any 10-digit phone number'
                  : 'Demo: Use any 10-digit phone number'}
              </Badge>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(loginMethod === 'aadhaar' ? 'aadhaar' : 'method')}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handlePhoneSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  {t('login.sendOTP')}
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case 'otp':
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">OTP Verification</h2>
              <p className="text-gray-600">Enter the 6-digit code sent to your phone</p>
              <p className="text-sm text-blue-600 mt-1">+91 {formData.phone}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={formData.otp}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, otp: value }));
                    setErrors({});
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

              <Badge variant="outline" className="w-full justify-center py-2">
                Demo OTP: 112233
              </Badge>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('phone')}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleOTPVerify}
                  disabled={loading || formData.otp.length !== 6}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  {t('login.verifyOTP')}
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-semibold text-gray-800 mb-2"
              >
                ✅ OTP Verified — {t('login.welcome')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600"
              >
                Login successful! Redirecting to dashboard...
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200"
            >
              <div className="flex items-center justify-center gap-2 text-green-700">
                <User className="w-5 h-5" />
                <span className="font-medium">Welcome, Ramesh Kumar</span>
              </div>
              <p className="text-green-600 text-sm mt-1">Maharashtra, Pune District</p>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 2 }}
              className="h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
            />
          </motion.div>
        );

      default:
        return null;
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
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2">
            {((loginMethod === 'aadhaar' 
              ? ['aadhaar', 'pin', 'phone', 'otp'] 
              : ['phone', 'otp']) as LoginStep[]).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step === currentStep 
                      ? 'bg-blue-500 scale-125' 
                      : (loginMethod === 'aadhaar'
                          ? ['aadhaar', 'pin', 'phone', 'otp']
                          : ['phone', 'otp']).indexOf(step) < 
                        (loginMethod === 'aadhaar'
                          ? ['aadhaar', 'pin', 'phone', 'otp']
                          : ['phone', 'otp']).indexOf(currentStep as any)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                  }`} />
                  {index < (loginMethod === 'aadhaar' ? 3 : 1) && (
                    <div className={`w-6 h-0.5 transition-all duration-300 ${
                      (loginMethod === 'aadhaar'
                        ? ['aadhaar', 'pin', 'phone', 'otp']
                        : ['phone', 'otp']).indexOf(step) < 
                      (loginMethod === 'aadhaar'
                        ? ['aadhaar', 'pin', 'phone', 'otp']
                        : ['phone', 'otp']).indexOf(currentStep as any)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}