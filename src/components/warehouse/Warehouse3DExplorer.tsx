import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Factory, 
  Navigation, 
  Maximize2, 
  RotateCcw,
  Play,
  Pause,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Package,
  Thermometer,
  Truck,
  Users,
  BarChart3,
  PieChart,
  Eye,
  Home,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Volume2,
  Settings,
  MapPin,
  Layers,
  Camera,
  Drone
} from 'lucide-react';
import { Warehouse3DControls } from './Warehouse3DControls';
import { Warehouse3DMiniMap } from './Warehouse3DMiniMap';
import { Warehouse3DAnalytics } from './Warehouse3DAnalytics';
import { Warehouse3DAlerts } from './Warehouse3DAlerts';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

type ViewMode = 'overview' | 'aisle' | 'rack' | 'control' | 'loading' | 'drone' | 'analytics' | 'alerts';

interface CameraPosition {
  x: number;
  y: number;
  z: number;
  rotation: number;
}

interface WarehouseSection {
  id: string;
  name: string;
  type: 'rack' | 'aisle' | 'control' | 'loading' | 'storage';
  position: { x: number; y: number; z: number };
  status: 'healthy' | 'warning' | 'critical';
  occupancy: number;
  items: number;
  temperature?: number;
  humidity?: number;
}

interface Rack {
  id: string;
  position: { x: number; y: number; z: number };
  items: RackItem[];
  status: 'healthy' | 'warning' | 'critical';
  occupancy: number;
}

interface RackItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: 'good' | 'expiring' | 'expired';
  expiryDate: string;
  temperature: number;
}

const mockWarehouseSections: WarehouseSection[] = [
  {
    id: 'A1',
    name: 'Grain Storage Section A',
    type: 'storage',
    position: { x: 10, y: 0, z: 10 },
    status: 'healthy',
    occupancy: 85,
    items: 124,
    temperature: 22,
    humidity: 45
  },
  {
    id: 'B1',
    name: 'Vegetable Cold Storage',
    type: 'storage',
    position: { x: 30, y: 0, z: 10 },
    status: 'warning',
    occupancy: 92,
    items: 89,
    temperature: 4,
    humidity: 95
  },
  {
    id: 'C1',
    name: 'Loading Bay Alpha',
    type: 'loading',
    position: { x: 50, y: 0, z: 5 },
    status: 'healthy',
    occupancy: 45,
    items: 23
  },
  {
    id: 'CTRL',
    name: 'Central Control Room',
    type: 'control',
    position: { x: 25, y: 8, z: 25 },
    status: 'healthy',
    occupancy: 100,
    items: 0
  }
];

const mockRacks: Rack[] = [
  {
    id: 'A12',
    position: { x: 12, y: 0, z: 8 },
    status: 'healthy',
    occupancy: 78,
    items: [
      {
        id: 'WHEAT001',
        name: 'Premium Wheat',
        quantity: 450,
        unit: 'kg',
        status: 'good',
        expiryDate: '2025-06-15',
        temperature: 22
      },
      {
        id: 'RICE001',
        name: 'Basmati Rice',
        quantity: 320,
        unit: 'kg',
        status: 'good',
        expiryDate: '2025-08-20',
        temperature: 21
      }
    ]
  },
  {
    id: 'A13',
    position: { x: 15, y: 0, z: 8 },
    status: 'warning',
    occupancy: 95,
    items: [
      {
        id: 'CORN001',
        name: 'Sweet Corn',
        quantity: 180,
        unit: 'kg',
        status: 'expiring',
        expiryDate: '2025-01-10',
        temperature: 23
      }
    ]
  }
];

