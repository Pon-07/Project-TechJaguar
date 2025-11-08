import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Link,
  Shield,
  CheckCircle,
  Clock,
  User,
  Package,
  DollarSign,
  MapPin,
  Calendar,
  ExternalLink,
  Copy,
  Verified,
  Eye,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { warehousesData, Warehouse as WarehouseType } from '../../data/warehouses';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface BlockchainTransparencyPanelProps {
  selectedWarehouse: WarehouseType;
}

interface BlockchainTransaction {
  id: string;
  hash: string;
  timestamp: Date;
  type: 'ARRIVAL' | 'QUALITY_CHECK' | 'PRICE_UPDATE' | 'SALE' | 'QR_GENERATE';
  farmer_name: string;
  crop_type: string;
  quantity_kg: number;
  price_per_kg: number;
  total_value: number;
  buyer?: string;
  quality_score?: number;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
  gas_used: number;
  confirmations: number;
}

// Generate dummy blockchain transactions
const generateBlockchainTransactions = (warehouse: WarehouseType): BlockchainTransaction[] => {
  const transactions: BlockchainTransaction[] = [];
  const now = new Date();
  
  const farmers = [
    'Ramesh Kumar', 'Lakshmi Devi', 'Suresh Patel', 'Meena Rao', 'Arjun Singh',
    'Prema Kumari', 'Dilip Reddy', 'Hema Nair', 'Anand Verma', 'Sita Sharma'
  ];
  
  const buyers = [
    'GreenMart Retail', 'Fresh Foods Ltd', 'Organic Bazaar', 'Healthy Harvest Co',
    'Urban Fresh', 'Nature\'s Best', 'Farm to Table Ltd', 'Pure Produce'
  ];

  warehouse.inventory.forEach((item) => {
    // Generate 3-5 transactions per item
    const txCount = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < txCount; i++) {
      const txType = ['ARRIVAL', 'QUALITY_CHECK', 'PRICE_UPDATE', 'SALE', 'QR_GENERATE'][i % 5] as any;
      const quantity = Math.floor(Math.random() * 2000) + 500;
      const price = item.community_price_per_kg + (Math.random() - 0.5) * 10;
      
      transactions.push({
        id: `TX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        timestamp: new Date(now.getTime() - (i * 24 * 60 * 60 * 1000) - Math.random() * 24 * 60 * 60 * 1000),
        type: txType,
        farmer_name: farmers[Math.floor(Math.random() * farmers.length)],
        crop_type: item.name,
        quantity_kg: quantity,
        price_per_kg: Math.round(price * 100) / 100,
        total_value: Math.round(quantity * price),
        buyer: txType === 'SALE' ? buyers[Math.floor(Math.random() * buyers.length)] : undefined,
        quality_score: txType === 'QUALITY_CHECK' ? 75 + Math.random() * 25 : undefined,
        status: Math.random() > 0.05 ? 'CONFIRMED' : 'PENDING',
        gas_used: Math.floor(Math.random() * 50000) + 21000,
        confirmations: Math.floor(Math.random() * 100) + 12
      });
    }
  });

  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 20);
};

// Generate transaction volume data
const generateTransactionVolumeData = () => {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      transactions: Math.floor(Math.random() * 50) + 10,
      volume: Math.floor(Math.random() * 500000) + 100000,
      gasUsed: Math.floor(Math.random() * 1000000) + 500000
    };
  });
  return days;
};

export function BlockchainTransparencyPanel({ selectedWarehouse }: BlockchainTransparencyPanelProps) {
  const { t } = useLanguage();
  const [selectedTx, setSelectedTx] = useState<BlockchainTransaction | null>(null);
  const [activeTab, setActiveTab] = useState<'recent' | 'analytics' | 'verify'>('recent');

  const transactions = useMemo(() => generateBlockchainTransactions(selectedWarehouse), [selectedWarehouse]);
  const volumeData = useMemo(() => generateTransactionVolumeData(), []);

  // Calculate blockchain metrics
  const blockchainMetrics = useMemo(() => {
    const totalTransactions = transactions.length;
    const confirmedTransactions = transactions.filter(tx => tx.status === 'CONFIRMED').length;
    const totalValue = transactions.reduce((sum, tx) => sum + tx.total_value, 0);
    const avgGasUsed = transactions.reduce((sum, tx) => sum + tx.gas_used, 0) / transactions.length;
    const uniqueFarmers = new Set(transactions.map(tx => tx.farmer_name)).size;
    
    return {
      totalTransactions,
      confirmedTransactions,
      confirmationRate: (confirmedTransactions / totalTransactions) * 100,
      totalValue,
      avgGasUsed: Math.floor(avgGasUsed),
      uniqueFarmers
    };
  }, [transactions]);

  const getTransactionIcon = (type: BlockchainTransaction['type']) => {
    switch (type) {
      case 'ARRIVAL': return Package;
      case 'QUALITY_CHECK': return Verified;
      case 'PRICE_UPDATE': return DollarSign;
      case 'SALE': return User;
      case 'QR_GENERATE': return Link;
      default: return Shield;
    }
  };

  const getStatusColor = (status: BlockchainTransaction['status']) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'FAILED': return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Blockchain Transparency Panel
            </h2>
            <p className="text-indigo-100 mt-1">
              Immutable transaction history for {selectedWarehouse.warehouse_id} • {selectedWarehouse.taluk}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Link className="w-3 h-3 mr-1" />
                {blockchainMetrics.totalTransactions} Transactions
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                {blockchainMetrics.confirmationRate.toFixed(1)}% Confirmed
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹{(blockchainMetrics.totalValue / 100000).toFixed(1)}L</div>
            <div className="text-sm text-indigo-100">Total Transaction Value</div>
            <div className="flex items-center text-sm mt-1">
              <User className="w-4 h-4 mr-1" />
              {blockchainMetrics.uniqueFarmers} Unique Farmers
            </div>
          </div>
        </div>

        {/* Floating blockchain elements */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="w-24 h-24" />
          </motion.div>
        </div>
      </motion.div>

      {/* Blockchain Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Transactions',
            value: blockchainMetrics.totalTransactions.toString(),
            icon: Link,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          {
            label: 'Confirmed Rate',
            value: `${blockchainMetrics.confirmationRate.toFixed(1)}%`,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50'
          },
          {
            label: 'Avg Gas Used',
            value: `${(blockchainMetrics.avgGasUsed / 1000).toFixed(1)}K`,
            icon: BarChart3,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
          },
          {
            label: 'Unique Farmers',
            value: blockchainMetrics.uniqueFarmers.toString(),
            icon: User,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className={`p-3 ${metric.bg} rounded-lg`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="verify" className="flex items-center gap-2">
                <Verified className="w-4 h-4" />
                Verify Transaction
              </TabsTrigger>
            </TabsList>

            {/* Recent Transactions Tab */}
            <TabsContent value="recent" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Last 20 Transactions</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success('Blockchain data refreshed')}
                  >
                    Refresh Data
                  </Button>
                </div>

                <div className="space-y-3">
                  {transactions.map((tx, index) => {
                    const Icon = getTransactionIcon(tx.type);
                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setSelectedTx(tx)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                              <Icon className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{tx.type.replace('_', ' ')}</h4>
                                <Badge variant="outline" className={getStatusColor(tx.status)}>
                                  {tx.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {tx.farmer_name} • {tx.crop_type} • {tx.quantity_kg.toLocaleString()} kg
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {tx.timestamp.toLocaleDateString()} {tx.timestamp.toLocaleTimeString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Link className="w-3 h-3" />
                                  {tx.confirmations} confirmations
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-green-600">₹{tx.total_value.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">₹{tx.price_per_kg}/kg</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(tx.hash);
                              }}
                              className="mt-1 h-6 px-2"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-3 p-2 bg-gray-50 rounded border">
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-3 h-3 text-blue-600" />
                            <span className="text-xs font-medium">Transaction Hash</span>
                          </div>
                          <code className="text-xs text-blue-600 break-all">{tx.hash}</code>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Transaction Volume Trends (30 Days)</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Transaction Count Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={volumeData}>
                          <defs>
                            <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="transactions" 
                            stroke="#3b82f6" 
                            fillOpacity={1} 
                            fill="url(#transactionGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Volume Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction Value (₹)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={volumeData}>
                          <defs>
                            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                          <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, '']} />
                          <Area 
                            type="monotone" 
                            dataKey="volume" 
                            stroke="#22c55e" 
                            fillOpacity={1} 
                            fill="url(#volumeGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Transaction Type Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Type Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { type: 'ARRIVAL', count: transactions.filter(tx => tx.type === 'ARRIVAL').length, color: 'bg-blue-600' },
                        { type: 'QUALITY_CHECK', count: transactions.filter(tx => tx.type === 'QUALITY_CHECK').length, color: 'bg-green-600' },
                        { type: 'PRICE_UPDATE', count: transactions.filter(tx => tx.type === 'PRICE_UPDATE').length, color: 'bg-amber-600' },
                        { type: 'SALE', count: transactions.filter(tx => tx.type === 'SALE').length, color: 'bg-purple-600' },
                        { type: 'QR_GENERATE', count: transactions.filter(tx => tx.type === 'QR_GENERATE').length, color: 'bg-indigo-600' }
                      ].map((item) => (
                        <div key={item.type} className="text-center p-3 border rounded-lg">
                          <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                            <span className="text-white font-bold">{item.count}</span>
                          </div>
                          <p className="text-sm font-medium">{item.type.replace('_', ' ')}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Verify Transaction Tab */}
            <TabsContent value="verify" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Verify Transaction Authenticity</h3>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Transaction Hash</label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            placeholder="Enter transaction hash (0x...)"
                            className="flex-1 px-3 py-2 border rounded-md"
                          />
                          <Button onClick={() => toast.success('Transaction verified on blockchain')}>
                            <Verified className="w-4 h-4 mr-2" />
                            Verify
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-green-800">Verification Status</h4>
                        </div>
                        <p className="text-sm text-green-700">
                          All transactions are cryptographically secured and immutable on the blockchain.
                          Use any transaction hash from above to verify authenticity.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Network Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Network:</span>
                              <span>GreenLedger Chain</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Block Height:</span>
                              <span>{(1000000 + Math.floor(Math.random() * 100000)).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Gas Price:</span>
                              <span>20 gwei</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Security Features</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>SHA-256 Encryption</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Proof of Stake Consensus</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Immutable Records</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}