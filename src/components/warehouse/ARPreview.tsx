import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Play, RotateCcw, ZoomIn, Maximize } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';

interface ARPreviewProps {
  asset3D: string;
  title: string;
  subtitle: string;
}

export function ARPreview({ asset3D, title, subtitle }: ARPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleARView = () => {
    setIsLoading(true);
    // Simulate AR loading
    setTimeout(() => {
      setIsLoading(false);
      toast.success('AR viewer would open here in a real implementation');
    }, 1500);
  };

  const handle3DView = () => {
    toast.success('3D viewer would open here in a real implementation');
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 aspect-video flex items-center justify-center">
          {/* 3D Preview Placeholder */}
          <div className="text-center">
            <motion.div
              animate={{ 
                rotateY: isLoading ? 360 : 0,
                scale: isLoading ? 0.9 : 1
              }}
              transition={{ 
                duration: isLoading ? 2 : 0.3,
                repeat: isLoading ? Infinity : 0,
                ease: "linear"
              }}
              className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3"
            >
              <Eye className="w-8 h-8 text-green-600" />
            </motion.div>
            <div className="text-sm font-medium text-gray-700">{title}</div>
            <div className="text-xs text-gray-500">{subtitle}</div>
          </div>

          {/* AR Badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              AR Ready
            </Badge>
          </div>

          {/* Asset Name */}
          <div className="absolute bottom-2 left-2">
            <div className="text-xs font-mono text-gray-600 bg-white/80 px-2 py-1 rounded">
              {asset3D}
            </div>
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
            >
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
                <div className="text-sm font-medium">Loading AR...</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleARView}
                disabled={isLoading}
                className="flex items-center gap-1 text-xs"
              >
                <Eye className="w-3 h-3" />
                AR View
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handle3DView}
                className="flex items-center gap-1 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                3D
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Maximize className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}