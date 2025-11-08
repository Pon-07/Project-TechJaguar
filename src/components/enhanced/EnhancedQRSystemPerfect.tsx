import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QrCode, Eye, Download, Share2, Camera, CheckCircle, AlertCircle, Package, MapPin, Calendar, User, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { notificationManager } from '../NotificationSystem';
import { toast } from 'sonner@2.0.3';
import { getCropDisplay } from '../../data/cropImages';

interface QRData {
  id: string;
  productName: string;
  farmerName: string;
  farmerPhone: string;
  district: string;
  state: string;
  quantity: number;
  unit: string;
  price: number;
  harvestDate: string;
  blockchainHash: string;
  qrCodeImage: string;
  timestamp: string;
  verified: boolean;
  organic: boolean;
  quality: 'A+' | 'A' | 'B+' | 'B';
  carbonFootprint: number;
}

// Generate dummy QR code image
const generateDummyQRCode = (data: any): string => {
  const qrSize = 300;
  const cellSize = 10;
  const pattern = Array.from({ length: qrSize / cellSize }, () => 
    Array.from({ length: qrSize / cellSize }, () => Math.random() > 0.5)
  );
  
  const svg = `
    <svg width="${qrSize}" height="${qrSize}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${qrSize}" height="${qrSize}" fill="#ffffff"/>
      ${pattern.map((row, y) => 
        row.map((cell, x) => 
          cell ? `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="#000000"/>` : ''
        ).join('')
      ).join('')}
      <!-- Corner squares -->
      <rect x="0" y="0" width="70" height="70" fill="#000000"/>
      <rect x="10" y="10" width="50" height="50" fill="#ffffff"/>
      <rect x="20" y="20" width="30" height="30" fill="#000000"/>
      
      <rect x="${qrSize-70}" y="0" width="70" height="70" fill="#000000"/>
      <rect x="${qrSize-60}" y="10" width="50" height="50" fill="#ffffff"/>
      <rect x="${qrSize-50}" y="20" width="30" height="30" fill="#000000"/>
      
      <rect x="0" y="${qrSize-70}" width="70" height="70" fill="#000000"/>
      <rect x="10" y="${qrSize-60}" width="50" height="50" fill="#ffffff"/>
      <rect x="20" y="${qrSize-50}" width="30" height="30" fill="#000000"/>
      
      <!-- Center text -->
      <text x="${qrSize/2}" y="${qrSize/2}" text-anchor="middle" font-size="12" fill="#666">
        ${data.productName || 'QR-CODE'}
      </text>
      <text x="${qrSize/2}" y="${qrSize/2 + 15}" text-anchor="middle" font-size="10" fill="#999">
        ID: ${data.id || 'UZ-001'}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const DUMMY_QR_HISTORY: QRData[] = [
  {
    id: 'UZP-TN-001',
    productName: 'Organic Basmati Rice',
    farmerName: 'Ramesh Kumar',
    farmerPhone: '+91-9876543210',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    quantity: 500,
    unit: 'kg',
    price: 85,
    harvestDate: '2025-01-15',
    blockchainHash: '0xABC123DEF456',
    qrCodeImage: '',
    timestamp: new Date().toISOString(),
    verified: true,
    organic: true,
    quality: 'A+',
    carbonFootprint: 1.2
  },
  {
    id: 'UZP-KL-002',
    productName: 'Premium Cardamom',
    farmerName: 'Lakshmi Nair',
    farmerPhone: '+91-9876543211',
    district: 'Idukki',
    state: 'Kerala',
    quantity: 25,
    unit: 'kg',
    price: 2500,
    harvestDate: '2025-01-12',
    blockchainHash: '0xDEF456GHI789',
    qrCodeImage: '',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
    organic: true,
    quality: 'A+',
    carbonFootprint: 0.8
  },
  {
    id: 'UZP-MH-003',
    productName: 'Cotton Premium',
    farmerName: 'Suresh Patil',
    farmerPhone: '+91-9876543212',
    district: 'Aurangabad',
    state: 'Maharashtra',
    quantity: 1000,
    unit: 'kg',
    price: 65,
    harvestDate: '2025-01-10',
    blockchainHash: '0xGHI789JKL012',
    qrCodeImage: '',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    verified: true,
    organic: false,
    quality: 'A',
    carbonFootprint: 2.1
  }
];

// Generate QR code images for dummy data
DUMMY_QR_HISTORY.forEach(item => {
  item.qrCodeImage = generateDummyQRCode(item);
});

export function EnhancedQRSystemPerfect() {
  const { t, currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'generate' | 'scan' | 'history'>('generate');
  const [qrHistory, setQrHistory] = useState<QRData[]>(DUMMY_QR_HISTORY);
  const [selectedQR, setSelectedQR] = useState<QRData | null>(null);
  const [scanning, setScanning] = useState(false);
  const [newQRData, setNewQRData] = useState({
    productName: '',
    farmerName: '',
    farmerPhone: '',
    district: '',
    state: '',
    quantity: '',
    unit: 'kg',
    price: '',
    harvestDate: '',
    organic: false,
    quality: 'A' as 'A+' | 'A' | 'B+' | 'B'
  });

  const crops = ['Rice', 'Wheat', 'Cotton', 'Turmeric', 'Sugarcane', 'Cardamom', 'Tea', 'Coffee'];
  const states = ['Tamil Nadu', 'Kerala', 'Maharashtra', 'Punjab', 'Gujarat', 'Karnataka'];
  const qualities = ['A+', 'A', 'B+', 'B'];

  const generateQRCode = () => {
    if (!newQRData.productName || !newQRData.farmerName || !newQRData.quantity) {
      toast.error(t('common.error'), {
        description: t('qr.fillAllFields') || 'Please fill all required fields'
      });
      return;
    }

    const qrData: QRData = {
      id: `UZP-${newQRData.state.substring(0, 2).toUpperCase()}-${String(qrHistory.length + 1).padStart(3, '0')}`,
      productName: newQRData.productName,
      farmerName: newQRData.farmerName,
      farmerPhone: newQRData.farmerPhone,
      district: newQRData.district,
      state: newQRData.state,
      quantity: parseInt(newQRData.quantity),
      unit: newQRData.unit,
      price: parseFloat(newQRData.price),
      harvestDate: newQRData.harvestDate,
      blockchainHash: `0x${Math.random().toString(16).substring(2, 14).toUpperCase()}`,
      qrCodeImage: '',
      timestamp: new Date().toISOString(),
      verified: true,
      organic: newQRData.organic,
      quality: newQRData.quality,
      carbonFootprint: Math.round((Math.random() * 2 + 0.5) * 10) / 10
    };

    // Generate QR code image
    qrData.qrCodeImage = generateDummyQRCode(qrData);

    setQrHistory(prev => [qrData, ...prev]);
    setSelectedQR(qrData);
    
    // Show glowing notification
    notificationManager.showQRGenerated({
      productName: qrData.productName,
      qrCodeUrl: qrData.qrCodeImage,
      farmerId: qrData.id,
      amount: qrData.price * qrData.quantity
    }, t);

    // Reset form
    setNewQRData({
      productName: '',
      farmerName: '',
      farmerPhone: '',
      district: '',
      state: '',
      quantity: '',
      unit: 'kg',
      price: '',
      harvestDate: '',
      organic: false,
      quality: 'A'
    });

    setActiveTab('history');
    
    toast.success(t('notification.qrGenerated'), {
      description: `${t('qr.generateCode')} ${qrData.productName}`
    });
  };

  const simulateQRScan = () => {
    setScanning(true);
    setTimeout(() => {
      const randomQR = qrHistory[Math.floor(Math.random() * qrHistory.length)];
      setSelectedQR(randomQR);
      setScanning(false);
      setActiveTab('history');
      
      toast.success(t('qr.scanCode'), {
        description: `${t('qr.productInfo')}: ${randomQR.productName}`
      });
    }, 2000);
  };

  const downloadQR = (qrData: QRData) => {
    const link = document.createElement('a');
    link.href = qrData.qrCodeImage;
    link.download = `QR-${qrData.id}-${qrData.productName}.svg`;
    link.click();
    
    toast.success(t('common.download'), {
      description: `QR ${t('common.download')} ${qrData.productName}`
    });
  };

  const shareQR = (qrData: QRData) => {
    if (navigator.share) {
      navigator.share({
        title: `${qrData.productName} - ${qrData.farmerName}`,
        text: `${t('qr.productInfo')}: ${qrData.productName}\n${t('qr.farmerInfo')}: ${qrData.farmerName}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${qrData.productName} - ${qrData.farmerName} - ID: ${qrData.id}`);
      toast.success(t('common.share'), {
        description: t('qr.linkCopied') || 'QR details copied to clipboard'
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🔗 {t('qr.qrSystemHub') || 'QR System Hub'}
        </motion.h1>
        <p className="text-muted-foreground mt-2">
          {t('qr.perfectQRSystem') || 'Perfect QR Code Generation & Management System'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg inline-flex">
          {[
            { key: 'generate', label: t('qr.generateCode'), icon: QrCode },
            { key: 'scan', label: t('qr.scanCode'), icon: Camera },
            { key: 'history', label: t('qr.history'), icon: Eye }
          ].map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                activeTab === key 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'hover:bg-background'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate QR Tab */}
      {activeTab === 'generate' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-green-600" />
                {t('farmer.generateQR')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t('qr.productInfo')} *</Label>
                  <Select value={newQRData.productName} onValueChange={(value) => setNewQRData({...newQRData, productName: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('common.select')} />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map(crop => (
                        <SelectItem key={crop} value={crop}>
                          {getCropDisplay(crop).emoji} {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t('qr.farmerInfo')} *</Label>
                  <Input
                    value={newQRData.farmerName}
                    onChange={(e) => setNewQRData({...newQRData, farmerName: e.target.value})}
                    placeholder={t('farmer.name') || 'Farmer Name'}
                  />
                </div>

                <div>
                  <Label>{t('farmer.phone')}</Label>
                  <Input
                    value={newQRData.farmerPhone}
                    onChange={(e) => setNewQRData({...newQRData, farmerPhone: e.target.value})}
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <Label>{t('location.selectState')} *</Label>
                  <Select value={newQRData.state} onValueChange={(value) => setNewQRData({...newQRData, state: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('location.selectState')} />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t('location.selectDistrict')}</Label>
                  <Input
                    value={newQRData.district}
                    onChange={(e) => setNewQRData({...newQRData, district: e.target.value})}
                    placeholder={t('location.selectDistrict')}
                  />
                </div>

                <div>
                  <Label>{t('farmer.quantity')} *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newQRData.quantity}
                      onChange={(e) => setNewQRData({...newQRData, quantity: e.target.value})}
                      placeholder="1000"
                      className="flex-1"
                    />
                    <Select value={newQRData.unit} onValueChange={(value) => setNewQRData({...newQRData, unit: value})}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="bags">bags</SelectItem>
                        <SelectItem value="tonnes">tonnes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>{t('farmer.price')} (₹)</Label>
                  <Input
                    value={newQRData.price}
                    onChange={(e) => setNewQRData({...newQRData, price: e.target.value})}
                    placeholder="85"
                  />
                </div>

                <div>
                  <Label>{t('qr.harvestDate')}</Label>
                  <Input
                    type="date"
                    value={newQRData.harvestDate}
                    onChange={(e) => setNewQRData({...newQRData, harvestDate: e.target.value})}
                  />
                </div>

                <div>
                  <Label>{t('farmer.quality')}</Label>
                  <Select value={newQRData.quality} onValueChange={(value) => setNewQRData({...newQRData, quality: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualities.map(quality => (
                        <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="organic"
                    checked={newQRData.organic}
                    onChange={(e) => setNewQRData({...newQRData, organic: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="organic">{t('farmer.organic')}</Label>
                </div>
              </div>

              <motion.div className="pt-4">
                <Button 
                  onClick={generateQRCode} 
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {t('farmer.generateQR')}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Scan QR Tab */}
      {activeTab === 'scan' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <motion.div
                animate={scanning ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: scanning ? Infinity : 0 }}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center"
              >
                <Camera className="w-12 h-12 text-blue-600" />
              </motion.div>
              
              <div>
                <h3 className="text-xl font-semibold">{t('qr.scanCode')}</h3>
                <p className="text-muted-foreground mt-2">
                  {scanning ? 
                    (t('common.scanning') || 'Scanning QR Code...') : 
                    (t('qr.clickToScan') || 'Click to simulate QR scan')
                  }
                </p>
              </div>

              <Button 
                onClick={simulateQRScan} 
                disabled={scanning}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600"
              >
                {scanning ? t('common.scanning') : t('qr.scanCode')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t('qr.history')} ({qrHistory.length})</h2>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {t('farmer.verified') || 'All Verified'} ✓
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qrHistory.map((qr) => (
              <motion.div
                key={qr.id}
                whileHover={{ scale: 1.02, y: -2 }}
                className="cursor-pointer"
                onClick={() => setSelectedQR(qr)}
              >
                <Card className={`border-2 shadow-md hover:shadow-lg transition-all ${
                  selectedQR?.id === qr.id ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={qr.qrCodeImage} 
                          alt="QR Code" 
                          className="w-12 h-12 rounded border"
                        />
                        <div>
                          <h4 className="font-medium text-sm">{qr.productName}</h4>
                          <p className="text-xs text-muted-foreground">{qr.id}</p>
                        </div>
                      </div>
                      {qr.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{qr.farmerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{qr.district}, {qr.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span>{qr.quantity} {qr.unit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>₹{qr.price}/{qr.unit}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      <Badge variant="outline" className="text-xs">
                        {qr.quality}
                      </Badge>
                      {qr.organic && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          {t('farmer.organic')}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {qr.carbonFootprint}kg CO₂
                      </Badge>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        downloadQR(qr);
                      }}>
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        shareQR(qr);
                      }}>
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Selected QR Detail Modal */}
      {selectedQR && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedQR(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    {selectedQR.productName}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedQR(null)}>
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <img 
                      src={selectedQR.qrCodeImage} 
                      alt="QR Code" 
                      className="w-48 h-48 mx-auto border rounded-lg shadow-md"
                    />
                    <div className="flex gap-2 mt-4 justify-center">
                      <Button onClick={() => downloadQR(selectedQR)}>
                        <Download className="w-4 h-4 mr-2" />
                        {t('common.download')}
                      </Button>
                      <Button variant="outline" onClick={() => shareQR(selectedQR)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        {t('common.share')}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">{t('qr.productInfo')}</Label>
                      <p className="text-lg font-semibold">{selectedQR.productName}</p>
                      <p className="text-sm text-muted-foreground">ID: {selectedQR.id}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">{t('qr.farmerInfo')}</Label>
                      <p>{selectedQR.farmerName}</p>
                      <p className="text-sm text-muted-foreground">{selectedQR.farmerPhone}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">{t('farmer.location')}</Label>
                      <p>{selectedQR.district}, {selectedQR.state}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">{t('farmer.quantity')}</Label>
                        <p>{selectedQR.quantity} {selectedQR.unit}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">{t('farmer.price')}</Label>
                        <p>₹{selectedQR.price}/{selectedQR.unit}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">{t('qr.harvestDate')}</Label>
                      <p>{new Date(selectedQR.harvestDate).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">{t('qr.blockchainHash')}</Label>
                      <p className="font-mono text-sm break-all">{selectedQR.blockchainHash}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {selectedQR.quality} {t('farmer.quality')}
                      </Badge>
                      {selectedQR.organic && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {t('farmer.organic')}
                        </Badge>
                      )}
                      {selectedQR.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {t('farmer.verified')}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {selectedQR.carbonFootprint}kg CO₂
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}