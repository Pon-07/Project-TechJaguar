import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Camera, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Droplets, 
  Thermometer,
  CloudRain,
  Shield,
  Award,
  Upload,
  Navigation,
  Package,
  Users,
  QrCode,
  Phone
} from 'lucide-react';
import { EnhancedIcon, getThemeColor } from './EnhancedIcon';
import { FarmerDashboard } from './farmer/FarmerDashboard';
import { FarmerQRProfile } from './farmer/FarmerQRProfile';
import { FarmerQRHistory } from './farmer/FarmerQRHistory';
import { FarmerProductHistory } from './farmer/FarmerProductHistory';
import { CommunityHub } from './farmer/CommunityHub';
import { FarmerQRHub } from './farmer/FarmerQRHub';
import { QRSystemHub } from './qr/QRSystemHub';
import { EnhancedQRSystemPerfect } from './enhanced/EnhancedQRSystemPerfect';
import { PredictiveAnalyticsHub } from './analytics/PredictiveAnalyticsHub';
import { TrackingMap3D } from './tracking/TrackingMap3D';
import { TrackingOverview } from './tracking/TrackingOverview';
import { TrackingTimeline } from './tracking/TrackingTimeline';
import { LiveTrackingMap } from './tracking/LiveTrackingMap';
import { AmazonStyleTimeline } from './tracking/AmazonStyleTimeline';
import { FarmerFriendlyOverview } from './tracking/FarmerFriendlyOverview';
import { CallButton } from './CallButton';
import { FarmerLoginFlow } from './FarmerLoginFlow';
import { useLanguage } from '../contexts/LanguageContext';
import { trackingData, getTrackingByFarmer } from '../data/tracking';
import { toast } from 'sonner@2.0.3';
import { notificationManager } from './NotificationSystem';
import { odishaFarmers, odishaProducts } from '../data/dummyData';
import { odishaSupportNumbers } from '../data/odishaLocationData';
import { FarmerModuleProps } from '../types/user';

