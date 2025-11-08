import React from 'react';
import { motion } from 'motion/react';
import { Sprout, Leaf } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import greenledgerLogo from 'figma:asset/7b4ec0cba93b6654ddb44626ae319a334e3c67c9.png';

export function SplashScreen() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-amber-400 flex items-center justify-center overflow-hidden">
      <div className="text-center relative">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="w-48 h-32 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20 p-4">
            <motion.img
              src={greenledgerLogo}
              alt="Greenledger"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-5xl font-bold text-white mb-4"
        >
          Greenledger
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-xl text-white/90 mb-8"
        >
          {t('notification.welcome')}
        </motion.p>

        {/* Growth Animation */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 120 }}
          transition={{ delay: 2, duration: 1, ease: "easeOut" }}
          className="w-2 bg-gradient-to-t from-amber-300 to-green-400 mx-auto rounded-full"
        />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * 400 - 200,
                y: Math.random() * 300 - 150
              }}
              transition={{
                delay: Math.random() * 2,
                duration: 3,
                repeat: Infinity,
                repeatDelay: Math.random() * 2
              }}
              className="absolute w-2 h-2 bg-white/40 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
            />
          ))}
        </div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-8"
        >
          <div className="flex space-x-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-white/70 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}