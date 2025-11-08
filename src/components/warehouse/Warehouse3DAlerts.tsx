import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  X, 
  AlertTriangle, 
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Thermometer,
  Package,
  Truck,
  Settings,
  Zap,
  Shield,
  Bell,
  Eye,
  MapPin,
  Calendar,
  User
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'temperature' | 'inventory' | 'security' | 'maintenance' | 'system';
  title: string;
  message: string;
  location: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  assignedTo?: string;
  estimatedResolution?: string;
}

interface Warehouse3DAlertsProps {
  onClose: () => void;
}

const mockAlerts: Alert[] = [
  {
    id: 'ALERT-001',
    type: 'critical',
    category: 'temperature',
    title: 'Temperature Threshold Exceeded',
    message: 'Cold storage unit B1 temperature has risen to 8°C (threshold: 4°C)',
    location: 'Section B1 - Cold Storage',
    timestamp: '2024-12-26T14:30:00Z',
    status: 'active',
    assignedTo: 'Maintenance Team A',
    estimatedResolution: '30 minutes'
  },
  {
    id: 'ALERT-002',
    type: 'warning',
    category: 'inventory',
    title: 'Low Stock Alert',
    message: 'Organic wheat inventory has dropped below minimum threshold (50 tons)',
    location: 'Section A1 - Grain Storage',
    timestamp: '2024-12-26T13:45:00Z',
    status: 'acknowledged',
    assignedTo: 'Inventory Manager',
    estimatedResolution: '2 hours'
  },
  {
    id: 'ALERT-003',
    type: 'warning',
    category: 'maintenance',
    title: 'Scheduled Maintenance Due',
    message: 'Conveyor belt system requires scheduled maintenance inspection',
    location: 'Loading Bay C1',
    timestamp: '2024-12-26T12:15:00Z',
    status: 'active',
    assignedTo: 'Maintenance Team B',
    estimatedResolution: '1 hour'
  },
  {
    id: 'ALERT-004',
    type: 'info',
    category: 'system',
    title: 'Sensor Calibration Complete',
    message: 'Temperature sensors in all storage units have been recalibrated successfully',
    location: 'All Sections',
    timestamp: '2024-12-26T11:30:00Z',
    status: 'resolved'
  },
  {
    id: 'ALERT-005',
    type: 'critical',
    category: 'security',
    title: 'Unauthorized Access Detected',
    message: 'Motion detected in restricted area outside operating hours',
    location: 'Control Room Perimeter',
    timestamp: '2024-12-26T23:45:00Z',
    status: 'active',
    assignedTo: 'Security Team',
    estimatedResolution: '15 minutes'
  }
];

