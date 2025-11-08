import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  Camera, 
  QrCode, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Scan,
  Upload,
  Type
} from 'lucide-react';
import { QRProduct, getProductByQRCode } from '../../data/qrProducts';

interface QRScannerProps {
  onScanSuccess: (product: QRProduct) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function QRScanner({ 
  onScanSuccess, 
  onClose, 
  title = "Scan Uzhavar QR Code",
  description = "Point your camera at the QR code or enter the code manually"
}: QRScannerProps) {
  const [scanMode, setScanMode] = useState<'camera' | 'manual' | 'upload'>('manual');
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Simulate QR code scanning (in real app, use a QR scanner library)
  const simulateQRScan = () => {
    setScanning(true);
    setError('');
    
    // Simulate scanning delay
    setTimeout(() => {
      // Random selection from available QR codes for demo
      const availableCodes = ['UZ-2025-001', 'UZ-2025-002', 'UZ-2025-003', 'UZ-2025-004', 'UZ-2025-005'];
      const randomCode = availableCodes[Math.floor(Math.random() * availableCodes.length)];
      
      const product = getProductByQRCode(randomCode);
      setScanning(false);
      
      if (product) {
        onScanSuccess(product);
      } else {
        setError('QR code not found in system');
      }
    }, 2000);
  };

  const handleManualScan = () => {
    if (!manualCode.trim()) {
      setError('Please enter a QR code');
      return;
    }

    setError('');
    const product = getProductByQRCode(manualCode.trim());
    
    if (product) {
      onScanSuccess(product);
    } else {
      setError('Invalid QR code. Please check and try again.');
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      setError('Camera access denied. Please use manual entry.');
      setScanMode('manual');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (scanMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [scanMode]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  {title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-green-100 text-sm">{description}</p>
            </CardHeader>
            
            <CardContent className="p-6 space-y-4">
              {/* Scan Mode Selector */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={scanMode === 'camera' ? 'default' : 'outline'}
                  onClick={() => setScanMode('camera')}
                  className="flex-1"
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Camera
                </Button>
                <Button
                  size="sm"
                  variant={scanMode === 'manual' ? 'default' : 'outline'}
                  onClick={() => setScanMode('manual')}
                  className="flex-1"
                >
                  <Type className="w-4 h-4 mr-1" />
                  Manual
                </Button>
                <Button
                  size="sm"
                  variant={scanMode === 'upload' ? 'default' : 'outline'}
                  onClick={() => setScanMode('upload')}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Button>
              </div>

              {/* Camera Scanner */}
              {scanMode === 'camera' && (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-green-400 border-dashed rounded-lg relative">
                        <motion.div
                          className="absolute inset-0 border-2 border-green-400"
                          animate={scanning ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                        
                        {/* Corner markers */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400"></div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={simulateQRScan}
                    disabled={scanning}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {scanning ? (
                      <motion.div 
                        className="flex items-center gap-2"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Scan className="w-4 h-4" />
                        Scanning...
                      </motion.div>
                    ) : (
                      <>
                        <Scan className="w-4 h-4 mr-2" />
                        Scan QR Code
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Manual Entry */}
              {scanMode === 'manual' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qr-code">Enter QR Code ID</Label>
                    <Input
                      id="qr-code"
                      placeholder="e.g., UZ-2025-001"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleManualScan}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify QR Code
                  </Button>

                  {/* Sample codes for demo */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium mb-2">Sample QR Codes (for testing):</p>
                    <div className="flex flex-wrap gap-1">
                      {['UZ-2025-001', 'UZ-2025-002', 'UZ-2025-003', 'UZ-2025-004', 'UZ-2025-005'].map(code => (
                        <Badge 
                          key={code}
                          variant="outline" 
                          className="cursor-pointer hover:bg-green-50 text-xs"
                          onClick={() => setManualCode(code)}
                        >
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Image */}
              {scanMode === 'upload' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Upload QR code image</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="qr-upload"
                      onChange={(e) => {
                        // Simulate QR detection from uploaded image
                        if (e.target.files?.[0]) {
                          simulateQRScan();
                        }
                      }}
                    />
                    <label htmlFor="qr-upload">
                      <Button variant="outline" as="span" className="cursor-pointer">
                        Choose File
                      </Button>
                    </label>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}