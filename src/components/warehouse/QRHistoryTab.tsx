import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  QrCode, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  MapPin,
  Package,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Hash,
  BarChart3
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { qrHistoryManager, QRHistoryEntry, getCropImageUrl } from '../../data/qrHistory';
import { toast } from 'sonner@2.0.3';

export function QRHistoryTab() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateGenerated');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState<QRHistoryEntry | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Get QR history data
  const qrHistory = qrHistoryManager.getHistory();

  // Filter and sort history
  const filteredHistory = useMemo(() => {
    let filtered = qrHistory.filter(entry => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          entry.productName.toLowerCase().includes(query) ||
          entry.farmerName.toLowerCase().includes(query) ||
          entry.district.toLowerCase().includes(query) ||
          entry.warehouseName.toLowerCase().includes(query) ||
          entry.qrCodeId.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filterBy !== 'all') {
        switch (filterBy) {
          case 'scanned':
            return !!entry.dateScanned;
          case 'unscanned':
            return !entry.dateScanned;
          case 'organic':
            return entry.organicCertified;
          case 'high-demand':
            return entry.predictiveAnalytics.demandForecast === 'High' || entry.predictiveAnalytics.demandForecast === 'Very High';
          case 'low-stock':
            return entry.predictiveAnalytics.stockLevel === 'Low' || entry.predictiveAnalytics.stockLevel === 'Critical';
          case 'high-risk':
            return entry.predictiveAnalytics.lossRisk > 15;
          default:
            return true;
        }
      }

      return true;
    });

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dateGenerated':
          return new Date(b.dateGenerated).getTime() - new Date(a.dateGenerated).getTime();
        case 'dateScanned':
          const aScanned = a.dateScanned ? new Date(a.dateScanned).getTime() : 0;
          const bScanned = b.dateScanned ? new Date(b.dateScanned).getTime() : 0;
          return bScanned - aScanned;
        case 'productName':
          return a.productName.localeCompare(b.productName);
        case 'farmerName':
          return a.farmerName.localeCompare(b.farmerName);
        case 'price':
          return b.price - a.price;
        case 'demand':
          const demandOrder = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return demandOrder[b.predictiveAnalytics.demandForecast as keyof typeof demandOrder] - 
                 demandOrder[a.predictiveAnalytics.demandForecast as keyof typeof demandOrder];
        default:
          return 0;
      }
    });
  }, [qrHistory, searchQuery, sortBy, filterBy]);

  const getStatusBadge = (entry: QRHistoryEntry) => {
    if (entry.dateScanned) {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          Scanned
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-orange-600 border-orange-300">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const getDemandBadge = (forecast: string) => {
    const colors = {
      'Very High': 'bg-red-100 text-red-700 border-red-300',
      'High': 'bg-orange-100 text-orange-700 border-orange-300',
      'Medium': 'bg-blue-100 text-blue-700 border-blue-300',
      'Low': 'bg-gray-100 text-gray-700 border-gray-300'
    };
    
    return (
      <Badge variant="outline" className={colors[forecast as keyof typeof colors] || colors.Low}>
        <TrendingUp className="w-3 h-3 mr-1" />
        {forecast}
      </Badge>
    );
  };

  const getStockLevelBadge = (level: string) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-700 border-red-300',
      'Low': 'bg-orange-100 text-orange-700 border-orange-300',
      'Optimal': 'bg-green-100 text-green-700 border-green-300',
      'High': 'bg-blue-100 text-blue-700 border-blue-300'
    };
    
    return (
      <Badge variant="outline" className={colors[level as keyof typeof colors] || colors.Optimal}>
        {level === 'Critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
        {level}
      </Badge>
    );
  };

  const handleViewDetails = (entry: QRHistoryEntry) => {
    setSelectedEntry(entry);
    setShowDetailsModal(true);
  };

  const handleDownloadQR = async (entry: QRHistoryEntry) => {
    try {
      const response = await fetch(entry.qrCodeUrl);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${entry.qrCodeId}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloaded QR code for ${entry.productName}`);
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <QrCode className="w-5 h-5" />
            QR Code History & Analytics
            <Badge variant="secondary" className="bg-green-100 text-green-700 ml-2">
              <BarChart3 className="w-3 h-3 mr-1" />
              {filteredHistory.length} Entries
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-green-100">
              <p className="text-2xl font-bold text-green-700">{qrHistory.length}</p>
              <p className="text-sm text-muted-foreground">Total QR Codes</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
              <p className="text-2xl font-bold text-blue-700">
                {qrHistory.filter(e => e.dateScanned).length}
              </p>
              <p className="text-sm text-muted-foreground">Scanned</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-orange-100">
              <p className="text-2xl font-bold text-orange-700">
                {qrHistory.filter(e => e.predictiveAnalytics.demandForecast === 'High' || e.predictiveAnalytics.demandForecast === 'Very High').length}
              </p>
              <p className="text-sm text-muted-foreground">High Demand</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-purple-100">
              <p className="text-2xl font-bold text-purple-700">
                {qrHistory.filter(e => e.organicCertified).length}
              </p>
              <p className="text-sm text-muted-foreground">Organic Certified</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by product, farmer, district, or QR ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateGenerated">Latest Generated</SelectItem>
                <SelectItem value="dateScanned">Recently Scanned</SelectItem>
                <SelectItem value="productName">Product Name</SelectItem>
                <SelectItem value="farmerName">Farmer Name</SelectItem>
                <SelectItem value="price">Price (High to Low)</SelectItem>
                <SelectItem value="demand">Demand Forecast</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All QR Codes</SelectItem>
                <SelectItem value="scanned">Scanned Only</SelectItem>
                <SelectItem value="unscanned">Unscanned Only</SelectItem>
                <SelectItem value="organic">Organic Certified</SelectItem>
                <SelectItem value="high-demand">High Demand</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="high-risk">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* QR History Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-16">QR</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Demand</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((entry, index) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <motion.div 
                        className="relative group cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleViewDetails(entry)}
                      >
                        <img
                          src={entry.qrCodeUrl}
                          alt={`QR ${entry.qrCodeId}`}
                          className="w-10 h-10 border border-green-200 rounded group-hover:border-green-400 transition-colors"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.div
                            className="absolute top-0 right-0 text-yellow-400"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles className="w-2 h-2" />
                          </motion.div>
                        </div>
                      </motion.div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.cropImage}
                          alt={entry.productName}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm">{entry.productName}</p>
                          <p className="text-xs text-muted-foreground">{entry.cropType}</p>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{entry.farmerName}</p>
                        <p className="text-xs text-muted-foreground">{entry.farmerId}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{entry.district}</p>
                          <p className="text-xs text-muted-foreground">{entry.taluk}</p>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="font-semibold text-green-700">₹{entry.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{entry.quantity} {entry.unit}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>{getStatusBadge(entry)}</TableCell>
                    
                    <TableCell>{getDemandBadge(entry.predictiveAnalytics.demandForecast)}</TableCell>
                    
                    <TableCell>{getStockLevelBadge(entry.predictiveAnalytics.stockLevel)}</TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="text-sm">{new Date(entry.dateGenerated).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.dateGenerated).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(entry)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadQR(entry)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No QR Codes Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No QR codes have been generated yet'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedEntry && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-700">
                <QrCode className="w-5 h-5" />
                QR Code Details - {selectedEntry.qrCodeId}
                <Badge variant="secondary" className="bg-green-100 text-green-700 ml-2">
                  <Shield className="w-3 h-3 mr-1" />
                  Blockchain Verified
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QR Code and Product Info */}
              <div className="space-y-4">
                <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-amber-50">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <motion.div 
                        className="inline-block bg-white p-4 rounded-xl shadow-lg border-2 border-green-200 relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-20 animate-pulse"></div>
                        <div className="absolute inset-[2px] bg-white rounded-lg"></div>
                        <img 
                          src={selectedEntry.qrCodeUrl} 
                          alt={`QR Code for ${selectedEntry.productName}`}
                          className="w-32 h-32 relative z-10"
                        />
                        <motion.div
                          className="absolute top-1 right-1 text-yellow-400"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-3 h-3" />
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    <div className="flex justify-center gap-2 mb-4">
                      <Button
                        size="sm"
                        onClick={() => handleDownloadQR(selectedEntry)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Image */}
                <Card>
                  <CardContent className="p-4">
                    <img
                      src={selectedEntry.cropImage}
                      alt={selectedEntry.productName}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information */}
              <div className="space-y-4">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">Product Name</p>
                        <p className="font-semibold">{selectedEntry.productName}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Type</p>
                        <p className="font-semibold">{selectedEntry.cropType}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Quality Grade</p>
                        <Badge variant="outline">{selectedEntry.qualityGrade}</Badge>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Organic</p>
                        <Badge variant={selectedEntry.organicCertified ? "default" : "outline"}>
                          {selectedEntry.organicCertified ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{selectedEntry.quantity} {selectedEntry.unit}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Price</p>
                        <p className="font-semibold text-green-700">₹{selectedEntry.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Farmer & Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Farmer & Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">Farmer Name</p>
                        <p className="font-semibold text-amber-700">{selectedEntry.farmerName}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Farmer ID</p>
                        <Badge variant="outline" className="font-mono">{selectedEntry.farmerId}</Badge>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Location</p>
                        <p className="font-semibold">{selectedEntry.taluk}, {selectedEntry.district}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Warehouse</p>
                        <p className="font-semibold">{selectedEntry.warehouseName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Predictive Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Predictive Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">Expected Sale</p>
                        <p className="font-semibold text-green-700">₹{selectedEntry.predictiveAnalytics.expectedSale.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Profit Margin</p>
                        <p className="font-semibold text-blue-700">{selectedEntry.predictiveAnalytics.profitMargin}%</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Demand Forecast</p>
                        {getDemandBadge(selectedEntry.predictiveAnalytics.demandForecast)}
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Stock Level</p>
                        {getStockLevelBadge(selectedEntry.predictiveAnalytics.stockLevel)}
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Loss Risk</p>
                        <Badge variant={selectedEntry.predictiveAnalytics.lossRisk > 15 ? "destructive" : "outline"}>
                          {selectedEntry.predictiveAnalytics.lossRisk}%
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Carbon Footprint</p>
                        <p className="font-semibold text-green-600">{selectedEntry.carbonFootprint} kg CO₂</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timestamps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Generated</span>
                        <span>{new Date(selectedEntry.dateGenerated).toLocaleString()}</span>
                      </div>
                      {selectedEntry.dateScanned && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Scanned</span>
                          <span>{new Date(selectedEntry.dateScanned).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
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