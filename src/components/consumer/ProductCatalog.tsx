import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  ShoppingCart, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Leaf,
  Heart,
  Clock,
  QrCode
} from 'lucide-react';
import { odishaConsumerProducts, OdishaProduct } from '../../data/odishaConsumerData';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';

interface ProductCatalogProps {
  onAddToCart: (product: any) => void;
  onViewProduct: (product: OdishaProduct) => void;
}

export function ProductCatalog({ onAddToCart, onViewProduct }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguage();

  const products = odishaConsumerProducts.products;

  // Extract unique values for filters
  const districts = [...new Set(products.map(p => p.warehouse_location.split(',')[1].trim()))];
  const cropTypes = [...new Set(products.map(p => p.name.split(' ')[0]))];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.warehouse_location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDistrict = selectedDistrict === 'all' || 
                             product.warehouse_location.includes(selectedDistrict);
      
      const matchesCrop = selectedCrop === 'all' || 
                         product.name.toLowerCase().includes(selectedCrop.toLowerCase());
      
      const matchesPrice = priceRange === 'all' || 
                          (priceRange === 'low' && product.price_per_kg <= 50) ||
                          (priceRange === 'medium' && product.price_per_kg > 50 && product.price_per_kg <= 100) ||
                          (priceRange === 'high' && product.price_per_kg > 100);
      
      return matchesSearch && matchesDistrict && matchesCrop && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price_per_kg - b.price_per_kg;
        case 'price_high':
          return b.price_per_kg - a.price_per_kg;
        case 'rating':
          return b.rating - a.rating;
        case 'quantity':
          return b.available_quantity_kg - a.available_quantity_kg;
        case 'delivery':
          return a.delivery_time_hours - b.delivery_time_hours;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, selectedDistrict, selectedCrop, priceRange, sortBy]);

  const handleAddToCart = (product: OdishaProduct) => {
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
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Product Catalog
            <Badge variant="outline" className="ml-auto">
              {filteredProducts.length} products
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products, farmers, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg"
            >
              <div>
                <label className="text-sm font-medium mb-2 block">District</label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {districts.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Crop Type</label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Crops" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crops</SelectItem>
                    {cropTypes.map(crop => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="low">₹0 - ₹50</SelectItem>
                    <SelectItem value="medium">₹50 - ₹100</SelectItem>
                    <SelectItem value="high">₹100+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price_low">Price (Low to High)</SelectItem>
                    <SelectItem value="price_high">Price (High to Low)</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="quantity">Quantity Available</SelectItem>
                    <SelectItem value="delivery">Delivery Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300 h-full">
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 space-y-1">
                  {product.trending && (
                    <Badge className="bg-red-500 text-white text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {product.bestseller && (
                    <Badge className="bg-orange-500 text-white text-xs">
                      ⭐ Bestseller
                    </Badge>
                  )}
                  {product.new_arrival && (
                    <Badge className="bg-green-500 text-white text-xs">
                      🆕 New
                    </Badge>
                  )}
                </div>

                {/* Discount Badge */}
                {product.discount_percentage > 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-600 text-white">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      {product.discount_percentage}% OFF
                    </Badge>
                  </div>
                )}

                {/* Wishlist Button */}
                <div className="absolute bottom-2 right-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="p-2 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  {product.variety && (
                    <p className="text-sm text-muted-foreground">Variety: {product.variety}</p>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {product.farmer_name} • {product.warehouse_location.split(',')[1]?.trim()}
                  </div>
                </div>

                {/* Price and Rating */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-green-600">
                      ₹{product.price_per_kg}/kg
                    </span>
                    {product.original_price_per_kg > product.price_per_kg && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ₹{product.original_price_per_kg}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Organic Badge */}
                {product.organic_certified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Leaf className="w-3 h-3 mr-1" />
                    Organic Certified
                  </Badge>
                )}

                {/* Carbon Footprint */}
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">Carbon Saved:</span>
                    <span className="font-medium text-green-800">
                      {product.carbon_saved_per_kg.toFixed(2)} kg CO₂/kg
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {product.delivery_time_hours}h delivery
                  </div>
                  <div className="flex items-center">
                    <QrCode className="w-3 h-3 mr-1" />
                    QR Verified
                  </div>
                </div>

                {/* Stock Info */}
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium">
                      {product.available_quantity_kg > 1000 
                        ? `${(product.available_quantity_kg / 1000).toFixed(1)}T` 
                        : `${product.available_quantity_kg}kg`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Min Order:</span>
                    <span className="font-medium">{product.minimum_order_kg}kg</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => onViewProduct(product)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedDistrict('all');
                setSelectedCrop('all');
                setPriceRange('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}