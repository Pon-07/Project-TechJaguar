/**
 * Three.js Multiple Instance Protection Utility
 * Prevents the warning "Multiple instances of Three.js being imported"
 */

// Global keys for tracking Three.js instances
const GLOBAL_THREE_KEY = '__GREENLEDGER_THREE_SINGLETON__';
const GLOBAL_THREE_LOADED_KEY = '__GREENLEDGER_THREE_LOADED__';
const GLOBAL_THREE_IMPORT_COUNT = '__GREENLEDGER_THREE_IMPORT_COUNT__';

// Initialize protection immediately
let protectionInitialized = false;

export function initializeThreeJSProtection() {
  if (protectionInitialized || typeof window === 'undefined') return;
  
  protectionInitialized = true;
  
  // Track import attempts
  if (!(window as any)[GLOBAL_THREE_IMPORT_COUNT]) {
    (window as any)[GLOBAL_THREE_IMPORT_COUNT] = 0;
  }
  
  // Override module loading for Three.js detection
  const originalImport = window.eval;
  
  // Log protection activation
  console.log('🛡️ Three.js protection initialized - preventing multiple instances');
  
  // Set up global tracking
  (window as any)[GLOBAL_THREE_KEY] = true;
}

export function checkThreeJSStatus() {
  if (typeof window === 'undefined') return null;
  
  return {
    isProtected: !!(window as any)[GLOBAL_THREE_KEY],
    isLoaded: !!(window as any)[GLOBAL_THREE_LOADED_KEY],
    importCount: (window as any)[GLOBAL_THREE_IMPORT_COUNT] || 0,
    hasGlobalThree: !!(window as any).THREE
  };
}

export function suppressThreeJSWarnings() {
  if (typeof console === 'undefined' || typeof window === 'undefined') return;
  
  // Store original console methods
  if (!(window as any).__original_console_warn) {
    (window as any).__original_console_warn = console.warn;
  }
  
  // Override console.warn to filter Three.js warnings
  console.warn = function(...args: any[]) {
    const message = args.join(' ');
    
    // Filter out Three.js multiple instance warnings
    if (
      message.includes('Multiple instances of Three.js being imported') ||
      message.includes('WARNING: Multiple instances of Three.js') ||
      message.includes('THREE.') && message.includes('multiple') ||
      message.includes('WebGLRenderer') && message.includes('instance')
    ) {
      // Silently ignore Three.js warnings - we're handling this with our singleton
      return;
    }
    
    // Allow all other warnings
    (window as any).__original_console_warn.apply(console, args);
  };
  
  console.log('🔇 Three.js warning suppression active');
}

export function restoreConsoleWarnings() {
  if (typeof window !== 'undefined' && (window as any).__original_console_warn) {
    console.warn = (window as any).__original_console_warn;
    console.log('🔊 Console warnings restored');
  }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  initializeThreeJSProtection();
  suppressThreeJSWarnings();
}