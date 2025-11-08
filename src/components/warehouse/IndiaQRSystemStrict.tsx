import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  QrCode, 
  Plus, 
  History, 
  Download, 
  Eye, 
  Shield, 
  Package, 
  User, 
  Factory,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Copy,
  ExternalLink
} from 'lucide-react';
import { indiaWarehousesData } from '../../data/indiaWideWarehouseData';
import { getCropDisplay } from '../../data/cropImages';
import { toast } from 'sonner@2.0.3';

interface QREntry {
  id: string;
  productName: string;
  cropImage: string;
  farmerName: string;
  farmerLocation: string;
  warehouseName: string;
  warehouseLocation: string;
  blockchainTx: string;
  qrImage: string; // STRICT: Must always have an image
  generatedAt: string;
  generatedBy: string;
  status: 'active' | 'scanned' | 'expired';
  scanCount: number;
  notes?: string;
}

// Generate dummy QR images
function generateDummyQRImage(productName: string, id: string): string {
  const qrData = `QR-${productName.toUpperCase()}-${id}`;
  // This creates a simple SVG QR code placeholder
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#fff"/>
      <rect x="10" y="10" width="20" height="20" fill="#000"/>
      <rect x="30" y="10" width="20" height="20" fill="#000"/>
      <rect x="50" y="10" width="20" height="20" fill="#000"/>
      <rect x="10" y="30" width="20" height="20" fill="#000"/>
      <rect x="50" y="30" width="20" height="20" fill="#000"/>
      <rect x="10" y="50" width="20" height="20" fill="#000"/>
      <rect x="30" y="50" width="20" height="20" fill="#000"/>
      <rect x="50" y="50" width="20" height="20" fill="#000"/>
      
      <rect x="130" y="10" width="20" height="20" fill="#000"/>
      <rect x="150" y="10" width="20" height="20" fill="#000"/>
      <rect x="170" y="10" width="20" height="20" fill="#000"/>
      <rect x="130" y="30" width="20" height="20" fill="#000"/>
      <rect x="170" y="30" width="20" height="20" fill="#000"/>
      <rect x="130" y="50" width="20" height="20" fill="#000"/>
      <rect x="150" y="50" width="20" height="20" fill="#000"/>
      <rect x="170" y="50" width="20" height="20" fill="#000"/>
      
      <rect x="10" y="130" width="20" height="20" fill="#000"/>
      <rect x="30" y="130" width="20" height="20" fill="#000"/>
      <rect x="50" y="130" width="20" height="20" fill="#000"/>
      <rect x="10" y="150" width="20" height="20" fill="#000"/>
      <rect x="50" y="150" width="20" height="20" fill="#000"/>
      <rect x="10" y="170" width="20" height="20" fill="#000"/>
      <rect x="30" y="170" width="20" height="20" fill="#000"/>
      <rect x="50" y="170" width="20" height="20" fill="#000"/>
      
      <!-- Random pattern for uniqueness -->
      <rect x="90" y="90" width="20" height="20" fill="#000"/>
      <rect x="110" y="70" width="20" height="20" fill="#000"/>
      <rect x="70" y="110" width="20" height="20" fill="#000"/>
      
      <text x="100" y="195" text-anchor="middle" font-size="10" fill="#666">${qrData}</text>
    </svg>
  `)}`;
}

// Generate initial QR history from warehouse data
function generateInitialQRHistory(): QREntry[] {
  const qrEntries: QREntry[] = [];
  
  // Take first 50 inventory items from warehouses for demo
  let count = 0;
  for (const warehouse of indiaWarehousesData.warehouses) {
    if (count >= 50) break;
    
    for (const item of warehouse.inventory.slice(0, 2)) {
      if (count >= 50) break;
      
      const id = `QR-${warehouse.state.substring(0,2).toUpperCase()}${warehouse.district.substring(0,2).toUpperCase()}-${String(count + 1).padStart(4, '0')}`;
      
      qrEntries.push({
        id,
        productName: item.name,
        cropImage: item.crop_image,
        farmerName: item.origin_farmer.name,
        farmerLocation: `${warehouse.district}, ${warehouse.state}`,
        warehouseName: warehouse.name,
        warehouseLocation: `${warehouse.district}, ${warehouse.state}`,
        blockchainTx: item.blockchain_tx,
        qrImage: generateDummyQRImage(item.name, id), // STRICT: Always has image
        generatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        generatedBy: warehouse.manager.name,
        status: ['active', 'scanned', 'expired'][Math.floor(Math.random() * 3)] as 'active' | 'scanned' | 'expired',
        scanCount: Math.floor(Math.random() * 20),
        notes: Math.random() > 0.7 ? 'Quality verified and approved for distribution' : undefined
      });
      
      count++;
    }
  }
  
  return qrEntries.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
}

