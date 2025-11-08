import React, { createContext, useContext, ReactNode, useRef, useEffect, useState } from 'react';

interface ThreeJSContextType {
  THREE: typeof import('three') | null;
  fiber: typeof import('@react-three/fiber') | null;
  drei: typeof import('@react-three/drei') | null;
  isLoaded: boolean;
  error: string | null;
}

const ThreeJSContext = createContext<ThreeJSContextType>({
  THREE: null,
  fiber: null,  
  drei: null,
  isLoaded: false,
  error: null
});

interface ThreeJSProviderProps {
  children: ReactNode;
}

// Global flag to prevent multiple instances
let isThreeJSLoaded = false;
let globalThreeInstance: any = null;
let globalFiberInstance: any = null;
let globalDreiInstance: any = null;

export function ThreeJSProvider({ children }: ThreeJSProviderProps) {
  const [isLoaded, setIsLoaded] = useState(isThreeJSLoaded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already loaded globally, use existing instances
    if (isThreeJSLoaded && globalThreeInstance) {
      setIsLoaded(true);
      return;
    }

    // Prevent multiple loading attempts
    if (isThreeJSLoaded) return;

    const loadThreeJS = async () => {
      try {
        isThreeJSLoaded = true; // Set flag immediately to prevent concurrent loads
        
        // Load Three.js core
        if (!globalThreeInstance) {
          globalThreeInstance = await import('three');
          console.log('Three.js core loaded once');
        }

        // Load React Three Fiber
        if (!globalFiberInstance) {
          globalFiberInstance = await import('@react-three/fiber');
          console.log('React Three Fiber loaded once');
        }

        // Load Drei
        if (!globalDreiInstance) {
          globalDreiInstance = await import('@react-three/drei');
          console.log('Drei loaded once');
        }

        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Failed to load Three.js libraries:', err);
        setError('Failed to load 3D libraries');
        isThreeJSLoaded = false; // Reset flag on error
      }
    };

    loadThreeJS();
  }, []);

  const contextValue: ThreeJSContextType = {
    THREE: globalThreeInstance,
    fiber: globalFiberInstance,
    drei: globalDreiInstance,
    isLoaded,
    error
  };

  return (
    <ThreeJSContext.Provider value={contextValue}>
      {children}
    </ThreeJSContext.Provider>
  );
}

export function useThreeJS() {
  const context = useContext(ThreeJSContext);
  if (!context) {
    throw new Error('useThreeJS must be used within a ThreeJSProvider');
  }
  return context;
}

// Safe re-exports that won't cause multiple imports
export const getThreeJS = () => globalThreeInstance;
export const getFiber = () => globalFiberInstance;
export const getDrei = () => globalDreiInstance;

// Type exports
export type { Vector3, Color, MeshStandardMaterial } from 'three';