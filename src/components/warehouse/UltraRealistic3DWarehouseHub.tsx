import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Camera, 
  Settings, 
  Search, 
  Filter, 
  Languages, 
  Download, 
  Printer, 
  QrCode, 
  History, 
  Truck, 
  Package, 
  MapPin, 
  Eye, 
  Mic, 
  Target, 
  Zap, 
  AlertTriangle,
  Leaf,
  Trophy,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  Star,
  Sparkle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { toast } from 'sonner@2.0.3';
import { indiaWarehousesData } from '../../data/indiaWideWarehouseData';
import { StrictQRPopupSystem } from './StrictQRPopupSystem';
import { Mobile2DWarehouseFallback } from './Mobile2DWarehouseFallback';
import { INDIA_3D_WAREHOUSE_COMPREHENSIVE_DATA, Product3D } from '../../data/india3DWarehouseData';
import { useThreeJSSingleton } from '../../contexts/ThreeJSSingleton';

// Use comprehensive data instead of inline data
const INDIA_3D_WAREHOUSE_DATA = INDIA_3D_WAREHOUSE_COMPREHENSIVE_DATA;

// Main Component
export function UltraRealistic3DWarehouseHub() {
  const { isLoaded: threeLoaded, error: threeError, isLoading: threeLoading } = useThreeJSSingleton();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  const [cameraMode, setCameraMode] = useState<'overview' | 'follow' | 'first-person'>('overview');
  const [playbackTime, setPlaybackTime] = useState([0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState('en');
  const [performanceMode, setPerformanceMode] = useState(false);
  const [arMode, setArMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showPredictive, setShowPredictive] = useState(true);
  const [showCarbonFootprint, setShowCarbonFootprint] = useState(true);

  // Performance monitoring
  const [loadTime, setLoadTime] = useState(0);
  const loadStartTime = useRef(Date.now());

  useEffect(() => {
    // Wait for Three.js to load first or if there's an error, proceed anyway
    if (!threeLoaded && !threeError) return;
    
    // Simulate progressive loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLoadTime(Date.now() - loadStartTime.current);
      if (loadTime > 800) {
        toast.warning(`Load time: ${loadTime}ms - Consider performance mode`);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [threeLoaded, threeError, loadTime]);

  // QR Code popup handler
  const handleQRClick = useCallback((product: any) => {
    if (!product.qrImage) {
      toast.error('QR Image missing! Flagged for generation.');
      return;
    }
    setSelectedProduct(product);
  }, []);

  // Generate new QR code
  const generateQR = useCallback((product: any) => {
    const newQR = {
      id: `QR-${product.id}-${Date.now()}`,
      image: `qr_${product.id}_${Date.now()}.png`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    // Simulate QR generation with shimmer effect
    toast.success('QR Code generated with shimmer effect!');
    
    // Add to history
    if (!product.qrHistory) product.qrHistory = [];
    product.qrHistory.push(newQR);
    product.qrImage = newQR.image;
  }, []);

  // Download/Print QR handlers
  const downloadQR = useCallback((product: any) => {
    // Simulate download
    const link = document.createElement('a');
    link.download = `QR_${product.id}.png`;
    link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    link.click();
    toast.success('QR Code downloaded successfully!');
  }, []);

  const printQR = useCallback((product: any) => {
    window.print();
    toast.success('Print dialog opened for QR Code!');
  }, []);

  // Voice command handler
  const handleVoiceCommand = useCallback((command: string) => {
    if (command.includes('show shipments')) {
      const state = command.split('to ')[1];
      if (state) {
        setSelectedState(state);
        toast.success(`Showing shipments to ${state}`);
      }
    } else if (command.includes('follow truck')) {
      setCameraMode('follow');
      toast.success('Following vehicle in 3D view');
    } else if (command.includes('generate qr')) {
      toast.success('Voice command: Generate QR activated');
    }
  }, []);

  // Mobile detection
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading Ultra-Realistic 3D Warehouse Hub...</p>
          <p className="text-sm text-muted-foreground">
            {threeError ? 'Falling back to 2D mode...' : 'Progressive loading: Low-poly → High-poly'}
          </p>
        </div>
      </div>
    );
  }

  // Mobile fallback to 2D map
  if (isMobile && !performanceMode) {
    return (
      <Mobile2DWarehouseFallback 
        onEnable3D={() => setPerformanceMode(true)}
      />
    );
  }

  // If Three.js failed to load, show 2D fallback
  if (threeError || !threeLoaded) {
    return (
      <div className="h-screen relative bg-slate-900 overflow-hidden">
        {/* Error Message */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                3D Mode Unavailable
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {threeError ? 
                  'Failed to load 3D graphics engine. Using fallback mode.' :
                  'Loading 3D engine... Please wait.'
                }
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Retry 3D Mode
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Fallback 2D visualization */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center text-white">
            <Package className="w-24 h-24 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-2">Warehouse Management System</h2>
            <p className="text-slate-300 mb-6">3D Visualization Loading...</p>
            
            {/* Simple stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-slate-800 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {INDIA_3D_WAREHOUSE_DATA.warehouses.length}
                </div>
                <div className="text-xs text-slate-400">Warehouses</div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {INDIA_3D_WAREHOUSE_DATA.warehouses.reduce((acc, w) => acc + w.products.length, 0)}
                </div>
                <div className="text-xs text-slate-400">Products</div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {INDIA_3D_WAREHOUSE_DATA.routes.length}
                </div>
                <div className="text-xs text-slate-400">Routes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main 3D interface (currently showing fallback until Three.js is properly loaded)
  return (
    <div className="h-screen relative bg-slate-900 overflow-hidden">
      {/* Top HUD */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Card className="p-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search state/district/product..."
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
                <SelectItem value="Punjab">Punjab</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-2">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <Switch
              checked={performanceMode}
              onCheckedChange={setPerformanceMode}
            />
            <span className="text-xs">Performance</span>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Package className="w-32 h-32 mx-auto mb-6 text-green-500" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4">Ultra-Realistic 3D Warehouse</h1>
          <p className="text-xl text-slate-300 mb-8">
            {threeLoaded ? 
              '3D Engine Ready - Initializing Scene...' :
              'Loading 3D Graphics Engine...'
            }
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <motion.div 
              className="bg-slate-800 p-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-green-400">
                {INDIA_3D_WAREHOUSE_DATA.warehouses.length}
              </div>
              <div className="text-sm text-slate-400">Warehouses</div>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800 p-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-blue-400">
                {INDIA_3D_WAREHOUSE_DATA.warehouses.reduce((acc, w) => acc + w.products.length, 0)}
              </div>
              <div className="text-sm text-slate-400">Products</div>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800 p-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-yellow-400">
                {INDIA_3D_WAREHOUSE_DATA.routes.length}
              </div>
              <div className="text-sm text-slate-400">Routes</div>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800 p-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-purple-400">Live</div>
              <div className="text-sm text-slate-400">Tracking</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Loading Progress */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"
              />
              <span className="text-sm">
                {threeLoaded ? 'Initializing 3D Scene...' : 'Loading 3D Engine...'}
              </span>
            </div>
            <Progress value={threeLoaded ? 75 : 25} className="w-32" />
          </div>
        </Card>
      </div>
    </div>
  );
}