export function IndiaQRSystemStrict() {
  const [qrHistory, setQRHistory] = useState<QREntry[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QREntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'scanned' | 'expired'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStats, setGenerationStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    active: 0
  });

  // Form data for generating new QR
  const [formData, setFormData] = useState({
    productName: '',
    farmerName: '',
    farmerLocation: '',
    warehouseName: '',
    warehouseLocation: '',
    notes: ''
  });

  useEffect(() => {
    const history = generateInitialQRHistory();
    setQRHistory(history);
    
    // Calculate stats
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    setGenerationStats({
      total: history.length,
      today: history.filter(qr => new Date(qr.generatedAt) >= today).length,
      thisWeek: history.filter(qr => new Date(qr.generatedAt) >= weekAgo).length,
      active: history.filter(qr => qr.status === 'active').length
    });
  }, []);

  const handleGenerateQR = async () => {
    // STRICT VALIDATION: All fields must be filled
    if (!formData.productName || !formData.farmerName || !formData.farmerLocation || 
        !formData.warehouseName || !formData.warehouseLocation) {
      toast.error('❌ All fields are required for QR generation!');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate QR generation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newId = `QR-IND-${String(qrHistory.length + 1).padStart(4, '0')}`;
      const newQR: QREntry = {
        id: newId,
        productName: formData.productName,
        cropImage: getCropDisplay(formData.productName).emoji,
        farmerName: formData.farmerName,
        farmerLocation: formData.farmerLocation,
        warehouseName: formData.warehouseName,
        warehouseLocation: formData.warehouseLocation,
        blockchainTx: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
        qrImage: generateDummyQRImage(formData.productName, newId), // STRICT: Always generate image
        generatedAt: new Date().toISOString(),
        generatedBy: 'Warehouse Manager',
        status: 'active',
        scanCount: 0,
        notes: formData.notes || undefined
      };

      setQRHistory(prev => [newQR, ...prev]);
      setGenerationStats(prev => ({
        ...prev,
        total: prev.total + 1,
        today: prev.today + 1,
        thisWeek: prev.thisWeek + 1,
        active: prev.active + 1
      }));
      
      // Reset form
      setFormData({
        productName: '',
        farmerName: '',
        farmerLocation: '',
        warehouseName: '',
        warehouseLocation: '',
        notes: ''
      });
      
      setShowGenerateModal(false);
      toast.success(`✅ QR Code generated successfully! ID: ${newId}`);
      
      // Show success notification with QR preview
      setTimeout(() => {
        toast.success('🔗 QR Code with dummy image ready for use!', {
          description: `Product: ${formData.productName} | Farmer: ${formData.farmerName}`,
          duration: 5000
        });
      }, 500);
      
    } catch (error) {
      toast.error('❌ Failed to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredQRHistory = qrHistory.filter(qr => {
    const matchesSearch = searchQuery === '' || 
      qr.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qr.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qr.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || qr.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: QREntry['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'scanned': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('📋 Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <QrCode className="w-8 h-8" />
            India QR System - Strict Workflow
          </CardTitle>
          <p className="text-purple-100">
            Every QR code must have a dummy image • Zero tolerance for missing QR images
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{generationStats.total}</div>
              <div className="text-sm text-purple-100">Total QR Codes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{generationStats.today}</div>
              <div className="text-sm text-purple-100">Generated Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{generationStats.thisWeek}</div>
              <div className="text-sm text-purple-100">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{generationStats.active}</div>
              <div className="text-sm text-purple-100">Active QRs</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={() => setShowGenerateModal(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Generate QR Code
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowHistoryModal(true)}
          size="lg"
        >
          <History className="w-5 h-5 mr-2" />
          View QR History ({qrHistory.length})
        </Button>
      </div>

      {/* Recent QR Codes Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Recent QR Codes (All with Images ✅)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qrHistory.slice(0, 6).map((qr) => (
              <motion.div
                key={qr.id}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedQR(qr)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{qr.cropImage}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">{qr.id}</span>
                      <Badge className={`text-xs ${getStatusColor(qr.status)}`}>
                        {qr.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>{qr.productName}</div>
                      <div>{qr.farmerName}</div>
                      <div>{qr.farmerLocation}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-8 h-8 border-2 border-dashed border-green-300 rounded flex items-center justify-center">
                        <QrCode className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-xs text-green-600 font-semibold">✅ Image Ready</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate QR Modal */}
      <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <QrCode className="w-6 h-6 text-green-600" />
              Generate New QR Code (Strict Mode)
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded-lg mt-2">
              <AlertCircle className="w-4 h-4" />
              All fields are required. Every QR will automatically include a dummy image.
            </div>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  placeholder="e.g. Rice, Wheat, Cotton"
                  value={formData.productName}
                  onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="farmerName">Farmer Name *</Label>
                <Input
                  id="farmerName"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.farmerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, farmerName: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="farmerLocation">Farmer Location (State, District) *</Label>
                <Input
                  id="farmerLocation"
                  placeholder="e.g. Tamil Nadu, Chennai"
                  value={formData.farmerLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, farmerLocation: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="warehouseName">Warehouse Name *</Label>
                <Input
                  id="warehouseName"
                  placeholder="e.g. Chennai Central Warehouse"
                  value={formData.warehouseName}
                  onChange={(e) => setFormData(prev => ({ ...prev, warehouseName: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="warehouseLocation">Warehouse Location *</Label>
                <Input
                  id="warehouseLocation"
                  placeholder="e.g. Chennai, Tamil Nadu"
                  value={formData.warehouseLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, warehouseLocation: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional information about the product"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Strict QR Generation Rules</span>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✅ Dummy QR image will be automatically generated</li>
              <li>✅ Blockchain transaction hash will be created</li>
              <li>✅ Unique QR ID will be assigned</li>
              <li>✅ All data will be logged in QR history</li>
            </ul>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowGenerateModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateQR}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-600 to-emerald-600"
            >
              {isGenerating ? (
                <>
                  <motion.div 
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Generating QR...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate QR Code
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <History className="w-6 h-6 text-blue-600" />
              QR Code History ({filteredQRHistory.length} records)
            </DialogTitle>
            
            {/* Search and Filter */}
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by product, farmer, or QR ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {(['all', 'active', 'scanned', 'expired'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-96">
            <div className="space-y-3">
              {filteredQRHistory.map((qr) => (
                <motion.div
                  key={qr.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* QR Image and Basic Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center bg-purple-50">
                        <img 
                          src={qr.qrImage} 
                          alt={`QR for ${qr.productName}`} 
                          className="w-14 h-14 object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{qr.cropImage}</span>
                          <span className="font-semibold">{qr.productName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{qr.id}</div>
                        <Badge className={`text-xs ${getStatusColor(qr.status)}`}>
                          {qr.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Farmer & Warehouse Info */}
                    <div className="space-y-2">
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {qr.farmerName}
                        </div>
                        <div className="text-xs text-muted-foreground">{qr.farmerLocation}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-1">
                          <Factory className="w-3 h-3" />
                          {qr.warehouseName}
                        </div>
                        <div className="text-xs text-muted-foreground">{qr.warehouseLocation}</div>
                      </div>
                    </div>
                    
                    {/* Blockchain & Stats */}
                    <div className="space-y-2">
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Blockchain Tx
                        </div>
                        <div className="text-xs font-mono bg-gray-100 p-1 rounded">{qr.blockchainTx}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Scanned: {qr.scanCount} times
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Generated: {new Date(qr.generatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(qr.blockchainTx)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedQR(qr)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {qr.notes && (
                    <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                      <strong>Notes:</strong> {qr.notes}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected QR Detail Modal */}
      {selectedQR && (
        <Dialog open={!!selectedQR} onOpenChange={() => setSelectedQR(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="text-3xl">{selectedQR.cropImage}</div>
                QR Code Details - {selectedQR.id}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-purple-600" />
                    QR Code Image (Strict Compliance ✅)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-48 h-48 mx-auto border-2 border-purple-300 rounded-lg flex items-center justify-center bg-purple-50">
                    <img 
                      src={selectedQR.qrImage} 
                      alt={`QR for ${selectedQR.productName}`} 
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Dummy QR image with unique pattern for {selectedQR.productName}
                  </p>
                  <div className="flex gap-2 justify-center mt-3">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Details */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Product & Farmer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div><strong>Product:</strong> {selectedQR.productName}</div>
                    <div><strong>Farmer:</strong> {selectedQR.farmerName}</div>
                    <div><strong>Farmer Location:</strong> {selectedQR.farmerLocation}</div>
                    <div><strong>Warehouse:</strong> {selectedQR.warehouseName}</div>
                    <div><strong>Warehouse Location:</strong> {selectedQR.warehouseLocation}</div>
                    <div><strong>Status:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(selectedQR.status)}`}>
                        {selectedQR.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Blockchain & Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <strong>Blockchain Tx:</strong>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                        {selectedQR.blockchainTx}
                      </div>
                    </div>
                    <div><strong>Generated:</strong> {new Date(selectedQR.generatedAt).toLocaleString()}</div>
                    <div><strong>Generated By:</strong> {selectedQR.generatedBy}</div>
                    <div><strong>Scan Count:</strong> {selectedQR.scanCount} times</div>
                    {selectedQR.notes && (
                      <div>
                        <strong>Notes:</strong>
                        <div className="bg-blue-50 p-2 rounded mt-1">{selectedQR.notes}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}