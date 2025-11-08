import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Shield, Phone, ArrowLeft, Mail } from 'lucide-react';

interface LoginMethodSelectorProps {
  onSelectAadhaar: () => void;
  onSelectPhone: () => void;
  onSelectGmail?: () => void;
  onSelectSignUp?: () => void;
  onCancel?: () => void;
}

export function LoginMethodSelector({ onSelectAadhaar, onSelectPhone, onSelectGmail, onSelectSignUp, onCancel }: LoginMethodSelectorProps) {
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Choose Login Method</h2>
              <p className="text-gray-600">Select how you want to log in</p>
            </div>

            <div className="grid gap-4">
              {onSelectGmail && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSelectGmail}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Gmail Login</h3>
                      <p className="text-sm text-gray-500 mt-1">Login using your Gmail account</p>
                    </div>
                  </div>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSelectAadhaar}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Aadhaar Based Login</h3>
                    <p className="text-sm text-gray-500 mt-1">Login using your Aadhaar number</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSelectPhone}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Mobile Number Login</h3>
                    <p className="text-sm text-gray-500 mt-1">Login using your mobile number</p>
                  </div>
                </div>
              </motion.button>

              {onSelectSignUp && (
                <div className="pt-2 border-t">
                  <p className="text-center text-sm text-gray-600 mb-3">
                    New to GreenLedger?
                  </p>
                  <Button
                    variant="outline"
                    onClick={onSelectSignUp}
                    className="w-full"
                  >
                    Create New Account
                  </Button>
                </div>
              )}
            </div>

            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

