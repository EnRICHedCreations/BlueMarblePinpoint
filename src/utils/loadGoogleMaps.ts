/**
 * Dynamically load Google Maps API with Places library
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let isLoaded = false;
let loadPromise: Promise<void> | null = null;

export function loadGoogleMapsScript(): Promise<void> {
  // Return existing promise if already loading
  if (loadPromise) {
    return loadPromise;
  }

  // Already loaded
  if (isLoaded || (window as any).google?.maps?.places) {
    return Promise.resolve();
  }

  // No API key
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error('Google Maps API key not configured'));
  }

  loadPromise = new Promise((resolve, reject) => {
    // Create callback for async loading
    const callbackName = 'initGoogleMaps';
    (window as any)[callbackName] = () => {
      isLoaded = true;
      delete (window as any)[callbackName];
      resolve();
    };

    // Create script tag
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=${callbackName}`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      loadPromise = null;
      delete (window as any)[callbackName];
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}
