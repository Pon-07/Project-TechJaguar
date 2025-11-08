import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  User, 
  Shield, 
  Phone, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Smartphone,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../contexts/LanguageContext';

interface FarmerLoginFlowProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

type LoginStep = 'aadhaar' | 'uzhavar-pin' | 'phone' | 'otp' | 'success';

export function FarmerLoginFlow({ onLoginSuccess, onCancel }: FarmerLoginFlowProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<LoginStep>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [uzhavarPin, setUzhavarPin] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isGeneratingPin, setIsGeneratingPin] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [generatedPin, setGeneratedPin] = useState('');

  // Validate Aadhaar number (12 digits)
  const validateAadhaar = (number: string) => {
    return /^\d{12}$/.test(number);
  };

  // Validate phone number (10 digits)
  const validatePhone = (number: string) => {
    return /^\d{10}$/.test(number);
  };

  // Generate Uzhavar PIN
  const generateUzhavarPin = async () => {
    if (!validateAadhaar(aadhaarNumber)) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsGeneratingPin(true);
    
    try {
      // Simulate PIN generation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a dummy PIN based on Aadhaar
      const pin = `UZP-${aadhaarNumber.slice(-4)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      setGeneratedPin(pin);
      setUzhavarPin(pin);
      
      toast.success('✅ ' + t('login.pinGenerated'));
      setCurrentStep('uzhavar-pin');
    } catch (error) {
      toast.error('❌ Failed to generate Uzhavar PIN. Please try again.');
    } finally {
      setIsGeneratingPin(false);
    }
  };

  // Proceed to phone step
  const proceedToPhone = () => {
    if (!uzhavarPin) {
      toast.error('Uzhavar PIN is required');
      return;
    }
    setCurrentStep('phone');
  };

  // Send OTP
  const sendOtp = async () => {
    if (!validatePhone(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSendingOtp(true);
    
    try {
      // Simulate OTP sending process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowOtpDialog(true);
      setCurrentStep('otp');
      toast.success('📱 ' + t('login.otpSent'));
    } catch (error) {
      toast.error('❌ Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setIsVerifyingOtp(true);
    
    try {
      // Simulate OTP verification (any 6-digit number works)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (/^\d{6}$/.test(otp)) {
        setCurrentStep('success');
        toast.success('🎉 OTP verified successfully!');
        
        // Show success state for 2 seconds before proceeding
        setTimeout(() => {
          onLoginSuccess();
        }, 2000);
      } else {
        toast.error('❌ Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('❌ OTP verification failed. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleOtpChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const cleanValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleanValue);
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'aadhaar': return 20;
      case 'uzhavar-pin': return 40;
      case 'phone': return 60;
      case 'otp': return 80;
      case 'success': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t('nav.farmerHub')} {t('nav.login')}
            </CardTitle>
            <p className="text-muted-foreground">
              Secure Aadhaar-based authentication for farmers
            </p>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getStepProgress()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{getStepProgress()}% Complete</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Aadhaar Number */}
              {currentStep === 'aadhaar' && (
                <motion.div
                  key="aadhaar"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <Shield className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">{t('login.aadhaarNumber')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('login.aadhaarPlaceholder')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">{t('login.aadhaarNumber')}</Label>
                    <Input
                      id="aadhaar"
                      type="text"
                      placeholder="XXXX XXXX XXXX"
                      value={aadhaarNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setAadhaarNumber(value);
                      }}
                      className="text-center tracking-wider"
                      maxLength={12}
                    />
                    {aadhaarNumber && !validateAadhaar(aadhaarNumber) && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Please enter a valid 12-digit Aadhaar number
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={generateUzhavarPin}
                    disabled={!validateAadhaar(aadhaarNumber) || isGeneratingPin}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isGeneratingPin ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Generating {t('login.uzhavarPin')}...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        {t('login.generatePin')}
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Uzhavar PIN */}
              {currentStep === 'uzhavar-pin' && (
                <motion.div
                  key="uzhavar-pin"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2"
                    >
                      <Key className="w-6 h-6 text-green-600" />
                    </motion.div>
                    <h3 className="font-semibold">{t('login.pinGenerated')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Your unique farmer identification PIN linked to Aadhaar
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uzhavarPin">{t('login.uzhavarPin')}</Label>
                    <div className="relative">
                      <Input
                        id="uzhavarPin"
                        type={showPin ? "text" : "password"}
                        value={uzhavarPin}
                        readOnly
                        className="text-center bg-green-50 border-green-200 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPin(!showPin)}
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      PIN successfully linked to Aadhaar: {aadhaarNumber}
                    </p>
                  </div>

                  <Button
                    onClick={proceedToPhone}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {t('login.proceedToVerification')}
                  </Button>
                </motion.div>
              )}

              {/* Step 3: Phone Number */}
              {currentStep === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <Phone className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">{t('login.phoneNumber')}</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll send an OTP to verify your mobile number
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('login.phoneNumber')}</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-muted text-muted-foreground">
                        +91
                      </span>
                      <Input
                        id="phone"
                        type="text"
                        placeholder="9876543210"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhoneNumber(value);
                        }}
                        className="rounded-l-none"
                        maxLength={10}
                      />
                    </div>
                    {phoneNumber && !validatePhone(phoneNumber) && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Please enter a valid 10-digit phone number
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={sendOtp}
                    disabled={!validatePhone(phoneNumber) || isSendingOtp}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSendingOtp ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4 mr-2" />
                        {t('login.sendOTP')}
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Step 4: OTP Verification */}
              {currentStep === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <Lock className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold">{t('login.enterOTP')}</h3>
                    <p className="text-sm text-muted-foreground">
                      OTP sent to +91 {phoneNumber}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp">6-Digit OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => handleOtpChange(e.target.value)}
                      className="text-center tracking-widest text-lg"
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Enter any 6-digit number for demo purposes
                    </p>
                  </div>

                  <Button
                    onClick={verifyOtp}
                    disabled={otp.length !== 6 || isVerifyingOtp}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Verifying OTP...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t('login.verifyOTP')}
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={sendOtp}
                    className="w-full"
                    disabled={isSendingOtp}
                  >
                    Resend OTP
                  </Button>
                </motion.div>
              )}

              {/* Step 5: Success */}
              {currentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-xl font-semibold text-green-600 mb-2">
                      {t('login.loginSuccess')} 🎉
                    </h3>
                    <p className="text-muted-foreground">
                      {t('login.welcome')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Redirecting to your dashboard...
                    </p>
                  </motion.div>

                  <motion.div
                    className="space-y-2 text-xs text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>Aadhaar: {aadhaarNumber}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>Uzhavar PIN: {uzhavarPin}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>Phone: +91 {phoneNumber}</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cancel Button - only show if not in success state */}
            {currentStep !== 'success' && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="w-full"
                disabled={isGeneratingPin || isSendingOtp || isVerifyingOtp}
              >
                {t('common.cancel')}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* OTP Sent Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center">
              <Smartphone className="w-5 h-5 text-blue-600" />
              OTP Sent
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto"
            >
              <Smartphone className="w-8 h-8 text-blue-600" />
            </motion.div>
            <div>
              <h4 className="font-semibold">OTP sent to your mobile</h4>
              <p className="text-sm text-muted-foreground">
                Please check your phone for the 6-digit verification code
              </p>
              <p className="text-xs text-blue-600 mt-2">
                +91 {phoneNumber}
              </p>
            </div>
            <Button onClick={() => setShowOtpDialog(false)} className="w-full">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}