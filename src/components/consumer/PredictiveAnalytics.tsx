import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Clock, 
  ShoppingCart,
  AlertCircle,
  Zap,
  Calendar,
  DollarSign
} from 'lucide-react';
import { odishaConsumerAnalytics } from '../../data/odishaConsumerData';
import { useLanguage } from '../../contexts/LanguageContext';

interface PredictiveAnalyticsProps {
  onProductClick: (productId: string) => void;
}

export function PredictiveAnalytics({ onProductClick }: PredictiveAnalyticsProps) {
  const { t } = useLanguage();
  const analytics = odishaConsumerAnalytics;

  const getTrendIcon = (percentage: number) => {
    return percentage > 0 ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (percentage: number) => {
    return percentage > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getDemandColor = (demand: string) => {
    switch (demand.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'stable': return 'bg-green-100 text-green-800 border-green-200';
      case 'rising': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Trending Crops Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Market Trends & Predictions
            <Badge variant="outline" className="ml-auto">
              AI Powered
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Real-time market analysis and demand forecasting for smart shopping decisions
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {analytics.trending_crops.map((crop, index) => {
              const TrendIcon = getTrendIcon(crop.trend_percentage);
              const trendColorClass = getTrendColor(crop.trend_percentage);
              
              return (
                <motion.div
                  key={crop.crop}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{crop.crop}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getDemandColor(crop.demand_forecast)}>
                          {crop.demand_forecast} Demand
                        </Badge>
                        <div className={`flex items-center ${trendColorClass}`}>
                          <TrendIcon className="w-4 h-4 mr-1" />
                          <span className="font-medium">{Math.abs(crop.trend_percentage)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`flex items-center ${crop.predicted_price_change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {crop.predicted_price_change < 0 ? (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        )}
                        <span className="font-bold">
                          {crop.predicted_price_change > 0 ? '+' : ''}{crop.predicted_price_change}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Price Change</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Available Stock</p>
                      <p className="font-medium">
                        {crop.total_stock_kg > 1000 
                          ? `${(crop.total_stock_kg / 1000).toFixed(0)}T` 
                          : `${crop.total_stock_kg}kg`}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Warehouses</p>
                      <p className="font-medium">{crop.available_warehouses}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Best Time to Buy</p>
                      <p className="font-medium text-blue-600">{crop.recommended_purchase_time}</p>
                    </div>
                    <div className="flex items-end">
                      {crop.predicted_price_change < 0 && (
                        <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Buy Now
                        </Button>
                      )}
                      {crop.predicted_price_change > 10 && (
                        <Button size="sm" variant="outline" className="text-orange-600 border-orange-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Wait
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar for Stock Level */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Stock Level</span>
                      <span>{((crop.total_stock_kg / 1000000) * 100).toFixed(0)}% of capacity</span>
                    </div>
                    <Progress 
                      value={(crop.total_stock_kg / 1000000) * 100} 
                      className="h-2"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Deals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Flash Deals & Price Drops
          </CardTitle>
          <p className="text-muted-foreground">
            Limited time offers based on predictive pricing
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {analytics.weekly_deals.map((deal, index) => (
              <motion.div
                key={deal.product_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500 text-white">
                      {deal.discount_percentage}% OFF
                    </Badge>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      <Clock className="w-3 h-3 mr-1" />
                      Limited Time
                    </Badge>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600">
                        ₹{deal.deal_price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{deal.original_price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">per kg</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">Deal Ends</p>
                    <p className="font-medium text-red-600">
                      {new Date(deal.deal_ends).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stock Left</p>
                    <p className="font-medium">
                      {deal.stock_left > 1000 
                        ? `${(deal.stock_left / 1000).toFixed(1)}T` 
                        : `${deal.stock_left}kg`}
                    </p>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      size="sm" 
                      className="bg-yellow-600 hover:bg-yellow-700 w-full"
                      onClick={() => onProductClick(deal.product_id)}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Grab Deal
                    </Button>
                  </div>
                </div>
                
                {/* Countdown Progress */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Time Remaining</span>
                    <span>{Math.floor((new Date(deal.deal_ends).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left</span>
                  </div>
                  <Progress 
                    value={Math.max(0, 100 - ((Date.now() - new Date('2025-09-21').getTime()) / (new Date(deal.deal_ends).getTime() - new Date('2025-09-21').getTime())) * 100)} 
                    className="h-2"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Personalized Recommendations
            <Badge variant="outline" className="ml-auto">
              For You
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Smart suggestions based on your shopping patterns and preferences
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.personalized_recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{recommendation.reason}</h3>
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    AI Suggested
                  </Badge>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {recommendation.products.map((productId, productIndex) => (
                    <Button
                      key={productIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => onProductClick(productId)}
                      className="text-xs"
                    >
                      View Product {productIndex + 1}
                    </Button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Smart Shopping Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Best Time to Shop</p>
                <p className="text-sm text-muted-foreground">
                  Early morning (6-8 AM) for freshest arrivals and best prices
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Bulk Buying Benefits</p>
                <p className="text-sm text-muted-foreground">
                  Orders above ₹500 get free delivery and 5% extra green points
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Seasonal Advice</p>
                <p className="text-sm text-muted-foreground">
                  Post-harvest season (Sept-Nov) offers 15-25% lower prices
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}