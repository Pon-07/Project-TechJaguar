import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  QrCode, 
  Download, 
  Printer, 
  Shield, 
  MapPin, 
  Calendar, 
  Package,
  Warehouse,
  User,
  Hash,
  Clock,
  Sparkles
} from 'lucide-react';
import { Warehouse as WarehouseType, InventoryItem } from '../../data/warehouses';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface WarehouseQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse: WarehouseType;
  inventoryItem: InventoryItem;
  farmerName?: string;
}

export function WarehouseQRModal({ 
  isOpen, 
  onClose, 
  warehouse, 
  inventoryItem,
  farmerName = "Ramesh Kumar" // Default farmer name for demo
}: WarehouseQRModalProps) {
  const { t } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate QR code data URL (mock implementation)
  const generateQRCode = (data: string) => {
    // In a real implementation, use a QR code library like qrcode
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  };

  const qrData = JSON.stringify({
    productId: inventoryItem.item_id,
    productName: inventoryItem.name,
    farmerName: farmerName,
    warehouseId: warehouse.warehouse_id,
    taluk: warehouse.taluk,
    district: warehouse.district,
    dateStored: new Date().toISOString().split('T')[0],
    batchId: inventoryItem.batch_id,
    blockchainId: inventoryItem.blockchain_contract_id,
    type: "warehouse_product"
  });

  const qrCodeUrl = generateQRCode(qrData);
  const currentDate = new Date().toLocaleDateString();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${inventoryItem.item_id}-warehouse-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Save to QR history (mock implementation)
      const qrHistoryItem = {
        id: `QR-${Date.now()}`,
        productId: inventoryItem.item_id,
        productName: inventoryItem.name,
        farmerName: farmerName,
        warehouseId: warehouse.warehouse_id,
        taluk: warehouse.taluk,
        district: warehouse.district,
        dateGenerated: new Date().toISOString(),
        qrCodeUrl: qrCodeUrl
      };
      
      // In a real app, this would be saved to database/local storage
      const existingHistory = JSON.parse(localStorage.getItem('warehouseQRHistory') || '[]');
      existingHistory.unshift(qrHistoryItem);
      localStorage.setItem('warehouseQRHistory', JSON.stringify(existingHistory.slice(0, 50))); // Keep last 50
      
      toast.success(`${t('qr.downloadCode')} - ${inventoryItem.name}`);
    } catch (error) {
      toast.error('Failed to download QR code');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>GreenLedger Warehouse QR - ${inventoryItem.item_id}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                text-align: center; 
                background: linear-gradient(135deg, #f0fdf4 0%, #fef3c7 100%);
              }
              .qr-container { 
                border: 3px solid #16a34a; 
                padding: 30px; 
                margin: 20px auto; 
                width: 400px; 
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              }
              .qr-code { 
                width: 200px; 
                height: 200px; 
                margin: 0 auto 20px; 
                border: 2px solid #16a34a;
                border-radius: 10px;
                padding: 10px;
                background: white;
              }
              .header { 
                color: #16a34a; 
                margin-bottom: 20px; 
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
              }
              .product-info { 
                margin-top: 20px; 
                text-align: left; 
                font-size: 14px;
                line-height: 1.6;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 5px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .info-label {
                font-weight: bold;
                color: #374151;
              }
              .info-value {
                color: #16a34a;
                font-weight: 600;
              }
              .blockchain-badge {
                background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                display: inline-block;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2 class="header">🌾 GreenLedger Warehouse QR Code</h2>
              <img src="${qrCodeUrl}" class="qr-code" alt="QR Code" />
              <div class="product-info">
                <div class="info-row">
                  <span class="info-label">Product ID:</span>
                  <span class="info-value">${inventoryItem.item_id}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Product Name:</span>
                  <span class="info-value">${inventoryItem.name} (${inventoryItem.variety})</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Farmer Name:</span>
                  <span class="info-value">${farmerName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Warehouse ID:</span>
                  <span class="info-value">${warehouse.warehouse_id}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Location:</span>
                  <span class="info-value">${warehouse.taluk}, ${warehouse.district}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Date Stored:</span>
                  <span class="info-value">${currentDate}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Batch ID:</span>
                  <span class="info-value">${inventoryItem.batch_id}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Blockchain:</span>
                  <span class="blockchain-badge">${inventoryItem.blockchain_contract_id}</span>
                </div>
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <QrCode className="w-5 h-5" />
            {t('qr.warehouseCode')}
            <Badge variant="secondary" className="bg-green-100 text-green-700 ml-2">
              <Shield className="w-3 h-3 mr-1" />
              Blockchain Verified
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Generate and manage QR codes for warehouse products with blockchain verification and farmer details
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* QR Code Display */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-amber-50">
            <CardContent className="p-6">
              <div className="flex justify-center mb-6">
                <motion.div 
                  className="bg-white p-4 rounded-xl shadow-lg border-2 border-green-200 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Animated border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-20 animate-pulse"></div>
                  <div className="absolute inset-[2px] bg-white rounded-lg"></div>
                  
                  <img 
                    src={qrCodeUrl} 
                    alt={`QR Code for ${inventoryItem.item_id}`}
                    className="w-48 h-48 relative z-10"
                  />
                  
                  {/* Sparkle effects */}
                  <motion.div
                    className="absolute top-2 right-2 text-yellow-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  <motion.div
                    className="absolute bottom-2 left-2 text-blue-400"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-3 h-3" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Product Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                    <Hash className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{t('qr.productId')}:</span>
                    <Badge variant="outline" className="text-xs font-mono">{inventoryItem.item_id}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{t('qr.productName')}:</span>
                    <span className="text-blue-700 font-semibold">{inventoryItem.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                    <User className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">{t('qr.farmerName')}:</span>
                    <span className="text-orange-700 font-semibold">{farmerName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                    <Hash className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">{t('qr.batchId')}:</span>
                    <Badge variant="outline" className="text-xs font-mono">{inventoryItem.batch_id}</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                    <Warehouse className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{t('qr.warehouseId')}:</span>
                    <Badge variant="outline" className="text-xs font-mono">{warehouse.warehouse_id}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="font-medium">{t('qr.talukDistrict')}:</span>
                    <span className="text-red-700">{warehouse.taluk}, {warehouse.district}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span className="font-medium">{t('qr.dateStored')}:</span>
                    <span className="text-amber-700">{currentDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-100">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">Blockchain:</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs font-mono">
                      {inventoryItem.blockchain_contract_id.slice(0, 12)}...
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quality & Certification Badges */}
              <div className="flex gap-2 justify-center mt-6 flex-wrap">
                <Badge 
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Grade A+ Quality
                </Badge>
                {inventoryItem.organic_cert === 'Yes' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    🌱 Organic Certified
                  </Badge>
                )}
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Carbon: {inventoryItem.carbon_saved_kg}kg CO₂ Saved
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Clock className="w-3 h-3 mr-1" />
                  Fresh Stock
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 bg-green-600 hover:bg-green-700 h-12"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Downloading...' : t('qr.downloadCode')}
            </Button>
            <Button 
              onClick={handlePrint}
              variant="outline"
              className="flex-1 border-green-600 text-green-700 hover:bg-green-50 h-12"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Label
            </Button>
          </div>

          {/* Instructions */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Warehouse QR Code Instructions
              </h4>
              <ul className="space-y-1 text-sm text-amber-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <span>Attach this QR code to product packaging before dispatch</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <span>Consumers can scan to view complete supply chain details</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <span>Blockchain verification ensures product authenticity</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <span>Tracks product journey from farm to consumer</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}