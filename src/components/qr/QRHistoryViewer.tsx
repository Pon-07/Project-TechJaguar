import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { 
  QrCode, 
  Download, 
  Search, 
  Calendar, 
  Package,
  Warehouse,
  User,
  Clock,
  Filter,
  FileText,
  Eye,
  Leaf,
  TrendingUp,
  MapPin,
  Shield,
  AlertTriangle,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';
import { QRHistoryEntry, qrHistoryManager } from '../../data/qrHistory';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface QRHistoryViewerProps {
  module?: 'farmer' | 'warehouse' | 'consumer' | 'all';
  farmerName?: string;
  showFilters?: boolean;
}

export function QRHistoryViewer({ module = 'all', farmerName, showFilters = true }: QRHistoryViewerProps) {
  const { t } = useLanguage();
  const [qrHistory, setQRHistory] = useState<QRHistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<QRHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'product' | 'farmer' | 'warehouse'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedEntry, setSelectedEntry] = useState<QRHistoryEntry | null>(null);
  const [showStats, setShowStats] = useState(true);

  // Load QR history on component mount
  useEffect(() => {
    loadQRHistory();
  }, [module, farmerName]);

  // Filter and sort history when search/filter criteria change
  useEffect(() => {
    applyFilters();
  }, [qrHistory, searchQuery, sortBy, filterBy]);

  const loadQRHistory = () => {
    let history = qrHistoryManager.getHistory();
    
    // Filter by module
    if (module !== 'all') {
      history = qrHistoryManager.getHistoryByModule(module);
    }
    
    // Filter by farmer
    if (farmerName) {
      history = qrHistoryManager.getHistoryByFarmer(farmerName);
    }
    
    setQRHistory(history);
  };

  const applyFilters = () => {
    let filtered = qrHistory;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(query) ||
        item.farmerName.toLowerCase().includes(query) ||
        item.qrCodeId.toLowerCase().includes(query) ||
        item.warehouseId.toLowerCase().includes(query) ||
        item.taluk.toLowerCase().includes(query) ||
        item.district.toLowerCase().includes(query) ||
        item.cropType.toLowerCase().includes(query)
      );
    }

    // Apply date filter
    const now = new Date();
    if (filterBy !== 'all') {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.dateGenerated);
        switch (filterBy) {
          case 'today':
            return itemDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return itemDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return itemDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateGenerated).getTime() - new Date(a.dateGenerated).getTime();
        case 'product':
          return a.productName.localeCompare(b.productName);
        case 'farmer':
          return a.farmerName.localeCompare(b.farmerName);
        case 'warehouse':
          return a.warehouseId.localeCompare(b.warehouseId);
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
  };

  const handleDownload = async (item: QRHistoryEntry) => {
    try {
      const response = await fetch(item.qrCodeUrl);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${item.qrCodeId}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloaded QR code for ${item.productName}`);
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  const handlePreview = (item: QRHistoryEntry) => {
    setSelectedEntry(item);
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `qr-history-${module}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('QR History exported successfully');
  };

  const getStatusIcon = (entry: QRHistoryEntry) => {
    if (entry.dateScanned) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (entry.action === 'verified') {
      return <Shield className="w-4 h-4 text-blue-500" />;
    }
    return <Clock className="w-4 h-4 text-orange-500" />;
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'farmer': return 'bg-green-100 text-green-700 border-green-200';
      case 'warehouse': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'consumer': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const statistics = {
    total: qrHistory.length,
    today: qrHistory.filter(item => 
      new Date(item.dateGenerated).toDateString() === new Date().toDateString()
    ).length,
    thisWeek: qrHistory.filter(item => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(item.dateGenerated) >= weekAgo;
    }).length,
    scanned: qrHistory.filter(item => item.dateScanned).length,
    verified: qrHistory.filter(item => item.action === 'verified').length
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total QR Codes</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.total}</p>
                </div>
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold text-blue-600">{statistics.today}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.thisWeek}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scanned</p>
                  <p className="text-2xl font-bold text-orange-600">{statistics.scanned}</p>
                </div>
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold text-indigo-600">{statistics.verified}</p>
                </div>
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by product, farmer, QR code, warehouse..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-border rounded-md text-sm bg-background"
                >
                  <option value="date">Sort by Date</option>
                  <option value="product">Sort by Product</option>
                  <option value="farmer">Sort by Farmer</option>
                  <option value="warehouse">Sort by Warehouse</option>
                </select>
                
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="px-3 py-2 border border-border rounded-md text-sm bg-background"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                
                <Button variant="outline" size="sm" onClick={exportHistory}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No QR Codes Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No QR codes match your search criteria.' : 'No QR codes have been generated yet.'}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* QR Code Thumbnail & Product Image */}
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center border-2 border-green-200">
                          <img 
                            src={item.qrCodeUrl} 
                            alt="QR Code" 
                            className="w-12 h-12"
                          />
                        </div>
                        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img 
                            src={item.cropImage} 
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-green-800">{item.productName}</h4>
                          <Badge variant="outline" className={getModuleColor(item.module)}>
                            {item.module}
                          </Badge>
                          {item.organicCertified && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Leaf className="w-3 h-3 mr-1" />
                              Organic
                            </Badge>
                          )}
                          <Badge variant="outline">
                            Grade {item.qualityGrade}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <QrCode className="w-3 h-3" />
                            {item.qrCodeId}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.farmerName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {item.quantity} {item.unit}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.taluk}, {item.district}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(item)}
                            <span>{item.dateScanned ? 'Scanned' : item.action}</span>
                          </div>
                          <span className="text-muted-foreground">
                            Generated: {new Date(item.dateGenerated).toLocaleDateString()}
                          </span>
                          {item.dateScanned && (
                            <span className="text-green-600">
                              Scanned: {new Date(item.dateScanned).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Predictive Analytics Summary */}
                        <div className="flex items-center gap-4 text-xs bg-blue-50 rounded-lg p-2">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            Expected: ₹{item.predictiveAnalytics.expectedSale.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-orange-600" />
                            Margin: {item.predictiveAnalytics.profitMargin}%
                          </span>
                          <span className="flex items-center gap-1">
                            {item.predictiveAnalytics.lossRisk > 15 ? (
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                            ) : (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                            Risk: {item.predictiveAnalytics.lossRisk}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(item)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(item)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Detailed Preview Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">QR Code Details</h3>
              <Button variant="ghost" onClick={() => setSelectedEntry(null)}>
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <img 
                    src={selectedEntry.qrCodeUrl} 
                    alt="QR Code"
                    className="w-full max-w-xs mx-auto border-2 border-green-200 rounded-lg p-4 bg-white"
                  />
                  <div className="text-center">
                    <Badge className="bg-green-600">
                      <Shield className="w-3 h-3 mr-1" />
                      Blockchain Verified
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <img 
                    src={selectedEntry.cropImage}
                    alt={selectedEntry.productName}
                    className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <h4 className="text-lg font-semibold">{selectedEntry.productName}</h4>
                  <p className="text-muted-foreground">by {selectedEntry.farmerName}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">QR Code ID:</span>
                  <p className="font-mono">{selectedEntry.qrCodeId}</p>
                </div>
                <div>
                  <span className="font-medium">Quantity:</span>
                  <p>{selectedEntry.quantity} {selectedEntry.unit}</p>
                </div>
                <div>
                  <span className="font-medium">Quality Grade:</span>
                  <p>Grade {selectedEntry.qualityGrade}</p>
                </div>
                <div>
                  <span className="font-medium">Price:</span>
                  <p>₹{selectedEntry.price}/{selectedEntry.unit}</p>
                </div>
                <div>
                  <span className="font-medium">Location:</span>
                  <p>{selectedEntry.taluk}, {selectedEntry.district}</p>
                </div>
                <div>
                  <span className="font-medium">Warehouse:</span>
                  <p>{selectedEntry.warehouseId}</p>
                </div>
              </div>
              
              <div className="text-xs">
                <span className="font-medium">Blockchain Hash:</span>
                <p className="font-mono break-all text-muted-foreground">{selectedEntry.blockchainHash}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}