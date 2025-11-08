import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Package, 
  QrCode, 
  Truck, 
  Search, 
  Filter, 
  Navigation, 
  Zap, 
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Download,
  Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { toast } from 'sonner@2.0.3';
import { INDIA_3D_WAREHOUSE_COMPREHENSIVE_DATA, Product3D } from '../../data/india3DWarehouseData';
import { StrictQRPopupSystem } from './StrictQRPopupSystem';

interface Mobile2DWarehouseFallbackProps {
  onEnable3D: () => void;
}

export function Mobile2DWarehouseFallback({ onEnable3D }: Mobile2DWarehouseFallbackProps) {
  const [selectedState, setSelectedState] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product3D | null>(null);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [expandedWarehouse, setExpandedWarehouse] = useState<string | null>(null);

  // Filter warehouses based on search and state
  const filteredWarehouses = INDIA_3D_WAREHOUSE_COMPREHENSIVE_DATA.warehouses.filter(warehouse => {
    const matchesState = !selectedState || warehouse.state === selectedState;
    const matchesSearch = !searchQuery || 
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesState && matchesSearch;
  });

  // Get unique states for filter
  const states = Array.from(new Set(INDIA_3D_WAREHOUSE_COMPREHENSIVE_DATA.warehouses.map(w => w.state))).sort();

  // Handle QR code click
  const handleQRClick = useCallback((product: Product3D) => {
    setSelectedProduct(product);
    setShowQRPopup(true);
  }, []);

  // QR actions
  const handleGenerateQR = useCallback((product: Product3D) => {
    const newQR = {
      id: `QR-${product.id}-${Date.now()}`,
      image: `qr_${product.id}_${Date.now()}.png`,
      createdAt: new Date().toISOString(),
      status: 'active' as const,
      scanCount: 0
    };
    
    product.qrHistory.push(newQR);
    product.qrImage = newQR.image;
    
    toast.success('QR Code generated successfully!', {
      description: 'New QR added to history with blockchain verification'
    });
  }, []);

  const handleDownloadQR = useCallback((product: Product3D) => {
    const link = document.createElement('a');
    link.download = `QR_${product.id}.png`;
    link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    link.click();
    toast.success('QR Code downloaded!');
  }, []);

  const handlePrintQR = useCallback((product: Product3D) => {
    window.print();
    toast.success('Print dialog opened!');
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-yellow-100 text-yellow-800';
      case 'dispatched': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'arrived': return <CheckCircle className="w-3 h-3" />;
      case 'delayed': return <AlertTriangle className="w-3 h-3" />;
      default: return <Truck className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                2D Warehouse Map
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Mobile-optimized view with identical QR functionality
              </p>
            </div>
            <Button onClick={onEnable3D} size="sm" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Enable 3D
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search warehouses, districts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All States</SelectItem>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {filteredWarehouses.length}
              </div>
              <div className="text-xs text-muted-foreground">Warehouses</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {filteredWarehouses.reduce((sum, w) => sum + w.products.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Products</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(filteredWarehouses.reduce((sum, w) => sum + (w.occupancy / w.capacity * 100), 0) / filteredWarehouses.length || 0)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg. Occupancy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warehouse List */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4">
          {filteredWarehouses.map((warehouse) => (
            <motion.div
              key={warehouse.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <Card>
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setExpandedWarehouse(
                    expandedWarehouse === warehouse.id ? null : warehouse.id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{warehouse.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {warehouse.district}, {warehouse.state}
                          </p>
                        </div>
                      </div>
                      
                      {/* Occupancy bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Occupancy</span>
                          <span>{Math.round((warehouse.occupancy / warehouse.capacity) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${(warehouse.occupancy / warehouse.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {warehouse.products.length} products
                      </Badge>
                      {expandedWarehouse === warehouse.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Expanded Content */}
                {expandedWarehouse === warehouse.id && (
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    
                    {/* Warehouse Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold">
                          {(warehouse.capacity / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-muted-foreground">Capacity (kg)</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold">
                          {(warehouse.occupancy / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-muted-foreground">Current (kg)</div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Products ({warehouse.products.length})
                      </h4>
                      
                      {warehouse.products.map((product) => (
                        <motion.div
                          key={product.id}
                          className="p-3 border rounded-lg bg-white"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <h5 className="font-semibold text-sm">{product.name}</h5>
                              <p className="text-xs text-muted-foreground">
                                {product.farmer.name} • {product.farmer.district}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(product.status)}>
                                {getStatusIcon(product.status)}
                                {product.status.replace('_', ' ').toLowerCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Qty:</span>
                              <span className="ml-1 font-semibold">
                                {(product.quantityKg / 1000).toFixed(1)}K kg
                              </span>
                            </div>
                            
                            {/* QR Code Button - MANDATORY */}
                            <div className="flex items-center gap-2">
                              {product.qrImage ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQRClick(product)}
                                  className="flex items-center gap-1"
                                >
                                  <QrCode className="w-3 h-3" />
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleQRClick(product)}
                                  className="flex items-center gap-1"
                                >
                                  <QrCode className="w-3 h-3" />
                                  <AlertTriangle className="w-3 h-3" />
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                className="flex items-center gap-1"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Product details */}
                          <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Vehicle: {product.shipment.vehicle}</span>
                              <span>ETA: {product.shipment.eta}</span>
                            </div>
                            {product.qrHistory && (
                              <div className="mt-1">
                                QR History: {product.qrHistory.length} entries
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Predictive Analytics */}
                    {warehouse.predictiveAnalytics && (
                      <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                        <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Predictive Analytics
                        </h5>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">Expected Deliveries:</span>
                            <div className="font-semibold">
                              {warehouse.predictiveAnalytics.expectedDeliveries}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Utilization:</span>
                            <div className="font-semibold">
                              {warehouse.predictiveAnalytics.capacityUtilization}%
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Badge 
                            variant="outline"
                            className={
                              warehouse.predictiveAnalytics.alertLevel === 'high' ? 'text-red-600' :
                              warehouse.predictiveAnalytics.alertLevel === 'medium' ? 'text-yellow-600' :
                              'text-green-600'
                            }
                          >
                            {warehouse.predictiveAnalytics.alertLevel.toUpperCase()} Priority
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Strict QR Popup System */}
      <StrictQRPopupSystem
        product={selectedProduct}
        isOpen={showQRPopup}
        onClose={() => setShowQRPopup(false)}
        onGenerateQR={handleGenerateQR}
        onDownloadQR={handleDownloadQR}
        onPrintQR={handlePrintQR}
      />

      {/* Quick Action Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <Button 
          size="sm" 
          className="rounded-full w-12 h-12"
          onClick={() => toast.info('Voice commands activated')}
        >
          🎤
        </Button>
        <Button 
          size="sm" 
          className="rounded-full w-12 h-12"
          onClick={() => window.location.reload()}
        >
          ↻
        </Button>
      </div>
    </div>
  );
}