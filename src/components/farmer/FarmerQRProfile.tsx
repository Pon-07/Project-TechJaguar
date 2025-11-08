import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  CheckCircle, 
  User,
  MapPin,
  Wheat,
  Building,
  Hash,
  Shield,
  Eye,
  History
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { User as UserType } from '../../types/user';
import { 
  createFarmerQRData, 
  generateQRImageSVG, 
  svgToBlobUrl, 
  saveQRToHistory,
  FarmerQRData
} from '../../utils/qrUtils';

interface FarmerQRProfileProps {
  user: UserType;
}



export function FarmerQRProfile({ user }: FarmerQRProfileProps) {
  const [qrData, setQrData] = useState<FarmerQRData | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate QR data for farmer
  useEffect(() => {
    if (user) {
      const farmerQRData = createFarmerQRData({
        name: user.name,
        uzhavarPin: user.uzhavarPin || `UZP-${user.name.replace(/\s+/g, '').slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000000)}`,
        aadhaarNumber: user.aadhaarNumber,
        state: user.state || 'Odisha',
        district: user.district || 'Khordha',
        crops: user.crops || ['Paddy', 'Vegetables'],
        landSize: user.landSize || '5.2 acres',
        phoneNumber: user.phoneNumber,
        verified: user.verified
      });

      setQrData(farmerQRData);
      generateQRImage(farmerQRData);
    }
  }, [user]);

  // Generate QR code image using utility
  const generateQRImage = async (data: FarmerQRData) => {
    setIsGenerating(true);
    
    // Simulate QR generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate QR image using utility
    const qrSvg = generateQRImageSVG(data);
    const qrUrl = svgToBlobUrl(qrSvg);
    
    setQrImageUrl(qrUrl);
    setIsGenerating(false);

    // Save to QR history using utility
    saveQRToHistory(data, qrUrl);
  };



  // Download QR code
  const handleDownloadQR = async () => {
    if (!qrImageUrl || !qrData) return;

    try {
      // Create a canvas to render the QR with farmer details
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 400;
      canvas.height = 500;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, 0, canvas.width, 60);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GreenLedger Farmer QR', canvas.width / 2, 35);

      // QR Code (simplified representation)
      ctx.fillStyle = '#000000';
      const qrSize = 160;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 80;
      
      // Draw QR pattern
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(qrX + i * 20, qrY + j * 20, 18, 18);
          }
        }
      }

      // Farmer details
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      
      const details = [
        `Name: ${qrData.name}`,
        `Uzhavar PIN: ${qrData.uzhavarPin}`,
        `District: ${qrData.district}`,
        `Crops: ${qrData.crops.join(', ')}`,
        `Land: ${qrData.landSize}`,
        `Warehouse: ${qrData.warehouseId}`,
        `Verified: ${qrData.verified ? 'Yes' : 'No'}`
      ];

      details.forEach((detail, index) => {
        ctx.fillText(detail, 20, 270 + index * 25);
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `farmer-qr-${qrData.uzhavarPin}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast.success('QR Code downloaded successfully!');
          
          // Update download count
          updateQRStats('download');
        }
      }, 'image/png');
    } catch (error) {
      toast.error('Failed to download QR Code');
      console.error('Download error:', error);
    }
  };

  // Print QR code
  const handlePrintQR = () => {
    if (!qrData) return;

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Farmer QR Code - ${qrData.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              text-align: center;
            }
            .header { 
              background: #22c55e; 
              color: white; 
              padding: 20px; 
              margin-bottom: 20px; 
              border-radius: 8px;
            }
            .qr-container { 
              margin: 20px 0; 
              padding: 20px; 
              border: 2px solid #22c55e; 
              border-radius: 8px;
              display: inline-block;
            }
            .qr-code { 
              width: 200px; 
              height: 200px; 
              border: 1px solid #ccc; 
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f9f9f9;
            }
            .details { 
              text-align: left; 
              margin-top: 20px; 
              line-height: 1.6;
            }
            .detail-row { 
              margin: 8px 0; 
              padding: 5px 0; 
              border-bottom: 1px dotted #ccc;
            }
            .label { font-weight: bold; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>GreenLedger Farmer QR Code</h1>
            <p>Official Farmer Identity & Product Verification</p>
          </div>
          
          <div class="qr-container">
            <div class="qr-code">
              <div style="text-align: center;">
                <div style="font-size: 48px; margin-bottom: 10px;">⚫⚪⚫⚪</div>
                <div style="font-size: 48px; margin-bottom: 10px;">⚪⚫⚪⚫</div>
                <div style="font-size: 48px; margin-bottom: 10px;">⚫⚪⚫⚪</div>
                <div style="font-size: 12px; color: #666;">${qrData.uzhavarPin}</div>
              </div>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Farmer Name:</span> ${qrData.name}
              </div>
              <div class="detail-row">
                <span class="label">Uzhavar PIN:</span> ${qrData.uzhavarPin}
              </div>
              <div class="detail-row">
                <span class="label">State:</span> ${qrData.state}
              </div>
              <div class="detail-row">
                <span class="label">District:</span> ${qrData.district}
              </div>
              <div class="detail-row">
                <span class="label">Crops:</span> ${qrData.crops.join(', ')}
              </div>
              <div class="detail-row">
                <span class="label">Land Size:</span> ${qrData.landSize}
              </div>
              <div class="detail-row">
                <span class="label">Warehouse ID:</span> ${qrData.warehouseId}
              </div>
              <div class="detail-row">
                <span class="label">Blockchain Hash:</span> ${qrData.blockchainTxHash.substring(0, 20)}...
              </div>
              <div class="detail-row">
                <span class="label">Verification Status:</span> ${qrData.verified ? '✅ Verified' : '❌ Pending'}
              </div>
              <div class="detail-row">
                <span class="label">Generated:</span> ${new Date(qrData.generatedAt).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p>Scan this QR code with GreenLedger Consumer app to view farmer details and verify products.</p>
            <p>For support, contact: +91-99999-00000 | support@greenledger.in</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

      toast.success('QR Code sent to printer!');
      updateQRStats('print');
    } catch (error) {
      toast.error('Failed to print QR Code');
      console.error('Print error:', error);
    }
  };

  // Copy QR data to clipboard
  const handleCopyQRData = () => {
    if (!qrData) return;

    const qrText = JSON.stringify(qrData, null, 2);
    navigator.clipboard.writeText(qrText).then(() => {
      toast.success('QR data copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy QR data');
    });
  };

  // Update QR statistics
  const updateQRStats = (action: 'download' | 'print') => {
    try {
      const history = JSON.parse(localStorage.getItem('farmer-qr-history') || '[]');
      if (history.length > 0) {
        if (action === 'download') {
          history[0].downloadCount = (history[0].downloadCount || 0) + 1;
        } else {
          history[0].printCount = (history[0].printCount || 0) + 1;
        }
        localStorage.setItem('farmer-qr-history', JSON.stringify(history));
      }
    } catch (error) {
      console.warn('Error updating QR stats:', error);
    }
  };

  if (!qrData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <QrCode className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Generating farmer QR code...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-green-600" />
          Your Farmer QR Code
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Official Identity
          </Badge>
        </CardTitle>
        <p className="text-muted-foreground">
          Your unique QR code for product verification and farmer identification
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            {isGenerating ? (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <QrCode className="w-8 h-8 text-gray-400" />
                </motion.div>
              </div>
            ) : (
              <div className="w-32 h-32 bg-white border-2 border-green-200 rounded-lg p-2 shadow-lg">
                {qrImageUrl ? (
                  <img 
                    src={qrImageUrl} 
                    alt="Farmer QR Code" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            )}

            {/* Verification Badge */}
            {qrData.verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
              >
                <CheckCircle className="w-4 h-4" />
              </motion.div>
            )}
          </motion.div>

          {/* Quick Info */}
          <div className="text-center">
            <p className="font-semibold text-green-700">{qrData.uzhavarPin}</p>
            <p className="text-sm text-muted-foreground">{qrData.name}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQRDialog(true)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadQR}
            className="flex items-center gap-2"
            disabled={isGenerating}
          >
            <Download className="w-4 h-4" />
            Download
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintQR}
            className="flex items-center gap-2"
            disabled={isGenerating}
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyQRData}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Data
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-semibold text-green-700">Crops</p>
            <p className="text-lg font-bold text-green-600">{qrData.crops.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-green-700">Land</p>
            <p className="text-lg font-bold text-green-600">{qrData.landSize.split(' ')[0]}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-green-700">Status</p>
            <p className="text-lg font-bold text-green-600">
              {qrData.verified ? '✅' : '⏳'}
            </p>
          </div>
        </div>
      </CardContent>

      {/* QR Details Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-green-600" />
              Farmer QR Code Details
            </DialogTitle>
            <DialogDescription>
              View and manage your farmer QR code with complete details and download options.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Large QR Code */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-white border-2 border-green-200 rounded-lg p-4 shadow-lg">
                {qrImageUrl ? (
                  <img 
                    src={qrImageUrl} 
                    alt="Farmer QR Code" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Information */}
            <div className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Farmer Name</p>
                    <p className="font-semibold">{qrData.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Uzhavar PIN</p>
                    <p className="font-semibold font-mono">{qrData.uzhavarPin}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{qrData.district}, {qrData.state}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Wheat className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Crops & Land</p>
                    <p className="font-semibold">{qrData.crops.join(', ')} • {qrData.landSize}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Warehouse</p>
                    <p className="font-semibold">{qrData.warehouseId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Hash className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Blockchain Hash</p>
                    <p className="font-semibold font-mono text-xs">{qrData.blockchainTxHash}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleDownloadQR}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>

              <Button
                onClick={handlePrintQR}
                variant="outline"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print QR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}