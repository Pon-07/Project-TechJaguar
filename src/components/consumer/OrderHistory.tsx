import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Clock, 
  Package, 
  CheckCircle, 
  Truck, 
  Star,
  MapPin,
  RefreshCw,
  Eye
} from 'lucide-react';

const orders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-18',
    items: [
      { name: 'Premium Basmati Rice', quantity: 5, farmer: 'Rajesh Kumar' },
      { name: 'Organic Tomatoes', quantity: 2, farmer: 'Priya Sharma' }
    ],
    total: 515,
    status: 'delivered',
    rating: 4.8,
    deliveryDate: '2024-01-20',
    carbonSaved: 3.2
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-16',
    items: [
      { name: 'Golden Wheat', quantity: 10, farmer: 'Amit Singh' }
    ],
    total: 320,
    status: 'in-transit',
    deliveryDate: '2024-01-19',
    carbonSaved: 2.1
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-14',
    items: [
      { name: 'Fresh Mangoes', quantity: 3, farmer: 'Lakshmi Devi' },
      { name: 'Red Lentils', quantity: 2, farmer: 'Mohammed Ali' }
    ],
    total: 550,
    status: 'confirmed',
    deliveryDate: '2024-01-21',
    carbonSaved: 2.8
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'in-transit': return 'bg-blue-100 text-blue-800';
    case 'confirmed': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered': return CheckCircle;
    case 'in-transit': return Truck;
    case 'confirmed': return Package;
    default: return Clock;
  }
};

export function OrderHistory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-6 h-6 mr-2 text-green-600" />
              Order History
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{order.total.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{order.date}</div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span>{item.name}</span>
                          <span className="text-muted-foreground">x{item.quantity}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{item.farmer}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Truck className="w-3 h-3 mr-1" />
                        Delivery: {order.deliveryDate}
                      </div>
                      {order.carbonSaved && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          -{order.carbonSaved} kg CO₂
                        </Badge>
                      )}
                      {order.rating && (
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          <span>{order.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {order.status === 'delivered' && (
                        <Button size="sm" variant="outline">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-bold text-green-600">₹1,385</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-bold text-blue-600">8.1 kg</div>
              <div className="text-sm text-muted-foreground">CO₂ Saved</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-bold text-purple-600">6</div>
              <div className="text-sm text-muted-foreground">Farmers Supported</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}