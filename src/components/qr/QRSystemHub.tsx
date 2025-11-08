import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { 
  QrCode, 
  Scan, 
  Download, 
  History, 
  Plus,
  Package,
  User,
  MapPin,
  Calendar,
  Hash,
  Truck,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  indiaWideQRCodes, 
  QRCodeData, 
  indiaWideFarmers, 
  indiaWideWarehouses,
  getCropImage 
} from '../../data/indiaWideData';
import { toast } from 'sonner@2.0.3';

interface QRSystemHubProps {
  userType: 'farmer' | 'warehouse' | 'consumer';
  currentUser?: any;
}

export function QRSystemHub({ userType, currentUser }: QRSystemHubProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('generate');
  const [qrHistory, setQRHistory] = useState<QRCodeData[]>(indiaWideQRCodes);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newQRData, setNewQRData] = useState({
    productName: '',
    farmerName: '',
    farmerState: '',
    farmerDistrict: '',
    warehouseName: '',
    warehouseState: '',
    warehouseDistrict: '',
    quantity: '',
    price: '',
    harvestDate: '',
    expiryDate: ''
  });

  // Simulate real-time QR updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new QR codes being generated
      if (Math.random() > 0.7) {
        const newQR: QRCodeData = {
          id: `QR${Date.now()}`,
          type: userType,
          productName: ['Rice', 'Wheat', 'Cotton', 'Groundnut'][Math.floor(Math.random() * 4)],
          farmerName: indiaWideFarmers[Math.floor(Math.random() * indiaWideFarmers.length)].name,
          farmerState: indiaWideFarmers[Math.floor(Math.random() * indiaWideFarmers.length)].state,
          farmerDistrict: indiaWideFarmers[Math.floor(Math.random() * indiaWideFarmers.length)].district,
          warehouseName: indiaWideWarehouses[Math.floor(Math.random() * indiaWideWarehouses.length)].name,
          warehouseState: indiaWideWarehouses[Math.floor(Math.random() * indiaWideWarehouses.length)].state,
          warehouseDistrict: indiaWideWarehouses[Math.floor(Math.random() * indiaWideWarehouses.length)].district,
          quantity: Math.floor(Math.random() * 100) + 10,
          price: Math.floor(Math.random() * 200) + 20,
          harvestDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          blockchainHash: `0x${Math.random().toString(16).substr(2, 32).toUpperCase()}`,
          qrCode: `QR${Date.now()}_${userType.toUpperCase()}`,
          generatedAt: new Date().toISOString(),
          status: 'active'
        };
        
        setQRHistory(prev => [newQR, ...prev.slice(0, 49)]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [userType]);

  const handleGenerateQR = () => {
    if (!newQRData.productName || !newQRData.quantity || !newQRData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const qrData: QRCodeData = {
        id: `QR${Date.now()}`,
        type: userType,
        productName: newQRData.productName,
        farmerName: newQRData.farmerName || currentUser?.name || 'Unknown Farmer',
        farmerState: newQRData.farmerState || currentUser?.state || 'Unknown State',
        farmerDistrict: newQRData.farmerDistrict || currentUser?.district || 'Unknown District',
        warehouseName: newQRData.warehouseName || 'Local Warehouse',
        warehouseState: newQRData.warehouseState || currentUser?.state || 'Unknown State',
        warehouseDistrict: newQRData.warehouseDistrict || currentUser?.district || 'Unknown District',
        quantity: parseInt(newQRData.quantity),
        price: parseFloat(newQRData.price),
        harvestDate: newQRData.harvestDate || new Date().toISOString().split('T')[0],
        expiryDate: newQRData.expiryDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        blockchainHash: `0x${Math.random().toString(16).substr(2, 32).toUpperCase()}`,
        qrCode: `${newQRData.productName.toUpperCase()}_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        status: 'active'
      };

      setQRHistory(prev => [qrData, ...prev]);
      setNewQRData({
        productName: '',
        farmerName: '',
        farmerState: '',
        farmerDistrict: '',
        warehouseName: '',
        warehouseState: '',
        warehouseDistrict: '',
        quantity: '',
        price: '',
        harvestDate: '',
        expiryDate: ''
      });
      setIsGenerating(false);
      
      toast.success(t('notification.qrGenerated'), {
        description: `${qrData.productName} - ${qrData.quantity}kg`,
        duration: 3000
      });
    }, 2000);
  };

  const filteredQRHistory = qrHistory.filter(qr => {
    const matchesSearch = qr.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qr.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qr.warehouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qr.blockchainHash.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || qr.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDownloadQR = (qrData: QRCodeData) => {
    // Create QR code content
    const qrContent = {
      id: qrData.id,
      product: qrData.productName,
      farmer: qrData.farmerName,
      location: `${qrData.farmerDistrict}, ${qrData.farmerState}`,
      warehouse: qrData.warehouseName,
      quantity: `${qrData.quantity}kg`,
      price: `₹${qrData.price}/kg`,
      harvest: qrData.harvestDate,
      blockchain: qrData.blockchainHash,
      timestamp: qrData.generatedAt
    };

    // Create download link
    const dataStr = JSON.stringify(qrContent, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `QR_${qrData.productName}_${qrData.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('QR Code data downloaded');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'used':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Used</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <QrCode className="w-6 h-6" />
            QR Code System - {userType.charAt(0).toUpperCase() + userType.slice(1)} Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('qr.generateCode')}
              </TabsTrigger>
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <Scan className="w-4 h-4" />
                {t('qr.scanCode')}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                {t('qr.history')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Product Information</h3>
                  
                  <div>
                    <Label htmlFor="productName">Product Name *</Label>
                    <Select value={newQRData.productName} onValueChange={(value) => setNewQRData(prev => ({ ...prev, productName: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Groundnut">Groundnut</SelectItem>
                        <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="Maize">Maize</SelectItem>
                        <SelectItem value="Coffee">Coffee</SelectItem>
                        <SelectItem value="Spices">Spices</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Quantity (kg) *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Enter quantity"
                        value={newQRData.quantity}
                        onChange={(e) => setNewQRData(prev => ({ ...prev, quantity: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price per kg (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="Enter price"
                        value={newQRData.price}
                        onChange={(e) => setNewQRData(prev => ({ ...prev, price: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="harvestDate">Harvest Date</Label>
                      <Input
                        id="harvestDate"
                        type="date"
                        value={newQRData.harvestDate}
                        onChange={(e) => setNewQRData(prev => ({ ...prev, harvestDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={newQRData.expiryDate}
                        onChange={(e) => setNewQRData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Farmer & Warehouse Info</h3>
                  
                  <div>
                    <Label htmlFor="farmerName">Farmer Name</Label>
                    <Input
                      id="farmerName"
                      placeholder="Auto-filled from profile"
                      value={newQRData.farmerName || currentUser?.name || ''}
                      onChange={(e) => setNewQRData(prev => ({ ...prev, farmerName: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmerState">State</Label>
                      <Input
                        id="farmerState"
                        placeholder="Auto-filled"
                        value={newQRData.farmerState || currentUser?.state || ''}
                        onChange={(e) => setNewQRData(prev => ({ ...prev, farmerState: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="farmerDistrict">District</Label>
                      <Input
                        id="farmerDistrict"
                        placeholder="Auto-filled"
                        value={newQRData.farmerDistrict || currentUser?.district || ''}
                        onChange={(e) => setNewQRData(prev => ({ ...prev, farmerDistrict: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="warehouseName">Warehouse</Label>
                    <Select value={newQRData.warehouseName} onValueChange={(value) => setNewQRData(prev => ({ ...prev, warehouseName: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        {indiaWideWarehouses.map(warehouse => (
                          <SelectItem key={warehouse.id} value={warehouse.name}>
                            {warehouse.name} - {warehouse.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleGenerateQR}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating QR Code...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        {t('qr.generateCode')}
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scan" className="space-y-6 mt-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Scan className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">QR Code Scanner</h3>
                <p className="text-gray-600 mb-6">Scan QR codes to view product information and verify authenticity</p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Scan className="w-4 h-4 mr-2" />
                  Open Camera Scanner
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6 mt-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search QR codes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredQRHistory.map((qr, index) => (
                    <motion.div
                      key={qr.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={getCropImage(qr.productName)}
                                alt={qr.productName}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="font-semibold">{qr.productName}</h4>
                                <p className="text-sm text-gray-600">{qr.quantity}kg @ ₹{qr.price}/kg</p>
                              </div>
                            </div>
                            {getStatusBadge(qr.status)}
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="w-3 h-3" />
                              <span>{qr.farmerName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-3 h-3" />
                              <span>{qr.farmerDistrict}, {qr.farmerState}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Truck className="w-3 h-3" />
                              <span>{qr.warehouseName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(qr.generatedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Hash className="w-3 h-3" />
                              <span className="font-mono text-xs truncate">
                                {qr.blockchainHash.substr(0, 16)}...
                              </span>
                            </div>
                          </div>

                          <Separator className="my-3" />

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleDownloadQR(qr)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredQRHistory.length === 0 && (
                <div className="text-center py-12">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No QR Codes Found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}