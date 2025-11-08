import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  X, 
  Star, 
  MapPin, 
  ShoppingCart, 
  Heart, 
  Share2, 
  QrCode,
  Leaf,
  Clock,
  User,
  Phone,
  Truck,
  CheckCircle,
  Package,
  BarChart3
} from 'lucide-react';
import { OdishaProduct } from '../../data/odishaConsumerData';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProductDetailsModalProps {
  product: OdishaProduct;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

export function ProductDetailsModal({ product, onClose, onAddToCart }: ProductDetailsModalProps) {
  const { t } = useLanguage();

  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      variety: product.variety,
      farmer: product.farmer_name,
      location: product.warehouse_location,
      price: product.price_per_kg,
      originalPrice: product.original_price_per_kg,
      rating: product.rating,
      organic: product.organic_certified,
      batch_id: product.batch_id,
      blockchain_hash: product.blockchain_contract_id,
      warehouse: product.warehouse_id,
      image: product.image_url,
      deliveryTime: `${product.delivery_time_hours} hours`,
      carbonSaved: product.carbon_saved_per_kg,
      minOrder: product.minimum_order_kg,
      maxOrder: product.maximum_order_kg
    };
    
    onAddToCart(cartProduct);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Product Details</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
                
                {/* Badges on Image */}
                <div className="absolute top-4 left-4 space-y-2">
                  {product.organic_certified && (
                    <Badge className="bg-green-600 text-white">
                      <Leaf className="w-3 h-3 mr-1" />
                      Organic
                    </Badge>
                  )}
                  {product.trending && (
                    <Badge className="bg-red-500 text-white">
                      🔥 Trending
                    </Badge>
                  )}
                  {product.bestseller && (
                    <Badge className="bg-orange-500 text-white">
                      ⭐ Bestseller
                    </Badge>
                  )}
                </div>

                {/* QR Code Badge */}
                <div className="absolute bottom-4 right-4">
                  <Badge variant="outline" className="bg-white/90">
                    <QrCode className="w-3 h-3 mr-1" />
                    Scan for Journey
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 text-center">
                  <div className="text-lg font-bold text-green-600">{product.rating.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">{product.delivery_time_hours}h</div>
                  <div className="text-xs text-muted-foreground">Delivery</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-lg font-bold text-purple-600">{product.community_votes}</div>
                  <div className="text-xs text-muted-foreground">Votes</div>
                </Card>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{product.name}</h2>
                {product.variety && (
                  <p className="text-lg text-muted-foreground">Variety: {product.variety}</p>
                )}
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      ({product.community_votes} votes)
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {product.warehouse_location.split(',')[1]?.trim()}
                  </Badge>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">
                    ₹{product.price_per_kg.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">/kg</span>
                  {product.original_price_per_kg > product.price_per_kg && (
                    <>
                      <span className="text-lg text-muted-foreground line-through ml-2">
                        ₹{product.original_price_per_kg.toFixed(2)}
                      </span>
                      <Badge className="bg-green-600 text-white ml-2">
                        {product.discount_percentage}% OFF
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Community-fixed price • No middlemen markup
                </p>
              </div>

              {/* Order Information */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Order Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Min Order:</span>
                    <span className="ml-2 font-medium">{product.minimum_order_kg}kg</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max Order:</span>
                    <span className="ml-2 font-medium">{product.maximum_order_kg}kg</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available:</span>
                    <span className="ml-2 font-medium">
                      {product.available_quantity_kg > 1000 
                        ? `${(product.available_quantity_kg / 1000).toFixed(1)}T` 
                        : `${product.available_quantity_kg}kg`}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Delivery:</span>
                    <span className="ml-2 font-medium">{product.delivery_time_hours} hours</span>
                  </div>
                </div>
              </div>

              {/* Carbon Impact */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Environmental Impact</span>
                </div>
                <p className="text-sm text-green-700">
                  Save <span className="font-bold">{product.carbon_saved_per_kg.toFixed(2)} kg CO₂</span> per kg
                  by buying directly from farmers
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleAddToCart} className="flex-1" size="lg">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="px-6">
                  <QrCode className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Farmer Information */}
          <Card>
            <div className="p-4">
              <h3 className="flex items-center gap-2 font-semibold mb-4">
                <User className="w-5 h-5 text-orange-600" />
                Farmer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">{product.farmer_name}</p>
                    <p className="text-sm text-muted-foreground">Verified Farmer</p>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {product.farm_location.village}, {product.farm_location.district}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-3 h-3 mr-1" />
                    {product.farmer_contact}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Farm Size:</span>
                    <span className="ml-2 font-medium">{product.farm_location.land_size_acres} acres</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <span className="ml-2 font-medium">{product.farm_location.gps_coordinates}</span>
                  </div>
                  {product.quality_certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.quality_certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Harvest & Storage Info */}
            <Card>
              <div className="p-4">
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <Package className="w-5 h-5 text-blue-600" />
                  Harvest & Storage
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Harvest Date:</span>
                    <span className="ml-2 font-medium">
                      {new Date(product.harvest_date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Batch ID:</span>
                    <span className="ml-2 font-mono text-xs">{product.batch_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expiry Date:</span>
                    <span className="ml-2 font-medium">
                      {new Date(product.expiry_date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Storage Temp:</span>
                    <span className="ml-2 font-medium">{product.storage_temp}</span>
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline" className="text-purple-600 border-purple-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Blockchain Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Nutritional Information */}
            <Card>
              <div className="p-4">
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Nutritional Info (per 100g)
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calories:</span>
                    <span className="font-medium">{product.nutritional_info.calories_per_100g}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein:</span>
                    <span className="font-medium">{product.nutritional_info.protein_g}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbohydrates:</span>
                    <span className="font-medium">{product.nutritional_info.carbs_g}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fiber:</span>
                    <span className="font-medium">{product.nutritional_info.fiber_g}g</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Delivery Information */}
          <Card>
            <div className="p-4">
              <h3 className="flex items-center gap-2 font-semibold mb-4">
                <Truck className="w-5 h-5 text-blue-600" />
                Delivery Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">Delivery Partners</p>
                  <div className="mt-2 space-y-1">
                    {product.delivery_partners.map((partner, index) => (
                      <Badge key={index} variant="outline" className="mr-2 text-xs">
                        {partner}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium">Delivery Time</p>
                  <div className="flex items-center mt-2 text-sm">
                    <Clock className="w-4 h-4 mr-2 text-green-600" />
                    <span>{product.delivery_time_hours} hours</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium">From Warehouse</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {product.warehouse_location}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}