export function FarmerModule({ user, setUser }: FarmerModuleProps) {
  const [farmerLoggedIn, setFarmerLoggedIn] = useState(false);
  const [showFarmerLogin, setShowFarmerLogin] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState<string>();
  const { t } = useLanguage();

  // Check if farmer has completed Aadhaar-based login
  useEffect(() => {
    try {
      const savedFarmerLogin = localStorage.getItem('greenledger-farmer-login');
      if (savedFarmerLogin === 'true') {
        setFarmerLoggedIn(true);
        setShowFarmerLogin(false);
      } else if (user) {
        // If user is logged in via email/password (has email), auto-approve farmer access
        // Only require Aadhaar login for users who logged in via the old Aadhaar flow
        const isEmailPasswordUser = user.email && !user.aadhaar;
        const isFarmerRole = user.role === 'farmer' || !user.role; // Default to farmer if no role
        
        if (isEmailPasswordUser && isFarmerRole) {
          // Auto-login for email/password authenticated farmers
          setFarmerLoggedIn(true);
          setShowFarmerLogin(false);
          localStorage.setItem('greenledger-farmer-login', 'true');
        } else {
          // Show farmer login for Aadhaar-based users or users without email
          setShowFarmerLogin(true);
        }
      }
    } catch (error) {
      console.warn('Error loading farmer login state:', error);
      if (user) {
        // Default: if user has email, allow access; otherwise show farmer login
        if (user.email) {
          setFarmerLoggedIn(true);
          setShowFarmerLogin(false);
        } else {
          setShowFarmerLogin(true);
        }
      }
    }
  }, [user]);

  // Handle farmer login success
  const handleFarmerLoginSuccess = () => {
    setFarmerLoggedIn(true);
    setShowFarmerLogin(false);
    
    // Save farmer login state
    try {
      localStorage.setItem('greenledger-farmer-login', 'true');
    } catch (error) {
      console.warn('Error saving farmer login state:', error);
    }

    // Enhance user data with farmer-specific information if not present
    if (user && (!user.uzhavarPin || !user.crops)) {
      const enhancedUser = {
        ...user,
        uzhavarPin: user.uzhavarPin || `UZP-${user.district?.slice(0, 3).toUpperCase() || 'KHO'}-${Math.floor(Math.random() * 1000000)}`,
        crops: user.crops || ['Paddy', 'Vegetables', 'Turmeric'],
        landSize: user.landSize || '5.2 acres',
        verified: true,
        district: user.district || 'Khordha',
        aadhaarNumber: user.aadhaarNumber || '****-****-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        phoneNumber: user.phoneNumber || '+91-9876543210'
      };
      
      setUser(enhancedUser);
      
      // Save enhanced user data
      try {
        localStorage.setItem('greenledger-user', JSON.stringify(enhancedUser));
      } catch (error) {
        console.warn('Error saving enhanced user data:', error);
      }
    }

    // Show success notification with glowing effect
    toast.success('🎉 Farmer Hub Access Granted!', {
      duration: 5000,
      description: 'Aadhaar verification successful. Welcome to GreenLedger Farmer Hub!',
    });

    // Generate QR code in background and show notification
    setTimeout(() => {
      const farmerUser = user || { name: 'Farmer', uzhavarPin: 'UZP-DEMO-123456', crops: ['Paddy'] };
      const qrData = {
        productName: farmerUser.crops?.[0] || 'Paddy',
        farmerName: farmerUser.name,
        uzhavarPin: farmerUser.uzhavarPin || 'UZP-DEMO-123456',
        qrCodeUrl: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5RUi0ke2Zhcm1lclVzZXIudXpoYXZhclBpbn08L3RleHQ+Cjwvc3ZnPg==`
      };
      
      notificationManager.showQRGenerated(qrData);
    }, 1000);
  };

  // Handle farmer login cancellation
  const handleFarmerLoginCancel = () => {
    setShowFarmerLogin(false);
    // Optionally redirect to a different module or show a message
    toast.info('Farmer Hub access cancelled. You can try again anytime.');
  };

  // If general user is not logged in, show message
  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to access Farmer Hub</h2>
          <p className="text-gray-600">Use the main login system to authenticate and access your farmer dashboard.</p>
        </div>
      </div>
    );
  }

  // If farmer-specific login is required, show FarmerLoginFlow
  if (showFarmerLogin && !farmerLoggedIn) {
    return (
      <FarmerLoginFlow
        onLoginSuccess={handleFarmerLoginSuccess}
        onCancel={handleFarmerLoginCancel}
      />
    );
  }

  // If farmer hasn't completed Aadhaar login, show access denied
  if (!farmerLoggedIn) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <Shield className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Farmer Hub Access Required</h2>
          <p className="text-gray-600 mb-6">
            Complete Aadhaar-based authentication to access GreenLedger Farmer Hub
          </p>
          <Button 
            onClick={() => setShowFarmerLogin(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            Start Farmer Authentication
          </Button>
        </div>
      </div>
    );
  }

  // Get farmer's tracking data using Uzhavar PIN
  const farmerTrackingData = user?.uzhavarPin ? getTrackingByFarmer(user.uzhavarPin) : [];

  return (
    <div className="container mx-auto p-4 space-y-6" style={{ position: 'relative', overflow: 'visible' }}>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-amber-500 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('notification.welcome')}, {user?.name || 'Farmer'}!</h1>
            <p className="text-green-100">
              Uzhavar PIN: {user?.uzhavarPin || 'N/A'} • {user?.location || 'Unknown Location'}
            </p>
            <div className="flex items-center mt-2 space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <MapPin className="w-3 h-3 mr-1" />
                {user?.landSize || 'N/A'}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Award className="w-3 h-3 mr-1" />
                Verified Farmer
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Shield className="w-3 h-3 mr-1" />
                Aadhaar Verified
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">₹{(user?.totalIncome || 0).toLocaleString()}</div>
            <div className="text-sm text-green-100">{t('farmer.totalProfit')}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{user?.monthlyGrowth || 0}% this month
            </div>
          </div>
        </div>

        {/* Floating animation */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="w-20 h-20" />
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Support Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />
            Quick Support & Contact
          </CardTitle>
          <p className="text-muted-foreground">
            Get instant help for farming, delivery, and customer inquiries
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CallButton
              phoneNumber="+91-99999-00001"
              description="Help with customer inquiries and product sales"
              module="farmer"
              size="md"
            />
            <CallButton
              phoneNumber="+91-99999-00002"
              label={t('call.warehouse')}
              description="Coordinate crop delivery and storage"
              module="farmer"
              size="md"
            />
            <CallButton
              phoneNumber="+91-99999-00003"
              label="Delivery Service"
              description="Track shipments and delivery status"
              module="farmer"
              size="md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Farmer QR Profile - Always Visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FarmerQRProfile user={user} />
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('farmer.weatherAlert'), value: '28°C', icon: Thermometer, color: 'text-orange-600' },
          { label: 'Humidity', value: '65%', icon: Droplets, color: 'text-blue-600' },
          { label: 'Rain Forecast', value: '3 days', icon: CloudRain, color: 'text-indigo-600' },
          { label: t('nav.greenPoints'), value: user?.greenPoints || 0, icon: Award, color: 'text-green-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <EnhancedIcon
                    icon={stat.icon}
                    size="xl"
                    glowColor={getThemeColor('farmer')}
                    pulse={true}
                    className={stat.color}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Farmer Dashboard Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <EnhancedIcon 
                  icon={User} 
                  size="sm" 
                  glowColor={getThemeColor('farmer')} 
                  pulse={true}
                />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2">
                <EnhancedIcon 
                  icon={Users} 
                  size="sm" 
                  glowColor={getThemeColor('farmer')} 
                  pulse={true}
                />
                Community
              </TabsTrigger>
              <TabsTrigger value="qr-hub" className="flex items-center gap-2">
                <EnhancedIcon 
                  icon={QrCode} 
                  size="sm" 
                  glowColor={getThemeColor('farmer')} 
                  pulse={true}
                />
                QR Hub
              </TabsTrigger>
              <TabsTrigger value="product-history" className="flex items-center gap-2">
                <EnhancedIcon 
                  icon={Package} 
                  size="sm" 
                  glowColor={getThemeColor('farmer')} 
                  pulse={true}
                />
                Product History
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <EnhancedIcon 
                  icon={Navigation} 
                  size="sm" 
                  glowColor={getThemeColor('farmer')} 
                  pulse={true}
                />
                Tracking
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <EnhancedIcon 
                  icon={TrendingUp} 
                  size="sm" 
                  glowColor={getThemeColor('farmer')} 
                  pulse={true}
                />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="qr-system" className="flex items-center gap-2">
                <EnhancedIcon 
                  icon={Package} 
                  size="sm" 
                  glowColor={getThemeColor('farmer')} 
                  pulse={true}
                />
                QR System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <FarmerDashboard user={user} />
            </TabsContent>

            <TabsContent value="community" className="mt-6">
              <CommunityHub user={user} />
            </TabsContent>

            <TabsContent value="qr-hub" className="mt-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">QR Profile</TabsTrigger>
                  <TabsTrigger value="history">QR History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-6">
                  <FarmerQRProfile user={user} />
                </TabsContent>
                
                <TabsContent value="history" className="mt-6">
                  <FarmerQRHistory />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="product-history" className="mt-6">
              <FarmerProductHistory user={user} />
            </TabsContent>

            <TabsContent value="tracking" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-blue-600" />
                    {t('tracking.liveTracking')}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Monitor your crop shipments and deliveries in real-time
                  </p>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">{t('tracking.orderTracking')}</TabsTrigger>
                      <TabsTrigger value="map3d">{t('ar.viewIn3D')}</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-6">
                      <FarmerFriendlyOverview 
                        trackingData={farmerTrackingData}
                        selectedTracking={selectedTracking}
                        onTrackingSelect={setSelectedTracking}
                        viewMode="farmer"
                      />
                    </TabsContent>
                    
                    <TabsContent value="map3d" className="mt-6">
                      <LiveTrackingMap 
                        trackingData={farmerTrackingData}
                        selectedTracking={selectedTracking}
                        onTrackingSelect={setSelectedTracking}
                        viewMode="farmer"
                      />
                    </TabsContent>
                    
                    <TabsContent value="timeline" className="mt-6">
                      {selectedTracking ? (
                        <AmazonStyleTimeline 
                          trackingRoute={farmerTrackingData.find(route => route.tracking_id === selectedTracking)!}
                          viewMode="farmer"
                        />
                      ) : (
                        <Card className="text-center py-12">
                          <CardContent>
                            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Select a Shipment</h3>
                            <p className="text-muted-foreground">
                              Choose a shipment from the overview or map to view detailed tracking timeline
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <PredictiveAnalyticsHub viewMode="farmer" />
            </TabsContent>

            <TabsContent value="qr-system" className="mt-6">
              <EnhancedQRSystemPerfect />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}