export function Warehouse3DExplorer() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedSection, setSelectedSection] = useState<WarehouseSection | null>(null);
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>({
    x: 25,
    y: 15,
    z: 35,
    rotation: 0
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [droneMode, setDroneMode] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const warehouseRef = useRef<HTMLDivElement>(null);

  const handleSectionClick = (section: WarehouseSection) => {
    setSelectedSection(section);
    
    switch (section.type) {
      case 'storage':
        setViewMode('aisle');
        break;
      case 'control':
        setViewMode('control');
        break;
      case 'loading':
        setViewMode('loading');
        break;
      default:
        setViewMode('aisle');
    }

    // Animate camera to section
    animateToPosition({
      x: section.position.x,
      y: 8,
      z: section.position.z + 10,
      rotation: 0
    });
  };

  const handleRackClick = (rack: Rack) => {
    setSelectedRack(rack);
    setViewMode('rack');
    
    animateToPosition({
      x: rack.position.x,
      y: 3,
      z: rack.position.z + 5,
      rotation: 0
    });

    toast.success(`Viewing Rack ${rack.id}`);
  };

  const animateToPosition = (newPosition: CameraPosition) => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setCameraPosition(newPosition);
      setIsAnimating(false);
    }, 1000);
  };

  const toggleDroneMode = () => {
    setDroneMode(!droneMode);
    if (!droneMode) {
      setViewMode('drone');
      animateToPosition({
        x: 25,
        y: 25,
        z: 25,
        rotation: 45
      });
      toast.success('Drone camera activated');
    } else {
      setViewMode('overview');
      animateToPosition({
        x: 25,
        y: 15,
        z: 35,
        rotation: 0
      });
      toast.info('Drone camera deactivated');
    }
  };

  const resetView = () => {
    setViewMode('overview');
    setSelectedSection(null);
    setSelectedRack(null);
    setDroneMode(false);
    animateToPosition({
      x: 25,
      y: 15,
      z: 35,
      rotation: 0
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#138808'; // India Green
      case 'warning': return '#FF9933'; // Saffron
      case 'critical': return '#dc2626'; // Red
      default: return '#6b7280'; // Gray
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* 3D Warehouse Viewport */}
      <div 
        ref={warehouseRef}
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        style={{
          background: `
            radial-gradient(ellipse at center, rgba(255, 153, 51, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, rgba(11, 61, 145, 0.2) 0%, rgba(19, 136, 8, 0.1) 100%),
            #0f172a
          `
        }}
      >
        {/* Warehouse Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 153, 51, 0.3)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* 3D Warehouse Sections */}
        <div className="absolute inset-0 flex items-center justify-center perspective-1000">
          <div 
            className="relative transform-gpu transition-all duration-1000 ease-in-out"
            style={{
              transform: `
                perspective(1000px) 
                rotateX(${cameraPosition.y * 2}deg) 
                rotateY(${cameraPosition.rotation}deg)
                translateZ(${cameraPosition.z}px)
              `,
            }}
          >
            {/* Warehouse Sections */}
            {mockWarehouseSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute cursor-pointer group"
                style={{
                  left: `${section.position.x * 4}px`,
                  top: `${section.position.z * 4}px`,
                  transform: `translateZ(${section.position.y}px)`
                }}
                onClick={() => handleSectionClick(section)}
              >
                {/* 3D Section Box */}
                <div 
                  className="relative w-32 h-24 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${getStatusColor(section.status)}33, ${getStatusColor(section.status)}66)`,
                    border: `2px solid ${getStatusColor(section.status)}`,
                    borderRadius: '8px',
                    boxShadow: `
                      0 0 20px ${getStatusColor(section.status)}66,
                      inset 0 0 20px ${getStatusColor(section.status)}33
                    `
                  }}
                >
                  {/* Section Icon */}
                  <div className="absolute top-2 left-2">
                    {section.type === 'storage' && <Package className="w-5 h-5" style={{ color: getStatusColor(section.status) }} />}
                    {section.type === 'control' && <Settings className="w-5 h-5" style={{ color: getStatusColor(section.status) }} />}
                    {section.type === 'loading' && <Truck className="w-5 h-5" style={{ color: getStatusColor(section.status) }} />}
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-2 right-2">
                    <div style={{ color: getStatusColor(section.status) }}>
                      {getStatusIcon(section.status)}
                    </div>
                  </div>

                  {/* Section Info */}
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="text-xs text-white font-medium truncate">
                      {section.id}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/80">{section.occupancy}%</span>
                      <span className="text-white/80">{section.items} items</span>
                    </div>
                  </div>

                  {/* Floating Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: -5 }}
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap border"
                    style={{ borderColor: getStatusColor(section.status) }}
                  >
                    {section.name}
                  </motion.div>

                  {/* Glow Effect */}
                  <div 
                    className="absolute inset-0 rounded-lg opacity-50 animate-pulse"
                    style={{
                      background: `radial-gradient(circle, ${getStatusColor(section.status)}22 0%, transparent 70%)`
                    }}
                  />
                </div>
              </motion.div>
            ))}

            {/* Racks (when in aisle view) */}
            {viewMode === 'aisle' && mockRacks.map((rack, index) => (
              <motion.div
                key={rack.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute cursor-pointer group"
                style={{
                  left: `${rack.position.x * 4}px`,
                  top: `${rack.position.z * 4}px`,
                  transform: `translateZ(${rack.position.y}px)`
                }}
                onClick={() => handleRackClick(rack)}
              >
                <div 
                  className="relative w-20 h-16 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${getStatusColor(rack.status)}44, ${getStatusColor(rack.status)}88)`,
                    border: `1px solid ${getStatusColor(rack.status)}`,
                    borderRadius: '4px',
                    boxShadow: `0 0 15px ${getStatusColor(rack.status)}44`
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs text-white font-medium">{rack.id}</div>
                      <div className="text-xs text-white/80">{rack.occupancy}%</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Drone Mode Indicators */}
        {droneMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2"
          >
            <Badge className="bg-gradient-to-r from-[#FF9933] to-[#0B3D91] text-white px-4 py-2">
              <Drone className="w-4 h-4 mr-2" />
              Drone Camera Active
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Floating UI Elements */}
      
      {/* Main Navigation Header */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <Card className="bg-black/20 backdrop-blur-lg border border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Factory className="w-6 h-6 text-[#FF9933]" />
                  <h1 className="text-xl font-semibold text-white">3D Warehouse Explorer</h1>
                </div>
                <Badge 
                  variant="secondary" 
                  className="bg-[#0B3D91]/80 text-white border-[#0B3D91]"
                >
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933]/20"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAlerts(!showAlerts)}
                  className="border-[#138808] text-[#138808] hover:bg-[#138808]/20"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Alerts
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetView}
                  className="border-white/50 text-white hover:bg-white/20"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Controls */}
      <Warehouse3DControls 
        onMove={(direction) => {
          const step = 2;
          setCameraPosition(prev => {
            switch (direction) {
              case 'forward': return { ...prev, z: prev.z - step };
              case 'backward': return { ...prev, z: prev.z + step };
              case 'left': return { ...prev, x: prev.x - step };
              case 'right': return { ...prev, x: prev.x + step };
              case 'up': return { ...prev, y: Math.min(prev.y + step, 30) };
              case 'down': return { ...prev, y: Math.max(prev.y - step, 2) };
              case 'rotate-left': return { ...prev, rotation: prev.rotation - 15 };
              case 'rotate-right': return { ...prev, rotation: prev.rotation + 15 };
              default: return prev;
            }
          });
        }}
        droneMode={droneMode}
        onToggleDrone={toggleDroneMode}
      />

      {/* Mini Map */}
      <Warehouse3DMiniMap 
        sections={mockWarehouseSections}
        cameraPosition={cameraPosition}
        selectedSection={selectedSection}
        onSectionClick={handleSectionClick}
      />

      {/* Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && (
          <Warehouse3DAnalytics 
            onClose={() => setShowAnalytics(false)}
          />
        )}
      </AnimatePresence>

      {/* Alerts Panel */}
      <AnimatePresence>
        {showAlerts && (
          <Warehouse3DAlerts 
            onClose={() => setShowAlerts(false)}
          />
        )}
      </AnimatePresence>

      {/* Section Detail Panel */}
      <AnimatePresence>
        {selectedSection && viewMode !== 'overview' && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-4 top-24 bottom-4 w-80 z-30"
          >
            <Card className="h-full bg-black/20 backdrop-blur-lg border border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(selectedSection.status) }}
                  />
                  {selectedSection.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Status</div>
                    <div className="flex items-center gap-2">
                      <div style={{ color: getStatusColor(selectedSection.status) }}>
                        {getStatusIcon(selectedSection.status)}
                      </div>
                      <span className="capitalize">{selectedSection.status}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Occupancy</div>
                    <div className="text-xl font-semibold">{selectedSection.occupancy}%</div>
                    <Progress 
                      value={selectedSection.occupancy} 
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Items</div>
                    <div className="text-lg font-semibold">{selectedSection.items}</div>
                  </div>
                  {selectedSection.temperature && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">Temperature</div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-4 h-4 text-blue-400" />
                        <span className="text-lg font-semibold">{selectedSection.temperature}°C</span>
                      </div>
                    </div>
                  )}
                </div>

                {selectedSection.humidity && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Humidity</div>
                    <div className="text-lg font-semibold">{selectedSection.humidity}%</div>
                    <Progress 
                      value={selectedSection.humidity} 
                      className="h-2"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-white/20">
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-[#FF9933] hover:bg-[#FF9933]/80 text-white"
                      onClick={() => setViewMode('aisle')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Explore Aisles
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#0B3D91] text-[#0B3D91] hover:bg-[#0B3D91]/20"
                      onClick={() => setShowAnalytics(true)}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rack Detail Panel */}
      <AnimatePresence>
        {selectedRack && viewMode === 'rack' && (
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            className="absolute bottom-4 left-4 right-4 z-30"
          >
            <Card className="bg-black/20 backdrop-blur-lg border border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#FF9933]" />
                    Rack {selectedRack.id}
                  </div>
                  <Badge 
                    style={{ 
                      backgroundColor: `${getStatusColor(selectedRack.status)}33`,
                      borderColor: getStatusColor(selectedRack.status),
                      color: getStatusColor(selectedRack.status)
                    }}
                  >
                    {selectedRack.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FF9933]">{selectedRack.occupancy}%</div>
                    <div className="text-sm text-gray-300">Occupancy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#0B3D91]">{selectedRack.items.length}</div>
                    <div className="text-sm text-gray-300">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#138808]">
                      {selectedRack.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                    <div className="text-sm text-gray-300">Total Qty</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-[#FF9933]">Items in Rack</h4>
                  {selectedRack.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-white/10 border border-white/20"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-300">
                            {item.quantity} {item.unit} • {item.temperature}°C
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              item.status === 'good' ? 'bg-[#138808]/20 text-[#138808] border-[#138808]' :
                              item.status === 'expiring' ? 'bg-[#FF9933]/20 text-[#FF9933] border-[#FF9933]' :
                              'bg-red-500/20 text-red-500 border-red-500'
                            }
                          >
                            {item.status}
                          </Badge>
                          <div className="text-xs text-gray-400 mt-1">
                            Exp: {new Date(item.expiryDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Animation */}
      {isAnimating && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 backdrop-blur-lg rounded-lg p-6 text-center text-white"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-[#FF9933] border-t-transparent rounded-full mx-auto mb-4"
            />
            <p>Navigating to location...</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}