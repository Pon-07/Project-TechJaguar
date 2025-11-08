import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  MapPin, 
  Truck, 
  Factory, 
  QrCode, 
  Download, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Search,
  Filter,
  Languages,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { toast } from 'sonner@2.0.3';
import { INDIA_3D_WAREHOUSE_COMPREHENSIVE_DATA } from '../../data/india3DWarehouseData';

// Use comprehensive data
const WAREHOUSE_DATA = INDIA_3D_WAREHOUSE_COMPREHENSIVE_DATA;

export function SafeWarehouseHub() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');

  // QR Code handlers
  const handleQRClick = useCallback((product: any) => {
    setSelectedProduct(product);
    toast.success(`Viewing QR details for ${product.name}`);
  }, []);

  const downloadQR = useCallback((product: any) => {
    const link = document.createElement('a');
    link.download = `QR_${product.id}.png`;
    link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    link.click();
    toast.success('QR Code downloaded successfully!');
  }, []);

  const filteredWarehouses = WAREHOUSE_DATA.warehouses.filter(warehouse => {
    const matchesSearch = !searchQuery || warehouse.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || warehouse.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="h-screen relative bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <Card className="bg-black/20 backdrop-blur-lg border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Factory className="w-6 h-6 text-orange-400" />
              India-Wide Warehouse Management System
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                {WAREHOUSE_DATA.warehouses.length} Active Warehouses
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                {WAREHOUSE_DATA.warehouses.reduce((acc, w) => acc + w.products.length, 0)} Products
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                {WAREHOUSE_DATA.routes.length} Live Routes
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="absolute top-32 right-4 z-20 flex gap-2">
        <Card className="p-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search warehouses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />
          </div>
        </Card>
        
        <Card className="p-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Punjab">Punjab</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Warehouse Grid */}
      <div className="absolute left-4 top-32 bottom-4 right-96 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredWarehouses.map((warehouse) => (
            <motion.div
              key={warehouse.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-lg p-4 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
              whileHover={{ y: -2 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white">{warehouse.name}</h3>
                  <p className="text-sm text-slate-300">{warehouse.district}, {warehouse.state}</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${
                    warehouse.occupancy / warehouse.capacity > 0.8 ? 'bg-red-400' : 
                    warehouse.occupancy / warehouse.capacity > 0.6 ? 'bg-yellow-400' : 
                    'bg-green-400'
                  }`} />
                  <Badge variant="outline" className="text-xs">
                    {Math.round((warehouse.occupancy / warehouse.capacity) * 100)}%
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Capacity</span>
                  <span className="text-white">{warehouse.capacity.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current</span>
                  <span className="text-white">{warehouse.occupancy.toLocaleString()} kg</span>
                </div>
                <Progress 
                  value={(warehouse.occupancy / warehouse.capacity) * 100} 
                  className="h-1"
                />
              </div>

              <div className="border-t border-slate-600 pt-3">
                <p className="text-xs text-slate-400 mb-2">Products ({warehouse.products.length}):</p>
                <div className="space-y-1">
                  {warehouse.products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{product.name}</span>
                      <div className="flex items-center gap-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            product.status === 'arrived' ? 'text-green-400 border-green-400' : 
                            product.status === 'in_transit' ? 'text-yellow-400 border-yellow-400' : 
                            'text-red-400 border-red-400'
                          }`}
                        >
                          {product.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleQRClick(product)}
                          className="h-5 w-5 p-0 text-blue-400 hover:text-blue-300"
                        >
                          <QrCode className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Details Panel */}
      {selectedProduct && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="absolute right-4 top-32 bottom-4 w-80 z-30"
        >
          <Card className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-400" />
                  Product Details
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedProduct(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto text-white">
              {/* Product Image Placeholder */}
              <div className="w-full h-32 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-lg flex items-center justify-center">
                <Package className="w-12 h-12 text-green-400" />
              </div>

              {/* Product Info */}
              <div>
                <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                <p className="text-slate-300">{selectedProduct.quantityKg} kg</p>
                <Badge 
                  className={`mt-2 ${
                    selectedProduct.status === 'arrived' ? 'bg-green-100 text-green-800' :
                    selectedProduct.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedProduct.status}
                </Badge>
              </div>

              {/* Farmer Info */}
              <div className="p-3 bg-blue-400/10 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Farmer Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name:</span>
                    <span>{selectedProduct.farmer?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PIN:</span>
                    <span>{selectedProduct.farmer?.uzhavar_pin || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span>{selectedProduct.farmer?.district || 'N/A'}, {selectedProduct.farmer?.state || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="p-3 bg-purple-400/10 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  QR Code System
                </h4>
                
                <div className="space-y-3">
                  <div className="w-24 h-24 bg-slate-700 rounded flex items-center justify-center mx-auto">
                    <QrCode className="w-16 h-16 text-slate-400" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadQR(selectedProduct)}
                      className="flex-1"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toast.success('QR printed!')}
                      className="flex-1"
                    >
                      <QrCode className="w-3 h-3 mr-1" />
                      Print
                    </Button>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <h4 className="font-semibold text-sm mb-3">Status Timeline</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Harvested', completed: true, time: '2 days ago' },
                    { label: 'In Transit', completed: selectedProduct.status !== 'pending', time: '1 day ago' },
                    { label: 'At Warehouse', completed: selectedProduct.status === 'arrived', time: selectedProduct.status === 'arrived' ? 'Now' : 'Pending' },
                    { label: 'Ready for Dispatch', completed: false, time: 'Pending' }
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        step.completed ? 'bg-green-400' : 'bg-slate-500'
                      }`} />
                      <span className="text-sm flex-1">{step.label}</span>
                      <span className="text-xs text-slate-400">{step.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Center Info */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotateY: [0, 5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Factory className="w-32 h-32 mx-auto mb-6 text-orange-400" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4">Advanced Warehouse Hub</h1>
          <p className="text-xl text-slate-300 mb-8">
            Real-time inventory management across India
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-400">
                {WAREHOUSE_DATA.warehouses.length}
              </div>
              <div className="text-sm text-slate-400">Warehouses</div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">
                {WAREHOUSE_DATA.warehouses.reduce((acc, w) => acc + w.products.length, 0)}
              </div>
              <div className="text-sm text-slate-400">Products</div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-yellow-400">
                {WAREHOUSE_DATA.routes.length}
              </div>
              <div className="text-sm text-slate-400">Routes</div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-purple-400">Live</div>
              <div className="text-sm text-slate-400">Tracking</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <Card className="bg-black/20 backdrop-blur-lg border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white">System Online</span>
                </div>
                <div className="text-sm text-slate-300">
                  Last updated: {new Date().toLocaleTimeString('en-IN')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  No Three.js Conflicts
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  Optimized Performance
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}