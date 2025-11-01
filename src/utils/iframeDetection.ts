/**
 * Iframe Detection Utility
 * Detects if the application is running inside an iframe
 */

/**
 * Check if the application is running inside an iframe
 */
export function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    // If we can't access window.top due to cross-origin restrictions,
    // we're definitely in an iframe
    return true;
  }
}

/**
 * Check if running in GoHighLevel iframe specifically
 */
export function isInGHLIframe(): boolean {
  if (!isInIframe()) {
    return false;
  }

  try {
    // Check for GHL-specific indicators in URL or referrer
    const referrer = document.referrer.toLowerCase();
    return (
      referrer.includes('gohighlevel.com') ||
      referrer.includes('leadconnectorhq.com') ||
      referrer.includes('highlevel.com')
    );
  } catch (e) {
    // If we can't determine, assume it's GHL if we're in an iframe
    return isInIframe();
  }
}
