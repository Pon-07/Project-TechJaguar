import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { 
  History, 
  QrCode, 
  Download, 
  Printer, 
  Eye,
  Calendar,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface QRHistoryEntry {
  type: 'farmer';
  id: string;
  name: string;
  uzhavarPin: string;
  aadhaarNumber: string;
  state: string;
  district: string;
  crops: string[];
  landSize: string;
  warehouseId: string;
  blockchainTxHash: string;
  phoneNumber: string;
  verified: boolean;
  generatedAt: string;
  imageUrl: string;
  downloadCount: number;
  printCount: number;
  scanCount?: number;
  lastScanned?: string;
}

export function FarmerQRHistory() {
  const [qrHistory, setQrHistory] = useState<QRHistoryEntry[]>([]);
  const [selectedQR, setSelectedQR] = useState<QRHistoryEntry | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | 'recent' | 'popular'>('all');

  // Load QR history
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('farmer-qr-history') || '[]');
      setQrHistory(history);
    } catch (error) {
      console.warn('Error loading QR history:', error);
      setQrHistory([]);
    }
  }, []);

  // Filter history
  const filteredHistory = qrHistory.filter(entry => {
    switch (filter) {
      case 'recent':
        return new Date(entry.generatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      case 'popular':
        return (entry.downloadCount || 0) + (entry.printCount || 0) > 0;
      default:
        return true;
    }
  });

  // Download QR from history
  const handleDownloadQR = async (entry: QRHistoryEntry) => {
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
        `Name: ${entry.name}`,
        `Uzhavar PIN: ${entry.uzhavarPin}`,
        `District: ${entry.district}`,
        `Crops: ${entry.crops.join(', ')}`,
        `Land: ${entry.landSize}`,
        `Warehouse: ${entry.warehouseId}`,
        `Generated: ${new Date(entry.generatedAt).toLocaleDateString()}`
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
          a.download = `farmer-qr-${entry.uzhavarPin}-${new Date(entry.generatedAt).toISOString().split('T')[0]}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast.success('QR Code downloaded successfully!');
          
          // Update download count
          updateQRStats(entry.id, 'download');
        }
      }, 'image/png');
    } catch (error) {
      toast.error('Failed to download QR Code');
      console.error('Download error:', error);
    }
  };

  // Print QR from history
  const handlePrintQR = (entry: QRHistoryEntry) => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Farmer QR Code - ${entry.name}</title>
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
            <p>Generated: ${new Date(entry.generatedAt).toLocaleDateString()}</p>
          </div>
          
          <div class="qr-container">
            <div class="qr-code">
              <div style="text-align: center;">
                <div style="font-size: 48px; margin-bottom: 10px;">⚫⚪⚫⚪</div>
                <div style="font-size: 48px; margin-bottom: 10px;">⚪⚫⚪⚫</div>
                <div style="font-size: 48px; margin-bottom: 10px;">⚫⚪⚫⚪</div>
                <div style="font-size: 12px; color: #666;">${entry.uzhavarPin}</div>
              </div>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Farmer Name:</span> ${entry.name}
              </div>
              <div class="detail-row">
                <span class="label">Uzhavar PIN:</span> ${entry.uzhavarPin}
              </div>
              <div class="detail-row">
                <span class="label">Location:</span> ${entry.district}, ${entry.state}
              </div>
              <div class="detail-row">
                <span class="label">Crops:</span> ${entry.crops.join(', ')}
              </div>
              <div class="detail-row">
                <span class="label">Land Size:</span> ${entry.landSize}
              </div>
              <div class="detail-row">
                <span class="label">Warehouse:</span> ${entry.warehouseId}
              </div>
              <div class="detail-row">
                <span class="label">Blockchain Hash:</span> ${entry.blockchainTxHash.substring(0, 20)}...
              </div>
            </div>
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
      updateQRStats(entry.id, 'print');
    } catch (error) {
      toast.error('Failed to print QR Code');
      console.error('Print error:', error);
    }
  };

  // Update QR statistics
  const updateQRStats = (qrId: string, action: 'download' | 'print') => {
    try {
      const history = JSON.parse(localStorage.getItem('farmer-qr-history') || '[]');
      const updatedHistory = history.map((entry: QRHistoryEntry) => {
        if (entry.id === qrId) {
          if (action === 'download') {
            return { ...entry, downloadCount: (entry.downloadCount || 0) + 1 };
          } else {
            return { ...entry, printCount: (entry.printCount || 0) + 1 };
          }
        }
        return entry;
      });
      
      localStorage.setItem('farmer-qr-history', JSON.stringify(updatedHistory));
      setQrHistory(updatedHistory);
    } catch (error) {
      console.warn('Error updating QR stats:', error);
    }
  };

  // Delete QR from history
  const handleDeleteQR = (qrId: string) => {
    try {
      const history = JSON.parse(localStorage.getItem('farmer-qr-history') || '[]');
      const updatedHistory = history.filter((entry: QRHistoryEntry) => entry.id !== qrId);
      
      localStorage.setItem('farmer-qr-history', JSON.stringify(updatedHistory));
      setQrHistory(updatedHistory);
      
      toast.success('QR Code removed from history');
    } catch (error) {
      toast.error('Failed to delete QR Code');
      console.error('Delete error:', error);
    }
  };

  // View QR details
  const handleViewQR = (entry: QRHistoryEntry) => {
    setSelectedQR(entry);
    setShowQRDialog(true);
  };

  // Calculate total stats
  const totalDownloads = qrHistory.reduce((sum, entry) => sum + (entry.downloadCount || 0), 0);
  const totalPrints = qrHistory.reduce((sum, entry) => sum + (entry.printCount || 0), 0);
  const totalScans = qrHistory.reduce((sum, entry) => sum + (entry.scanCount || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            QR Code History
            <Badge variant="secondary">{qrHistory.length} QR codes</Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            View, download, and manage your previously generated QR codes
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <QrCode className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{qrHistory.length}</p>
              <p className="text-sm text-blue-700">Total QR Codes</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <Download className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{totalDownloads}</p>
              <p className="text-sm text-green-700">Downloads</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <Printer className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">{totalPrints}</p>
              <p className="text-sm text-purple-700">Prints</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600">{totalScans}</p>
              <p className="text-sm text-orange-700">Scans</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All QR Codes
            </Button>
            <Button
              variant={filter === 'recent' ? 'default' : 'outline'}
              onClick={() => setFilter('recent')}
              size="sm"
            >
              Recent (7 days)
            </Button>
            <Button
              variant={filter === 'popular' ? 'default' : 'outline'}
              onClick={() => setFilter('popular')}
              size="sm"
            >
              Most Used
            </Button>
          </div>

          {/* QR History List */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No QR Codes Found</h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'Generate your first QR code from your profile page'
                  : `No QR codes match the "${filter}" filter`
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredHistory.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* QR Preview */}
                          <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center">
                            {entry.imageUrl ? (
                              <img 
                                src={entry.imageUrl} 
                                alt="QR Code" 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <QrCode className="w-8 h-8 text-gray-400" />
                            )}
                          </div>

                          {/* QR Info */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{entry.uzhavarPin}</h4>
                              {entry.verified && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {entry.name} • {entry.district}, {entry.state}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(entry.generatedAt).toLocaleDateString()}
                              </span>
                              <span>↓ {entry.downloadCount || 0}</span>
                              <span>🖨️ {entry.printCount || 0}</span>
                              {entry.scanCount && <span>👁️ {entry.scanCount}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewQR(entry)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadQR(entry)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrintQR(entry)}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQR(entry.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Details Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-green-600" />
              QR Code Details
            </DialogTitle>
            <DialogDescription>
              View detailed information about this QR code including usage statistics and farmer details.
            </DialogDescription>
          </DialogHeader>

          {selectedQR && (
            <div className="space-y-6">
              {/* Large QR Code */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white border-2 border-green-200 rounded-lg p-4 shadow-lg">
                  {selectedQR.imageUrl ? (
                    <img 
                      src={selectedQR.imageUrl} 
                      alt="QR Code" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Uzhavar PIN</p>
                  <p className="font-semibold font-mono">{selectedQR.uzhavarPin}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Farmer Name</p>
                  <p className="font-semibold">{selectedQR.name}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{selectedQR.district}, {selectedQR.state}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Crops</p>
                  <p className="font-semibold">{selectedQR.crops.join(', ')}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Generated</p>
                  <p className="font-semibold">{new Date(selectedQR.generatedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{selectedQR.downloadCount || 0}</p>
                  <p className="text-xs text-blue-700">Downloads</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{selectedQR.printCount || 0}</p>
                  <p className="text-xs text-purple-700">Prints</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-orange-600">{selectedQR.scanCount || 0}</p>
                  <p className="text-xs text-orange-700">Scans</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleDownloadQR(selectedQR)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <Button
                  onClick={() => handlePrintQR(selectedQR)}
                  variant="outline"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}