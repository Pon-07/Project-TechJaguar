import React, { useState, useCallback, useMemo } from 'react';
import { Phone, PhoneCall, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

interface CallButtonProps {
  phoneNumber: string;
  label?: string;
  description?: string;
  module: 'farmer' | 'warehouse' | 'consumer';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
}

const moduleColors = {
  farmer: {
    primary: 'bg-green-500 hover:bg-green-600',
    secondary: 'bg-green-50 border-green-200 text-green-700',
    accent: 'text-green-600',
  },
  warehouse: {
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-blue-50 border-blue-200 text-blue-700',
    accent: 'text-blue-600',
  },
  consumer: {
    primary: 'bg-orange-500 hover:bg-orange-600',
    secondary: 'bg-orange-50 border-orange-200 text-orange-700',
    accent: 'text-orange-600',
  },
};

export function CallButton({
  phoneNumber,
  label,
  description,
  module,
  size = 'md',
  variant = 'default',
  className = '',
}: CallButtonProps) {
  const [isDialing, setIsDialing] = useState(false);
  const [showCallAnimation, setShowCallAnimation] = useState(false);
  const { t } = useLanguage();

  const colors = useMemo(() => moduleColors[module], [module]);

  // Get translated label based on module
  const getTranslatedLabel = () => {
    if (label) return label;
    switch (module) {
      case 'farmer':
        return t('call.farmer');
      case 'warehouse':
        return t('call.warehouse');
      case 'consumer':
        return t('call.consumer');
      default:
        return label || '';
    }
  };

  const translatedLabel = getTranslatedLabel();

  const handleCall = useCallback(() => {
    if (isDialing) return;
    
    try {
      toast.success(`${t('call.calling')} ${translatedLabel}: ${phoneNumber}`);
      setIsDialing(true);
      setShowCallAnimation(true);

      const callTimer = setTimeout(() => {
        setIsDialing(false);
        setTimeout(() => {
          setShowCallAnimation(false);
        }, 1000);
      }, 3000);

      return () => clearTimeout(callTimer);
    } catch (error) {
      console.error('Call button error:', error);
      setIsDialing(false);
      setShowCallAnimation(false);
    }
  }, [isDialing, translatedLabel, phoneNumber, t]);

  const buttonClasses = useMemo(() => {
    const sizeClasses = size === 'sm' ? 'px-3 py-2 text-sm' : 
                      size === 'lg' ? 'px-6 py-4 text-lg' : 'px-4 py-3';
    
    const baseClasses = `relative transition-all duration-300 ${sizeClasses} ${className}`;
    
    if (variant === 'ghost') {
      return `${baseClasses} bg-transparent hover:bg-gray-100 ${colors.accent}`;
    }
    if (variant === 'outline') {
      return `${baseClasses} border-2 border-gray-300 hover:bg-gray-100`;
    }
    return `${baseClasses} ${colors.primary} text-white`;
  }, [size, variant, className, colors]);

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <>
      <Button
        onClick={handleCall}
        className={buttonClasses}
        disabled={isDialing}
        title={`${t('call.calling')} ${translatedLabel}`}
      >
        <div className="flex items-center gap-2">
          <Phone className={iconSize} />
          <span>{isDialing ? t('call.calling') : translatedLabel}</span>
        </div>
      </Button>

      {showCallAnimation && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => !isDialing && setShowCallAnimation(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${colors.primary} flex items-center justify-center`}>
              <PhoneCall className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">
              {isDialing ? t('call.connected') : t('call.disconnected')}
            </h3>
            <p className="text-muted-foreground mb-3">{translatedLabel}</p>
            
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="font-mono text-lg">{phoneNumber}</p>
            </div>
            
            {description && (
              <p className="text-sm text-muted-foreground mb-4">{description}</p>
            )}

            <Badge variant="outline" className={colors.secondary}>
              {module.charAt(0).toUpperCase() + module.slice(1)} Support
            </Badge>

            {!isDialing && (
              <Button
                onClick={() => setShowCallAnimation(false)}
                variant="ghost"
                className="mt-4 w-full"
              >
                <X className="w-4 h-4 mr-2" />
                {t('common.close')}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}