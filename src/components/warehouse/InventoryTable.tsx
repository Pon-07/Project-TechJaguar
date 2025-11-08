import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Users, Calendar, Shield, Eye, ExternalLink, Leaf, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { InventoryItem } from '../../data/warehouses';

interface InventoryTableProps {
  inventory: InventoryItem[];
  onItemClick: (item: InventoryItem) => void;
}

export function InventoryTable({ inventory, onItemClick }: InventoryTableProps) {
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'price' | 'farmers' | 'expiry'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedInventory = [...inventory].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'quantity':
        aValue = a.total_quantity_kg;
        bValue = b.total_quantity_kg;
        break;
      case 'price':
        aValue = a.community_price_per_kg;
        bValue = b.community_price_per_kg;
        break;
      case 'farmers':
        aValue = a.farmer_count;
        bValue = b.farmer_count;
        break;
      case 'expiry':
        aValue = new Date(a.expiry_date);
        bValue = new Date(b.expiry_date);
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (dateString: string) => {
    const days = getDaysUntilExpiry(dateString);
    if (days < 30) return 'urgent';
    if (days < 90) return 'warning';
    return 'good';
  };

  const getOrganicBadge = (cert: string) => {
    switch (cert) {
      case 'Yes':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Organic</Badge>;
      case 'Partial':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Partial</Badge>;
      default:
        return null;
    }
  };

  const SortButton = ({ column, children }: { column: typeof sortBy; children: React.ReactNode }) => (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => handleSort(column)}
      className="h-auto p-1 font-medium hover:bg-transparent"
    >
      {children}
      {sortBy === column && (
        <span className="ml-1">
          {sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </Button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Inventory ({inventory.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  <SortButton column="name">Item Details</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton column="farmers">Farmers</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton column="quantity">Quantity</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton column="price">Price</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton column="expiry">Expiry</SortButton>
                </TableHead>
                <TableHead>Blockchain</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInventory.map((item, index) => {
                const expiryStatus = getExpiryStatus(item.expiry_date);
                const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date);
                const priceIncrease = ((item.community_price_per_kg - item.unit_price_per_kg) / item.unit_price_per_kg) * 100;
                
                return (
                  <motion.tr
                    key={item.item_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => onItemClick(item)}
                  >
                    <TableCell>
                      <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-green-700" />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.variety} • Batch: {item.batch_id}
                        </div>
                        <div className="flex items-center gap-2">
                          {getOrganicBadge(item.organic_cert)}
                          {item.carbon_saved_kg > 0 && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                              <Leaf className="w-3 h-3 mr-1" />
                              {item.carbon_saved_kg}kg CO₂ saved
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{item.farmer_count}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">farmers</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="font-medium">
                        {(item.total_quantity_kg / 1000).toFixed(1)} tonnes
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.total_quantity_kg.toLocaleString()} kg
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-medium text-green-700">
                          ₹{item.community_price_per_kg}/kg
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Base: ₹{item.unit_price_per_kg}/kg
                        </div>
                        {priceIncrease > 0 && (
                          <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                            <TrendingUp className="w-3 h-3" />
                            +{priceIncrease.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className={`text-sm font-medium ${
                          expiryStatus === 'urgent' ? 'text-red-600' :
                          expiryStatus === 'warning' ? 'text-amber-600' :
                          'text-green-600'
                        }`}>
                          {formatDate(item.expiry_date)}
                        </div>
                        <div className={`text-xs ${
                          expiryStatus === 'urgent' ? 'text-red-500' :
                          expiryStatus === 'warning' ? 'text-amber-500' :
                          'text-muted-foreground'
                        }`}>
                          {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Expired'}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-blue-600 font-mono">
                            ...{item.blockchain_contract_id.slice(-6)}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Contract
                        </Button>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onItemClick(item);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          AR View
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}