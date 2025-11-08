import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  Package, 
  Warehouse, 
  TrendingUp, 
  Users,
  Zap,
  Globe,
  Shield,
  Award,
  Navigation
} from 'lucide-react';

export function SystemEnhancementSummary() {
  const enhancements = [
    {
      title: "Amazon-Style Product Tracking",
      description: "Complete product movement history from farmer to Uzhavan Santhai shops",
      icon: Navigation,
      features: ["Interactive timelines", "Real-time location updates", "Blockchain verification", "QR code tracking"],
      status: "completed"
    },
    {
      title: "Farmer Product History Hub",
      description: "Comprehensive dashboard showing all farmer product journeys",
      icon: Users,
      features: ["Product analytics", "Revenue tracking", "Sustainability metrics", "Status filtering"],
      status: "completed"
    },
    {
      title: "Warehouse Movement Analytics",
      description: "Advanced warehouse-level product flow analysis",
      icon: Warehouse,
      features: ["Incoming/outgoing tracking", "Performance analytics", "Multi-warehouse support", "State/district filtering"],
      status: "completed"
    },
    {
      title: "Real-time Notifications",
      description: "Live updates for product status changes and movements",
      icon: Zap,
      features: ["Glowing animations", "Priority levels", "Dismissible alerts", "Timestamp tracking"],
      status: "completed"
    },
    {
      title: "Multilingual Support",
      description: "Full system support for English, Hindi, Tamil, and Odia",
      icon: Globe,
      features: ["Dynamic language switching", "Cultural adaptation", "Regional preferences", "Localized content"],
      status: "integrated"
    },
    {
      title: "Blockchain Integration",
      description: "Every product movement secured with blockchain verification",
      icon: Shield,
      features: ["Transaction hashes", "Immutable records", "Smart contracts", "Transparency logs"],
      status: "simulated"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'integrated': return 'bg-blue-100 text-blue-800';
      case 'simulated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Card className="w-80 max-h-96 overflow-y-auto shadow-lg border-2 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-green-600" />
              System Enhancements
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest improvements to GreenLedger platform
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {enhancements.map((enhancement, index) => (
              <motion.div
                key={enhancement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 1.2 }}
                className="p-3 border rounded-lg bg-gradient-to-r from-white to-green-50"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <enhancement.icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{enhancement.title}</h4>
                      <Badge className={`text-xs ${getStatusColor(enhancement.status)}`}>
                        {enhancement.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {enhancement.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {enhancement.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <CheckCircle className="w-2 h-2 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="text-center pt-2">
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <TrendingUp className="w-3 h-3 mr-1" />
                All Systems Operational
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}