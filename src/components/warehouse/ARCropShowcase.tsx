import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  X, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Scan,
  MapPin,
  Clock,
  Star,
  Leaf,
  Droplets,
  Sun
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ARCropShowcaseProps {
  product: any;
  onClose: () => void;
}

export function ARCropShowcase({ product, onClose }: ARCropShowcaseProps) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  const farmDetails = {
    soilType: 'Alluvial',
    waterSource: 'Rainwater + Drip Irrigation',
    fertilizer: 'Organic Compost',
    pesticides: 'None (Organic)',
    harvestMethod: 'Hand-picked',
    storage: 'Climate Controlled',
    certifications: ['Organic', 'Fair Trade', 'Non-GMO']
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Scan className="w-5 h-5 mr-2 text-purple-600" />
            AR Crop Showcase - {product.name}
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
              3D View
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* 3D Showcase */}
          <div className="relative bg-gradient-to-b from-sky-100 to-green-50 rounded-lg overflow-hidden">
            <div className="absolute top-4 right-4 z-10 space-y-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setRotation(rotation + 90)}
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-center h-full p-8">
              <motion.div
                animate={{ rotate: rotation }}
                style={{ scale: zoom }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* 3D-like crop representation */}
                <div className="relative w-64 h-64">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-full shadow-2xl"
                  />
                  
                  {/* Floating info badges */}
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg"
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{product.freshness}%</div>
                      <div className="text-xs text-muted-foreground">Fresh</div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-4 -left-4 bg-white rounded-full p-2 shadow-lg"
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{product.rating}</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </motion.div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-20 blur-xl -z-10" />
                </div>
              </motion.div>
            </div>

            {/* AR Instructions */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center space-x-2 text-sm">
                <Eye className="w-4 h-4 text-purple-600" />
                <span>Rotate, zoom, and explore the crop in 3D</span>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 overflow-y-auto">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{product.farmer} • {product.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                <span className="text-muted-foreground">/kg</span>
              </div>
              <Badge variant="outline">
                {product.stock} kg available
              </Badge>
            </div>

            {/* Freshness Indicator */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Freshness Score</span>
                <span className="font-bold text-green-600">{product.freshness}%</span>
              </div>
              <Progress value={product.freshness} className="mb-2" />
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                Harvested {product.harvestDate}
              </div>
            </div>

            {/* Farm Details Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full"
            >
              {showDetails ? 'Hide' : 'Show'} Farm Details
            </Button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <Droplets className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="text-sm font-medium">Water Source</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{farmDetails.waterSource}</p>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <Sun className="w-4 h-4 text-amber-600 mr-1" />
                      <span className="text-sm font-medium">Soil Type</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{farmDetails.soilType}</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <Leaf className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium">Certifications</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {farmDetails.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fertilizer:</span>
                    <span>{farmDetails.fertilizer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pesticides:</span>
                    <span>{farmDetails.pesticides}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harvest Method:</span>
                    <span>{farmDetails.harvestMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Storage:</span>
                    <span>{farmDetails.storage}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                Add to Cart
              </Button>
              <Button variant="outline">
                Contact Farmer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}