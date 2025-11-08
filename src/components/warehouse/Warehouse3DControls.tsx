import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  RotateCcw,
  Plane,
  Eye,
  Drone,
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2
} from 'lucide-react';

type Direction = 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down' | 'rotate-left' | 'rotate-right';

interface Warehouse3DControlsProps {
  onMove: (direction: Direction) => void;
  droneMode: boolean;
  onToggleDrone: () => void;
}

export function Warehouse3DControls({ onMove, droneMode, onToggleDrone }: Warehouse3DControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const controlButtons = [
    { direction: 'forward' as Direction, icon: ArrowUp, position: 'top-4 left-1/2 -translate-x-1/2' },
    { direction: 'backward' as Direction, icon: ArrowDown, position: 'bottom-4 left-1/2 -translate-x-1/2' },
    { direction: 'left' as Direction, icon: ArrowLeft, position: 'top-1/2 -translate-y-1/2 left-4' },
    { direction: 'right' as Direction, icon: ArrowRight, position: 'top-1/2 -translate-y-1/2 right-4' },
  ];

  const elevationButtons = [
    { direction: 'up' as Direction, icon: ArrowUp, label: 'UP' },
    { direction: 'down' as Direction, icon: ArrowDown, label: 'DOWN' },
  ];

  const rotationButtons = [
    { direction: 'rotate-left' as Direction, icon: RotateCcw, label: 'ROTATE L' },
    { direction: 'rotate-right' as Direction, icon: RotateCw, label: 'ROTATE R' },
  ];

  return (
    <div className="absolute bottom-4 left-4 z-30">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Main Joystick Control */}
        <Card className="bg-black/20 backdrop-blur-lg border border-[#FF9933]/30">
          <CardContent className="p-4">
            <div className="relative w-32 h-32">
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#FF9933] to-[#0B3D91] rounded-full border-2 border-white/30">
                <div className="absolute inset-1 bg-black/30 rounded-full" />
              </div>

              {/* Directional Buttons */}
              {controlButtons.map(({ direction, icon: Icon, position }) => (
                <Button
                  key={direction}
                  variant="ghost"
                  size="sm"
                  className={`absolute ${position} w-8 h-8 p-0 bg-[#FF9933]/20 hover:bg-[#FF9933]/40 border border-[#FF9933]/50 text-white rounded-full transition-all duration-200`}
                  onMouseDown={() => onMove(direction)}
                  onTouchStart={() => onMove(direction)}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}

              {/* Outer Ring */}
              <div className="absolute inset-0 border-2 border-[#FF9933]/30 rounded-full animate-pulse" />
              <div className="absolute inset-2 border border-[#0B3D91]/20 rounded-full" />
            </div>

            {/* Joystick Label */}
            <div className="text-center mt-2">
              <div className="text-xs text-[#FF9933] font-medium">NAVIGATION</div>
              <div className="text-xs text-white/60">Joystick Control</div>
            </div>
          </CardContent>
        </Card>

        {/* Elevation Controls */}
        <Card className="bg-black/20 backdrop-blur-lg border border-[#0B3D91]/30">
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="text-xs text-[#0B3D91] font-medium text-center mb-2">ELEVATION</div>
              {elevationButtons.map(({ direction, icon: Icon, label }) => (
                <Button
                  key={direction}
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 bg-[#0B3D91]/20 hover:bg-[#0B3D91]/40 border border-[#0B3D91]/50 text-white"
                  onMouseDown={() => onMove(direction)}
                  onTouchStart={() => onMove(direction)}
                >
                  <Icon className="w-3 h-3 mr-2" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rotation Controls */}
        <Card className="bg-black/20 backdrop-blur-lg border border-[#138808]/30">
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="text-xs text-[#138808] font-medium text-center mb-2">ROTATION</div>
              {rotationButtons.map(({ direction, icon: Icon, label }) => (
                <Button
                  key={direction}
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 bg-[#138808]/20 hover:bg-[#138808]/40 border border-[#138808]/50 text-white"
                  onMouseDown={() => onMove(direction)}
                  onTouchStart={() => onMove(direction)}
                >
                  <Icon className="w-3 h-3 mr-2" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Special Controls */}
        <Card className="bg-black/20 backdrop-blur-lg border border-white/20">
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="text-xs text-white font-medium text-center mb-2">SPECIAL</div>
              
              {/* Drone Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className={`w-full h-10 transition-all duration-300 ${
                  droneMode 
                    ? 'bg-[#FF9933]/30 border-[#FF9933] text-[#FF9933] animate-pulse' 
                    : 'bg-[#FF9933]/10 border-[#FF9933]/50 text-white hover:bg-[#FF9933]/20'
                }`}
                onClick={onToggleDrone}
              >
                <motion.div
                  animate={droneMode ? { y: [-2, 2, -2] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex items-center"
                >
                  <Drone className="w-4 h-4 mr-2" />
                  <span className="text-xs font-medium">
                    {droneMode ? 'DRONE ACTIVE' : 'DRONE MODE'}
                  </span>
                </motion.div>
              </Button>

              {/* Sound Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 bg-white/10 hover:bg-white/20 border border-white/30 text-white"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3 h-3 mr-2" />
                ) : (
                  <VolumeX className="w-3 h-3 mr-2" />
                )}
                <span className="text-xs">
                  {soundEnabled ? 'SOUND ON' : 'MUTED'}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Collapse/Expand Button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full bg-black/30 hover:bg-black/50 border border-white/20 text-white h-8"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <Minimize2 className="w-3 h-3" />
          ) : (
            <Maximize2 className="w-3 h-3" />
          )}
        </Button>
      </motion.div>
    </div>
  );
}