import React from 'react';
import { motion } from 'motion/react';
import { MapPin, User, Star, Package, Lock, AlertCircle, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Warehouse } from '../../data/warehouses';

interface WarehouseCardProps {
  warehouse: Warehouse;
  onClick: () => void;
  isMapView?: boolean;
}

export function WarehouseCard({ warehouse, onClick, isMapView = false }: WarehouseCardProps) {
  const occupancyPercentage = (warehouse.current_occupancy_tonnes / warehouse.capacity_tonnes) * 100;
  const isFull = occupancyPercentage >= 95;
  const isLowStock = warehouse.inventory.some(item => 
    (item.total_quantity_kg / 1000) < (warehouse.capacity_tonnes * 0.05)
  );

  const topInventory = warehouse.inventory.slice(0, 3);
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'fill-amber-400 text-amber-400' 
            : i < rating 
            ? 'fill-amber-200 text-amber-200' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer ${isMapView ? 'w-64' : ''}`}
    >
      <Card className={`h-full overflow-hidden ${isFull ? 'ring-2 ring-red-200' : ''} hover:shadow-lg transition-all duration-300`}>
        {isFull && (
          <div className="bg-red-100 border-b border-red-200 p-2">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Warehouse Full - Visit Nearby</span>
            </div>
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{warehouse.warehouse_id}</h3>
                {warehouse.zomato_partner_enabled && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                    <Truck className="w-3 h-3 mr-1" />
                    Zomato
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{warehouse.taluk}, {warehouse.district}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                <span>{warehouse.manager.name}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                {renderStars(warehouse.rating)}
                <span className="text-xs text-muted-foreground ml-1">{warehouse.rating}</span>
              </div>
              {isLowStock && (
                <Badge variant="destructive" className="text-xs">Low Stock</Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Occupancy */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium">Capacity</span>
              <span className="text-xs text-muted-foreground">
                {warehouse.current_occupancy_tonnes}t / {warehouse.capacity_tonnes}t
              </span>
            </div>
            <Progress 
              value={occupancyPercentage} 
              className={`h-2 ${isFull ? 'bg-red-100' : ''}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{occupancyPercentage.toFixed(1)}% occupied</span>
              {isFull && <span className="text-red-600 font-medium">Full</span>}
            </div>
          </div>

          {/* Top Inventory */}
          <div>
            <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
              <Package className="w-3 h-3" />
              Top Inventory
            </h4>
            <div className="space-y-1">
              {topInventory.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-muted-foreground">
                      {(item.total_quantity_kg / 1000).toFixed(1)}t • {item.farmer_count} farmers
                    </div>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <div className="font-medium text-green-700">
                      ₹{item.community_price_per_kg}/kg
                    </div>
                    {item.organic_cert === 'Yes' && (
                      <Badge variant="outline" className="text-xs mt-1 bg-green-50 text-green-700 border-green-200">
                        Organic
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {warehouse.inventory.length > 3 && (
                <div className="text-xs text-muted-foreground text-center py-1">
                  +{warehouse.inventory.length - 3} more items
                </div>
              )}
            </div>
          </div>

          {/* Blockchain Badge */}
          {warehouse.inventory.some(item => item.blockchain_contract_id) && (
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">
                Blockchain Secured
              </span>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                ...{warehouse.inventory[0]?.blockchain_contract_id?.slice(-6)}
              </Badge>
            </div>
          )}

          {/* Delivery Partners */}
          {warehouse.delivery_partners.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Truck className="w-3 h-3 text-gray-600" />
              {warehouse.delivery_partners.map((partner, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {partner}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <div className="p-3 pt-0">
          <Button 
            onClick={onClick} 
            className="w-full text-xs"
            variant={isFull ? "outline" : "default"}
          >
            {isFull ? 'View Details' : 'View Warehouse'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}