export function Warehouse3DAlerts({ onClose }: Warehouse3DAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');

  const getAlertIcon = (type: string, category: string) => {
    if (type === 'critical') return AlertTriangle;
    if (type === 'warning') return AlertCircle;
    if (type === 'info') return Info;
    
    switch (category) {
      case 'temperature': return Thermometer;
      case 'inventory': return Package;
      case 'security': return Shield;
      case 'maintenance': return Settings;
      case 'system': return Zap;
      default: return AlertCircle;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: 'text-red-500'
      };
      case 'warning': return {
        bg: 'bg-[#FF9933]/10',
        border: 'border-[#FF9933]/30',
        text: 'text-[#FF9933]',
        icon: 'text-[#FF9933]'
      };
      case 'info': return {
        bg: 'bg-[#0B3D91]/10',
        border: 'border-[#0B3D91]/30',
        text: 'text-[#0B3D91]',
        icon: 'text-[#0B3D91]'
      };
      default: return {
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/30',
        text: 'text-gray-400',
        icon: 'text-gray-500'
      };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'acknowledged': return 'bg-[#FF9933]/20 text-[#FF9933] border-[#FF9933]';
      case 'resolved': return 'bg-[#138808]/20 text-[#138808] border-[#138808]';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const typeMatch = filter === 'all' || alert.type === filter;
    const statusMatch = statusFilter === 'all' || alert.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged' as const }
        : alert
    ));
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' as const }
        : alert
    ));
  };

  const criticalCount = alerts.filter(a => a.type === 'critical' && a.status === 'active').length;
  const warningCount = alerts.filter(a => a.type === 'warning' && a.status === 'active').length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed right-4 top-4 bottom-4 w-96 z-40"
    >
      <Card className="h-full bg-black/10 backdrop-blur-xl border border-red-500/30 overflow-hidden">
        <CardHeader className="border-b border-red-500/20 bg-gradient-to-r from-red-500/10 to-[#FF9933]/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-[#FF9933] rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                {(criticalCount > 0 || warningCount > 0) && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-white">
                      {criticalCount + warningCount}
                    </span>
                  </motion.div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold">Alert Center</h2>
                <p className="text-sm text-white/70">Real-time monitoring</p>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 h-full overflow-y-auto bg-gradient-to-br from-slate-900/50 to-slate-800/50">
          {/* Filter Controls */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs text-white/70 font-medium mb-2 block">Alert Type</label>
              <div className="flex gap-2">
                {['all', 'critical', 'warning', 'info'].map((type) => (
                  <Button
                    key={type}
                    variant="ghost"
                    size="sm"
                    className={`text-xs h-7 ${
                      filter === type 
                        ? 'bg-[#FF9933]/30 text-[#FF9933] border border-[#FF9933]/50' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setFilter(type as any)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-white/70 font-medium mb-2 block">Status</label>
              <div className="flex gap-2">
                {['all', 'active', 'acknowledged', 'resolved'].map((status) => (
                  <Button
                    key={status}
                    variant="ghost"
                    size="sm"
                    className={`text-xs h-7 ${
                      statusFilter === status 
                        ? 'bg-[#0B3D91]/30 text-[#0B3D91] border border-[#0B3D91]/50' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setStatusFilter(status as any)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-red-400">{criticalCount}</div>
                <div className="text-xs text-red-300">Critical</div>
              </CardContent>
            </Card>
            <Card className="bg-[#FF9933]/10 border-[#FF9933]/30">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-[#FF9933]">{warningCount}</div>
                <div className="text-xs text-[#FF9933]/80">Warning</div>
              </CardContent>
            </Card>
            <Card className="bg-[#138808]/10 border-[#138808]/30">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-[#138808]">
                  {alerts.filter(a => a.status === 'resolved').length}
                </div>
                <div className="text-xs text-[#138808]/80">Resolved</div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredAlerts.map((alert, index) => {
                const Icon = getAlertIcon(alert.type, alert.category);
                const colors = getAlertColor(alert.type);
                
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Alert Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${colors.icon}`} />
                      </div>

                      {/* Alert Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className={`font-medium ${colors.text} text-sm`}>
                            {alert.title}
                          </h4>
                          <Badge className={`text-xs ${getStatusColor(alert.status)}`}>
                            {alert.status}
                          </Badge>
                        </div>

                        <p className="text-xs text-white/80 mb-2 leading-relaxed">
                          {alert.message}
                        </p>

                        {/* Alert Metadata */}
                        <div className="space-y-1 text-xs text-white/60">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          </div>
                          {alert.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>Assigned to: {alert.assignedTo}</span>
                            </div>
                          )}
                          {alert.estimatedResolution && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>ETA: {alert.estimatedResolution}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {alert.status !== 'resolved' && (
                          <div className="flex gap-2 mt-3">
                            {alert.status === 'active' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs bg-[#FF9933]/20 hover:bg-[#FF9933]/30 text-[#FF9933] border border-[#FF9933]/50"
                                onClick={() => handleAcknowledge(alert.id)}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Acknowledge
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs bg-[#138808]/20 hover:bg-[#138808]/30 text-[#138808] border border-[#138808]/50"
                              onClick={() => handleResolve(alert.id)}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Priority Indicator */}
                    {alert.type === 'critical' && (
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l-lg"
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredAlerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-[#138808] mx-auto mb-3" />
                <h3 className="text-white font-medium mb-1">All Clear!</h3>
                <p className="text-white/60 text-sm">No alerts match your current filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}