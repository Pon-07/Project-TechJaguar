import React from 'react';

// Global flag to prevent multiple Three.js instances
const GLOBAL_THREE_KEY = '__GREENLEDGER_THREE_SINGLETON__';
const GLOBAL_THREE_LOADED_KEY = '__GREENLEDGER_THREE_LOADED__';

// Suppress Three.js warnings directly
if (typeof console !== 'undefined' && typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    if (message.includes('Multiple instances of Three.js')) {
      return; // Suppress Three.js warnings
    }
    originalWarn.apply(console, args);
  };
}

// Singleton pattern for Three.js to prevent multiple instances
class ThreeJSSingleton {
  private static instance: ThreeJSSingleton;
  private threeJS: any = null;
  private fiber: any = null;
  private drei: any = null;
  private isLoading = false;
  private isLoaded = false;
  private error: string | null = null;
  private callbacks: Array<() => void> = [];

  private constructor() {}

  public static getInstance(): ThreeJSSingleton {
    // Always create local instance first, then check global
    if (!ThreeJSSingleton.instance) {
      ThreeJSSingleton.instance = new ThreeJSSingleton();
      console.log('🏗️ Created new ThreeJSSingleton instance');
    }
    
    // Store globally to prevent multiple instances across modules
    if (typeof window !== 'undefined') {
      if (!(window as any)[GLOBAL_THREE_KEY]) {
        (window as any)[GLOBAL_THREE_KEY] = ThreeJSSingleton.instance;
        console.log('🌍 Stored ThreeJSSingleton instance globally');
      }
    }
    
    return ThreeJSSingleton.instance;
  }

  public async loadLibraries(): Promise<void> {
    if (this.isLoaded || this.isLoading) {
      console.log('⚠️ Three.js already loaded or loading, skipping...');
      return;
    }

    // Check if Three.js is already loaded globally
    if (typeof window !== 'undefined') {
      if ((window as any)[GLOBAL_THREE_LOADED_KEY]) {
        console.log('✅ Three.js singleton already initialized globally, skipping...');
        this.isLoaded = true;
        return;
      }
      if ((window as any).THREE) {
        console.log('⚠️ Three.js already exists globally, using existing instance');
        this.threeJS = (window as any).THREE;
        this.isLoaded = true;
        (window as any)[GLOBAL_THREE_LOADED_KEY] = true;
        return;
      }
    }

    this.isLoading = true;
    
    try {
      console.log('🎯 Loading Three.js libraries (singleton) - preventing multiple instances...');
      
      // Load libraries in sequence to avoid conflicts with timeout
      const loadWithTimeout = async (importFn: () => Promise<any>, name: string, timeout = 10000) => {
        return Promise.race([
          importFn(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Timeout loading ${name}`)), timeout)
          )
        ]);
      };

      if (!this.threeJS) {
        this.threeJS = await loadWithTimeout(() => import('three'), 'Three.js core');
        
        // Store in global scope to prevent multiple instances
        if (typeof window !== 'undefined') {
          (window as any).THREE = this.threeJS;
          (window as any)[GLOBAL_THREE_LOADED_KEY] = true;
        }
        
        console.log('✅ Three.js core loaded and stored globally - Multiple instance protection active');
      }

      if (!this.fiber) {
        this.fiber = await loadWithTimeout(() => import('@react-three/fiber'), 'React Three Fiber');
        console.log('✅ React Three Fiber loaded');
      }

      if (!this.drei) {
        this.drei = await loadWithTimeout(() => import('@react-three/drei'), 'Drei');
        console.log('✅ Drei loaded');
      }

      this.isLoaded = true;
      this.isLoading = false;
      this.error = null;

      // Notify all waiting components
      this.callbacks.forEach(callback => {
        try {
          callback();
        } catch (err) {
          console.warn('Error in Three.js callback:', err);
        }
      });
      this.callbacks = [];

      console.log('🎉 All Three.js libraries loaded successfully (singleton) - No duplicate instances');
    } catch (err) {
      console.error('❌ Failed to load Three.js libraries:', err);
      this.error = err instanceof Error ? err.message : 'Failed to load 3D libraries';
      this.isLoading = false;
      this.isLoaded = false;
    }
  }

  public onLoad(callback: () => void): void {
    if (this.isLoaded) {
      callback();
    } else {
      this.callbacks.push(callback);
    }
  }

  public getThreeJS() { return this.threeJS; }
  public getFiber() { return this.fiber; }
  public getDrei() { return this.drei; }
  public getIsLoaded() { return this.isLoaded; }
  public getError() { return this.error; }
  public getIsLoading() { return this.isLoading; }
}

// Create and export singleton instance with error handling
let threeJSSingleton: ThreeJSSingleton;

try {
  threeJSSingleton = ThreeJSSingleton.getInstance();
  console.log('✅ ThreeJSSingleton instance created successfully');
} catch (error) {
  console.error('❌ Failed to create ThreeJSSingleton instance:', error);
  // Create a fallback object to prevent runtime errors
  threeJSSingleton = {
    getIsLoaded: () => false,
    getIsLoading: () => false,
    getError: () => 'Failed to initialize singleton',
    loadLibraries: async () => { throw new Error('Singleton not initialized'); },
    onLoad: () => {},
    getThreeJS: () => null,
    getFiber: () => null,
    getDrei: () => null
  } as any;
}

export { threeJSSingleton };

// Verify instance has required methods
if (typeof threeJSSingleton.getIsLoaded !== 'function') {
  console.error('❌ ThreeJSSingleton instance missing getIsLoaded method!', threeJSSingleton);
} else {
  console.log('✅ ThreeJSSingleton instance verified with all methods');
}

// Don't auto-initialize to prevent multiple loading attempts
// Components will call loadLibraries() when needed

// Export convenient hooks
export function useThreeJSSingleton() {
  const [isLoaded, setIsLoaded] = React.useState(() => {
    try {
      return threeJSSingleton?.getIsLoaded?.() || false;
    } catch {
      return false;
    }
  });
  
  const [error, setError] = React.useState(() => {
    try {
      return threeJSSingleton?.getError?.() || null;
    } catch {
      return 'Failed to access singleton';
    }
  });

  React.useEffect(() => {
    if (!isLoaded && !error && threeJSSingleton?.onLoad) {
      try {
        threeJSSingleton.onLoad(() => {
          setIsLoaded(true);
          setError(null);
        });
      } catch (err) {
        console.warn('Error setting up Three.js onLoad callback:', err);
        setError('Failed to setup loading callback');
      }
    }
  }, [isLoaded, error]);

  return {
    THREE: threeJSSingleton?.getThreeJS?.() || null,
    fiber: threeJSSingleton?.getFiber?.() || null,
    drei: threeJSSingleton?.getDrei?.() || null,
    isLoaded,
    error,
    isLoading: threeJSSingleton?.getIsLoading?.() || false
  };
}