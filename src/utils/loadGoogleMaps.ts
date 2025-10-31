/**
 * Dynamically load Google Maps API with Places library
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let isLoading = false;
let isLoaded = false;

export function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (isLoaded || (window as any).google?.maps?.places) {
      resolve();
      return;
    }

    // Currently loading
    if (isLoading) {
      const checkLoaded = setInterval(() => {
        if ((window as any).google?.maps?.places) {
          clearInterval(checkLoaded);
          isLoaded = true;
          resolve();
        }
      }, 100);
      return;
    }

    // No API key
    if (!GOOGLE_MAPS_API_KEY) {
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    isLoading = true;

    // Create script tag
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoading = false;
      isLoaded = true;
      resolve();
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });
}
