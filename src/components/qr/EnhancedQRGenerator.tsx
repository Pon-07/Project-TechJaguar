import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  QrCode, 
  Download, 
  Printer, 
  Shield, 
  MapPin, 
  Calendar, 
  Leaf,
  Package,
  User,
  Warehouse,
  TrendingUp,
  TrendingDown,
  Star,
  Copy,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { QRHistoryEntry, qrHistoryManager, createQRData, generateQRCodeUrl, getCropImageUrl } from '../../data/qrHistory';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../../contexts/LanguageContext';

interface EnhancedQRGeneratorProps {
  entry: Partial<QRHistoryEntry>;
  onGenerated?: (qrEntry: QRHistoryEntry) => void;
  module: 'farmer' | 'warehouse' | 'consumer';
}

export function EnhancedQRGenerator({ entry, onGenerated, module }: EnhancedQRGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<QRHistoryEntry | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const handleGenerateQR = async () => {
    if (!entry.productName || !entry.farmerName) {
      toast.error('Missing required product information');
      return;
    }

    setIsGenerating(true);

    // Simulate generation delay for better UX
    setTimeout(() => {
      const qrCodeId = `QR-${entry.warehouseId?.split('-')[1] || 'GEN'}-${Date.now().toString().slice(-6)}`;
      const productId = entry.productId || `P-${Date.now().toString().slice(-6)}`;
      const blockchainHash = `0x${Math.random().toString(16).substring(2, 42)}`;
      
      const fullEntry: QRHistoryEntry = {
        id: `entry-${Date.now()}`,
        qrCodeId,
        productId,
        productName: entry.productName!,
        cropType: entry.cropType || entry.productName!,
        farmerName: entry.farmerName!,
        farmerId: entry.farmerId || `F-${Date.now().toString().slice(-6)}`,
        warehouseId: entry.warehouseId || `WH-${Date.now().toString().slice(-6)}`,
        warehouseName: entry.warehouseName || 'GreenLedger Warehouse',
        taluk: entry.taluk || 'Unknown Taluk',
        district: entry.district || 'Unknown District',
        blockchainHash,
        dateGenerated: new Date().toISOString(),
        qrCodeUrl: '',
        module,
        action: 'generated',
        quantity: entry.quantity || '100',
        unit: entry.unit || 'kg',
        price: entry.price || Math.floor(Math.random() * 100) + 50,
        qualityGrade: entry.qualityGrade || 'A',
        organicCertified: entry.organicCertified || false,
        harvestDate: entry.harvestDate || new Date().toISOString(),
        storageConditions: entry.storageConditions || '15-25°C, Humidity: 60-70%',
        carbonFootprint: entry.carbonFootprint || Math.random() * 3 + 0.5,
        predictiveAnalytics: entry.predictiveAnalytics || {
          expectedSale: Math.floor(Math.random() * 500000) + 50000,
          profitMargin: Math.floor(Math.random() * 40) + 15,
          demandForecast: 'Medium',
          stockLevel: 'Optimal',
          lossRisk: Math.floor(Math.random() * 20) + 5
        },
        cropImage: entry.cropImage || getCropImageUrl(entry.productName!)
      };

      // Generate QR code URL
      const qrData = createQRData(fullEntry);
      fullEntry.qrCodeUrl = generateQRCodeUrl(qrData);

      // Save to history
      qrHistoryManager.addEntry(fullEntry);

      setGeneratedQR(fullEntry);
      setIsGenerating(false);

      // Show success notification
      toast.success(
        <div className="flex items-center space-x-3">
          <QrCode className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-medium">QR Code Generated Successfully!</p>
            <p className="text-sm text-muted-foreground">ID: {fullEntry.qrCodeId}</p>
          </div>
        </div>,
        { duration: 4000 }
      );

      onGenerated?.(fullEntry);
    }, 2000);
  };

  const handleDownload = () => {
    if (!generatedQR) return;

    const link = document.createElement('a');
    link.href = generatedQR.qrCodeUrl;
    link.download = `${generatedQR.qrCodeId}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Downloaded QR code for ${generatedQR.productName}`);
  };

  const handlePrint = () => {
    if (!generatedQR) return;

    const printWindow = window.open('', '_blank', 'width=600,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>GreenLedger QR Code - ${generatedQR.qrCodeId}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                text-align: center;
                background: linear-gradient(135deg, #f0fdf4 0%, #fef3c7 100%);
                margin: 0;
              }
              .container {
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                border: 3px solid #16a34a;
                max-width: 500px;
                margin: 0 auto;
              }
              .header { 
                color: #16a34a; 
                margin-bottom: 20px;
                font-size: 24px;
                font-weight: bold;
              }
              .qr-code { 
                width: 250px; 
                height: 250px; 
                margin: 20px auto; 
                border: 3px solid #16a34a;
                border-radius: 15px;
                padding: 15px;
                background: white;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
              }
              .info { 
                text-align: left; 
                margin-top: 30px; 
                line-height: 1.8;
                background: #f9fafb;
                padding: 20px;
                border-radius: 10px;
                border: 1px solid #e5e7eb;
              }
              .info-row { 
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                border-bottom: 1px dotted #d1d5db;
                padding-bottom: 8px;
              }
              .label { 
                font-weight: bold; 
                color: #374151;
                min-width: 120px;
              }
              .value { 
                color: #16a34a;
                font-weight: 500;
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #6b7280;
                border-top: 2px solid #16a34a;
                padding-top: 15px;
              }
              .blockchain-hash {
                font-family: monospace;
                font-size: 10px;
                word-break: break-all;
                background: #f3f4f6;
                padding: 5px;
                border-radius: 5px;
                border: 1px solid #d1d5db;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">🌾 GreenLedger Verified QR Code</div>
              <img src="${generatedQR.qrCodeUrl}" class="qr-code" alt="QR Code" />
              
              <div class="info">
                <div class="info-row">
                  <span class="label">QR ID:</span>
                  <span class="value">${generatedQR.qrCodeId}</span>
                </div>
                <div class="info-row">
                  <span class="label">Product:</span>
                  <span class="value">${generatedQR.productName}</span>
                </div>
                <div class="info-row">
                  <span class="label">Farmer:</span>
                  <span class="value">${generatedQR.farmerName}</span>
                </div>
                <div class="info-row">
                  <span class="label">Quantity:</span>
                  <span class="value">${generatedQR.quantity} ${generatedQR.unit}</span>
                </div>
                <div class="info-row">
                  <span class="label">Quality:</span>
                  <span class="value">Grade ${generatedQR.qualityGrade}</span>
                </div>
                <div class="info-row">
                  <span class="label">Location:</span>
                  <span class="value">${generatedQR.taluk}, ${generatedQR.district}</span>
                </div>
                <div class="info-row">
                  <span class="label">Harvest Date:</span>
                  <span class="value">${new Date(generatedQR.harvestDate).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                  <span class="label">Generated:</span>
                  <span class="value">${new Date(generatedQR.dateGenerated).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                  <span class="label">Blockchain:</span>
                  <div class="blockchain-hash">${generatedQR.blockchainHash}</div>
                </div>
              </div>
              
              <div class="footer">
                <p><strong>Scan this QR code to verify product authenticity and view complete farm-to-table details</strong></p>
                <p>Powered by GreenLedger Blockchain Technology | Verified & Secure</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

    toast.success('QR Code sent to printer');
  };

  const handleCopyQRData = () => {
    if (!generatedQR) return;

    const qrData = createQRData(generatedQR);
    navigator.clipboard.writeText(qrData);
    toast.success('QR data copied to clipboard');
  };

  const displayEntry = generatedQR || entry;

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      {!generatedQR && (
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <QrCode className="w-5 h-5" />
              Generate QR Code
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Create a blockchain-verified QR code for this product
            </p>
          </CardHeader>
          <CardContent>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleGenerateQR}
                disabled={isGenerating}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg relative overflow-hidden"
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <QrCode className="w-5 h-5 mr-2" />
                )}
                {isGenerating ? 'Generating QR Code...' : 'Generate Blockchain QR Code'}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      )}

      {/* QR Code Display */}
      {generatedQR && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-amber-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <QrCode className="w-5 h-5" />
                  Blockchain Verified QR Code
                </CardTitle>
                <Badge variant="default" className="bg-green-600">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code Display */}
              <div ref={qrRef} className="flex justify-center">
                <motion.div 
                  className="bg-white p-6 rounded-xl shadow-lg border-3 border-green-200 relative"
                  animate={{ 
                    boxShadow: [
                      "0 10px 25px rgba(34, 197, 94, 0.2)",
                      "0 15px 35px rgba(34, 197, 94, 0.3)",
                      "0 10px 25px rgba(34, 197, 94, 0.2)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <img 
                    src={generatedQR.qrCodeUrl} 
                    alt={`QR Code for ${generatedQR.qrCodeId}`}
                    className="w-64 h-64"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Product Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="space-y-3">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={generatedQR.cropImage}
                    alt={generatedQR.productName}
                    className="w-full h-40 object-cover rounded-lg border-2 border-green-200"
                  />
                  <div className="flex justify-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <Leaf className="w-3 h-3 mr-1" />
                      {generatedQR.organicCertified ? 'Organic Certified' : 'Farm Fresh'}
                    </Badge>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-green-800">{generatedQR.productName}</h3>
                    <p className="text-sm text-muted-foreground">Grade {generatedQR.qualityGrade} Quality</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>{generatedQR.quantity} {generatedQR.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>₹{generatedQR.price}/{generatedQR.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-orange-600" />
                      <span>{generatedQR.farmerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span>{generatedQR.taluk}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span>{new Date(generatedQR.harvestDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Warehouse className="w-4 h-4 text-indigo-600" />
                      <span>{generatedQR.warehouseId}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Predictive Analytics */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Predictive Analytics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">Expected Sale:</span>
                    <p className="font-bold">₹{generatedQR.predictiveAnalytics.expectedSale.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Profit Margin:</span>
                    <p className="font-bold">{generatedQR.predictiveAnalytics.profitMargin}%</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Demand:</span>
                    <p className="font-bold">{generatedQR.predictiveAnalytics.demandForecast}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-600 font-medium">Risk:</span>
                    <div className="flex items-center gap-1">
                      {generatedQR.predictiveAnalytics.lossRisk > 15 ? (
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                      <span className="font-bold">{generatedQR.predictiveAnalytics.lossRisk}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">QR Code ID:</span>
                    <p className="font-mono font-bold text-green-600">{generatedQR.qrCodeId}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Blockchain Hash:</span>
                    <p className="font-mono text-xs text-gray-500 break-all">{generatedQR.blockchainHash}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Button 
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={handlePrint}
                  variant="outline"
                  className="border-green-600 text-green-700 hover:bg-green-50"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button 
                  onClick={handleCopyQRData}
                  variant="outline"
                  className="border-blue-600 text-blue-700 hover:bg-blue-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Data
                </Button>
                <Button 
                  variant="outline"
                  className="border-purple-600 text-purple-700 hover:bg-purple-50"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}