import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Share, 
  History, 
  X, 
  User, 
  MapPin, 
  Package, 
  Truck, 
  Calendar, 
  Hash, 
  CheckCircle, 
  AlertTriangle,
  Sparkles,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { Product3D, QRHistoryEntry } from '../../data/india3DWarehouseData';

interface StrictQRPopupProps {
  product: Product3D | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateQR: (product: Product3D) => void;
  onDownloadQR: (product: Product3D, qrEntry?: QRHistoryEntry) => void;
  onPrintQR: (product: Product3D, qrEntry?: QRHistoryEntry) => void;
}

export function StrictQRPopupSystem({
  product,
  isOpen,
  onClose,
  onGenerateQR,
  onDownloadQR,
  onPrintQR
}: StrictQRPopupProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'generate'>('details');
  const [selectedQR, setSelectedQR] = useState<QRHistoryEntry | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle QR generation with shimmer effect
  const handleGenerateQR = useCallback(async () => {
    if (!product) return;
    
    setIsGenerating(true);
    
    // Simulate shimmer effect duration
    setTimeout(() => {
      onGenerateQR(product);
      setIsGenerating(false);
      toast.success('QR Code generated with shimmer effect!', {
        description: 'New QR added to history with blockchain verification',
        action: {
          label: 'View History',
          onClick: () => setActiveTab('history')
        }
      });
    }, 550); // 550ms shimmer + particle sparkles as per spec
  }, [product, onGenerateQR]);

  // Handle download with validation
  const handleDownload = useCallback((qrEntry?: QRHistoryEntry) => {
    if (!product) return;
    
    if (!product.qrImage && !qrEntry?.image) {
      toast.error('QR Image missing! Cannot download.', {
        description: 'This is flagged as a critical error requiring immediate attention.'
      });
      return;
    }
    
    onDownloadQR(product, qrEntry);
    toast.success('QR Code downloaded successfully!');
  }, [product, onDownloadQR]);

  // Handle print with validation
  const handlePrint = useCallback((qrEntry?: QRHistoryEntry) => {
    if (!product) return;
    
    if (!product.qrImage && !qrEntry?.image) {
      toast.error('QR Image missing! Cannot print.', {
        description: 'This is flagged as a critical error requiring immediate attention.'
      });
      return;
    }
    
    onPrintQR(product, qrEntry);
    toast.success('Print dialog opened for QR Code!');
  }, [product, onPrintQR]);

  // Copy blockchain transaction hash
  const handleCopyTxHash = useCallback(() => {
    if (!product?.txHash) return;
    
    navigator.clipboard.writeText(product.txHash);
    toast.success('Blockchain TxHash copied to clipboard!');
  }, [product?.txHash]);

  // Share QR functionality
  const handleShare = useCallback(async () => {
    if (!product) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code - ${product.name}`,
          text: `Product: ${product.name}\nFarmer: ${product.farmer.name}\nLocation: ${product.farmer.district}, ${product.farmer.state}`,
          url: `https://greenledger.app/qr/${product.id}`
        });
        toast.success('QR details shared successfully!');
      } catch (error) {
        toast.error('Share failed');
      }
    } else {
      // Fallback for browsers without native share
      navigator.clipboard.writeText(`QR Code for ${product.name} - ${product.farmer.name} from ${product.farmer.district}, ${product.farmer.state}`);
      toast.success('QR details copied to clipboard!');
    }
  }, [product]);

  if (!product) return null;

  const hasQRImage = Boolean(product.qrImage);
  const qrHistoryCount = product.qrHistory?.length || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <QrCode className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">QR Code System</h2>
                    <p className="text-sm text-muted-foreground">
                      {product.name} • {product.farmer.name}
                    </p>
                  </div>
                </div>
                
                {/* QR Status Indicator */}
                <div className="flex items-center gap-2">
                  {hasQRImage ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      QR Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      QR Missing
                    </Badge>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Product Details
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  QR History ({qrHistoryCount})
                </TabsTrigger>
                <TabsTrigger value="generate" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate QR
                </TabsTrigger>
              </TabsList>

              {/* Product Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Product Info */}
                  <div className="space-y-4">
                    {/* Product Image */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="w-full h-48 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                          <div className="text-center">
                            <Package className="w-16 h-16 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">{product.image}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-semibold">{product.quantityKg.toLocaleString()} kg</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge 
                              className={
                                product.status === 'arrived' ? 'bg-green-100 text-green-800' :
                                product.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' :
                                product.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {product.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Farmer Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <User className="w-4 h-4" />
                          Farmer Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-semibold">{product.farmer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uzhavar PIN:</span>
                          <span className="font-mono text-sm bg-blue-50 px-2 py-1 rounded">
                            {product.farmer.uzhavar_pin.replace(/UZP-(\w+)-(.{2})(\d+)/, 'UZP-$1-••$3')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <div className="text-right">
                            <div className="font-semibold">{product.farmer.district}</div>
                            <div className="text-sm text-muted-foreground">{product.farmer.state}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Warehouse Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <MapPin className="w-4 h-4" />
                          Warehouse Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-semibold">{product.warehouse.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <div className="text-right">
                            <div className="font-semibold">{product.warehouse.district}</div>
                            <div className="text-sm text-muted-foreground">{product.warehouse.state}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - QR & Blockchain */}
                  <div className="space-y-4">
                    {/* Current QR Code */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <QrCode className="w-4 h-4" />
                          Current QR Code
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {hasQRImage ? (
                          <div className="space-y-4">
                            {/* QR Code Display */}
                            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                              <div className="w-32 h-32 bg-black rounded mx-auto flex items-center justify-center">
                                <QrCode className="w-24 h-24 text-white" />
                              </div>
                              <p className="text-xs text-center mt-2 text-muted-foreground">
                                {product.qrImage}
                              </p>
                            </div>

                            {/* QR Actions */}
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownload()}
                                className="flex items-center gap-2"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePrint()}
                                className="flex items-center gap-2"
                              >
                                <Printer className="w-3 h-3" />
                                Print
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={handleCopyTxHash}
                                className="flex items-center gap-2"
                              >
                                <Copy className="w-3 h-3" />
                                Copy Hash
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={handleShare}
                                className="flex items-center gap-2"
                              >
                                <Share className="w-3 h-3" />
                                Share
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-red-600 mb-2">QR Image Missing!</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              This product is missing its QR code image. This is flagged as a critical error.
                            </p>
                            <Button 
                              variant="destructive"
                              onClick={handleGenerateQR}
                              disabled={isGenerating}
                              className="flex items-center gap-2"
                            >
                              {isGenerating ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <QrCode className="w-4 h-4" />
                              )}
                              Generate QR Now
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Blockchain Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Hash className="w-4 h-4" />
                          Blockchain Verification
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm text-muted-foreground">Transaction Hash:</label>
                          <div className="font-mono text-xs bg-purple-50 p-2 rounded mt-1 break-all">
                            {product.txHash}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Block Height:</span>
                          <span className="font-mono text-sm">#{Math.floor(Math.random() * 1000000)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Shipment Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Truck className="w-4 h-4" />
                          Shipment Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipment ID:</span>
                          <span className="font-mono text-sm">{product.shipment.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vehicle:</span>
                          <span className="font-semibold">{product.shipment.vehicle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ETA:</span>
                          <span className="font-semibold text-green-600">{product.shipment.eta}</span>
                        </div>
                        {product.shipment.route && (
                          <div>
                            <span className="text-muted-foreground">Route:</span>
                            <div className="text-sm mt-1">{product.shipment.route}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* QR History Tab */}
              <TabsContent value="history" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">QR Code History</h3>
                  <Badge variant="outline">{qrHistoryCount} QR codes generated</Badge>
                </div>
                
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {product.qrHistory?.map((qr, index) => (
                      <motion.div
                        key={qr.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`cursor-pointer transition-all ${
                          selectedQR?.id === qr.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                                  <QrCode className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                  <div className="font-mono text-sm font-semibold">{qr.id}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(qr.createdAt).toLocaleDateString()} at{' '}
                                    {new Date(qr.createdAt).toLocaleTimeString()}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={qr.status === 'active' ? 'default' : 'secondary'}
                                  className={
                                    qr.status === 'active' ? 'bg-green-100 text-green-800' :
                                    qr.status === 'used' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {qr.status}
                                </Badge>
                                {qr.scanCount && (
                                  <Badge variant="outline">
                                    <Eye className="w-3 h-3 mr-1" />
                                    {qr.scanCount}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="text-xs text-muted-foreground mb-3">
                              Image: {qr.image}
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownload(qr)}
                                className="flex-1"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePrint(qr)}
                                className="flex-1"
                              >
                                <Printer className="w-3 h-3 mr-1" />
                                Print
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedQR(selectedQR?.id === qr.id ? null : qr)}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    
                    {qrHistoryCount === 0 && (
                      <div className="text-center py-8">
                        <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-muted-foreground">No QR history available</p>
                        <Button 
                          size="sm" 
                          onClick={() => setActiveTab('generate')}
                          className="mt-3"
                        >
                          Generate First QR
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Generate QR Tab */}
              <TabsContent value="generate" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generate New QR Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">QR Generation Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Product:</span>
                          <span className="font-semibold">{product.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Farmer:</span>
                          <span className="font-semibold">{product.farmer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-semibold">{product.farmer.district}, {product.farmer.state}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Blockchain Hash:</span>
                          <span className="font-mono text-xs">{product.txHash}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      {isGenerating ? (
                        <motion.div
                          className="p-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto mb-4"
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 180, 360],
                            }}
                            transition={{ 
                              duration: 0.55,
                              ease: "easeInOut"
                            }}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-white" />
                            </div>
                          </motion.div>
                          <p className="text-lg font-semibold">Generating QR Code...</p>
                          <p className="text-sm text-muted-foreground">Shimmer effect with 40 particle sparkles</p>
                        </motion.div>
                      ) : (
                        <div className="p-8">
                          <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <QrCode className="w-8 h-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Ready to Generate</h3>
                          <p className="text-muted-foreground mb-4">
                            Generate a new QR code with blockchain verification and add it to the history.
                          </p>
                          <Button 
                            onClick={handleGenerateQR}
                            className="flex items-center gap-2"
                            size="lg"
                          >
                            <Sparkles className="w-4 h-4" />
                            Generate QR Code
                          </Button>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="text-xs text-muted-foreground">
                      <h4 className="font-semibold mb-2">Generation Process:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>550ms shimmer effect with particle sparkles (40 particles)</li>
                        <li>Blockchain verification and hash generation</li>
                        <li>QR image creation and storage</li>
                        <li>Addition to QR history with timestamp</li>
                        <li>Confetti animation on successful completion</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}