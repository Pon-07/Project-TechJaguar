import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { QrCode, Download, Printer, Shield, MapPin, Calendar, Leaf } from 'lucide-react';
import { QRProduct } from '../../data/qrProducts';

interface QRCodeGeneratorProps {
  product: QRProduct;
  onPrint?: () => void;
  onDownload?: () => void;
}

export function QRCodeGenerator({ product, onPrint, onDownload }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate QR code data URL (mock implementation)
  const generateQRCode = (data: string) => {
    // In a real implementation, use a QR code library like qrcode
    // For now, we'll use a placeholder
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  };

  const qrData = JSON.stringify({
    qrCodeId: product.qrCodeId,
    blockchainId: product.blockchainId,
    productId: product.id
  });

  const qrCodeUrl = generateQRCode(qrData);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${product.qrCodeId}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDownload?.();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Uzhavar QR Code - ${product.qrCodeId}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
              .qr-container { border: 2px solid #22c55e; padding: 20px; margin: 20px auto; width: 300px; }
              .qr-code { width: 200px; height: 200px; margin: 0 auto; }
              .product-info { margin-top: 20px; text-align: left; }
              .header { color: #22c55e; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2 class="header">🌾 Greenledger Uzhavar QR Code</h2>
              <img src="${qrCodeUrl}" class="qr-code" alt="QR Code" />
              <div class="product-info">
                <p><strong>QR ID:</strong> ${product.qrCodeId}</p>
                <p><strong>Farmer:</strong> ${product.farmerName}</p>
                <p><strong>Crop:</strong> ${product.cropType}</p>
                <p><strong>Quantity:</strong> ${product.quantity} ${product.unit}</p>
                <p><strong>Harvest:</strong> ${new Date(product.harvestDate).toLocaleDateString()}</p>
                <p><strong>Blockchain:</strong> ${product.blockchainId}</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    onPrint?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <QrCode className="w-5 h-5" />
            Uzhavar QR Code
            {product.verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* QR Code Display */}
          <div ref={qrRef} className="flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-md border-2 border-green-200">
              <img 
                src={qrCodeUrl} 
                alt={`QR Code for ${product.qrCodeId}`}
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* Product Summary */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-green-600" />
                <span className="font-medium">QR ID:</span>
                <Badge variant="outline" className="text-xs">{product.qrCodeId}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Blockchain:</span>
                <Badge variant="outline" className="text-xs">{product.blockchainId}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="font-medium">Crop:</span>
                <span>{product.cropType}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span className="font-medium">Taluk:</span>
                <span>{product.taluk}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="font-medium">Harvest:</span>
                <span>{new Date(product.harvestDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Quantity:</span>
                <span>{product.quantity} {product.unit}</span>
              </div>
            </div>
          </div>

          {/* Quality Indicators */}
          <div className="flex gap-2 justify-center">
            <Badge 
              variant={product.qualityGrade === 'A+' ? 'default' : 'secondary'}
              className={product.qualityGrade === 'A+' ? 'bg-green-600' : ''}
            >
              Grade {product.qualityGrade}
            </Badge>
            {product.organicCertified && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                🌱 Organic
              </Badge>
            )}
            <Badge variant="outline" className="text-green-700">
              Carbon: {product.carbonFootprint}kg CO₂
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleDownload}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR
            </Button>
            <Button 
              onClick={handlePrint}
              variant="outline"
              className="flex-1 border-green-600 text-green-700 hover:bg-green-50"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Label
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
            <p className="text-amber-800">
              <strong>Instructions:</strong> Attach this QR code to your product packaging. 
              Consumers can scan it to view complete product details, farmer information, 
              and blockchain verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}