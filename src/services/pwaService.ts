// PWA Service for Sanatan Mantra Sadhana
export class PWAService {
  private static instance: PWAService
  private serviceWorker: ServiceWorker | null = null
  private isOnline = navigator.onLine

  private constructor() {
    this.setupEventListeners()
  }

  public static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService()
    }
    return PWAService.instance
  }

  // Register service worker
  public async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false
    }

    // Skip service worker in development mode
    if (import.meta.env.DEV) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      })

      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Optionally show update notification to user
            }
          })
        }
      })

      return true
    } catch (error) {
      return false
    }
  }

  // Unregister service worker (for development)
  public async unregisterServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
      }
      return true
    } catch (error) {
      return false
    }
  }

  // Check if service worker is active
  public isServiceWorkerActive(): boolean {
    return navigator.serviceWorker.controller !== null
  }

  // Force service worker update
  public async updateServiceWorker(): Promise<void> {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Handle online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Handle service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        // Optionally reload the page
        window.location.reload()
      }
    })
  }

  // Get online status
  public getOnlineStatus(): boolean {
    return this.isOnline
  }

  // Clear all caches
  public async clearAllCaches(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
    }
  }

  // Get cache status
  public async getCacheStatus(): Promise<{ name: string; size: number }[]> {
    if (!('caches' in window)) {
      return []
    }

    const cacheNames = await caches.keys()
    const cacheStatus = await Promise.all(
      cacheNames.map(async (name) => {
        const cache = await caches.open(name)
        const keys = await cache.keys()
        return { name, size: keys.length }
      })
    )

    return cacheStatus
  }

  // Check if app can be installed
  public canInstall(): boolean {
    return 'serviceWorker' in navigator && 
           'PushManager' in window &&
           !this.isStandalone()
  }

  // Check if app is running in standalone mode
  public isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://')
  }

  // Check if device is iOS
  public isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  }

  // Check if device is Android
  public isAndroid(): boolean {
    return /Android/.test(navigator.userAgent)
  }

  // Get device type
  public getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  // Get platform info
  public getPlatformInfo(): { platform: string; device: string; browser: string } {
    return {
      platform: navigator.platform,
      device: this.getDeviceType(),
      browser: navigator.userAgent
    }
  }

  // Check if app is installed
  public isInstalled(): boolean {
    return this.isStandalone() || 
           localStorage.getItem('pwa-installed') === 'true'
  }

  // Mark app as installed
  public markAsInstalled(): void {
    localStorage.setItem('pwa-installed', 'true')
  }

  // Get installation prompt
  public getInstallPrompt(): any {
    return (window as any).deferredPrompt
  }

  // Set installation prompt
  public setInstallPrompt(prompt: any): void {
    (window as any).deferredPrompt = prompt
  }

  // Handle app installation
  public async handleInstall(): Promise<boolean> {
    const prompt = this.getInstallPrompt()
    if (prompt) {
      prompt.prompt()
      const { outcome } = await prompt.userChoice
      if (outcome === 'accepted') {
        this.markAsInstalled()
        return true
      }
    }
    return false
  }

  // Get service worker status
  public getServiceWorkerStatus(): string {
    if (!this.serviceWorker) return 'not-registered'
    if (this.serviceWorker.state === 'activated') return 'active'
    if (this.serviceWorker.state === 'installing') return 'installing'
    // if (this.serviceWorker.state === 'waiting') return 'waiting'
    return 'unknown'
  }

  // Get app version
  public getAppVersion(): string {
    return '1.0.0'
  }

  // Check for updates
  public async checkForUpdates(): Promise<boolean> {
    try {
      const response = await fetch('/sw.js', { cache: 'no-cache' })
      return response.ok
    } catch {
      return false
    }
  }

  // Get offline status
  public isOffline(): boolean {
    return !this.isOnline
  }

  // Get network status
  public getNetworkStatus(): { online: boolean; type?: string } {
    return {
      online: this.isOnline,
      type: (navigator as any).connection?.effectiveType
    }
  }

  // Get storage usage
  public async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0
      }
    }
    return { used: 0, quota: 0 }
  }

  // Clear storage
  public async clearStorage(): Promise<void> {
    if ('storage' in navigator && 'clear' in navigator.storage) {
      await (navigator.storage as any).clear()
    }
  }

  // Get PWA features support
  public getSupportedFeatures(): { serviceWorker: boolean; push: boolean; backgroundSync: boolean; cache: boolean } {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      push: 'PushManager' in window,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      cache: 'caches' in window
    }
  }

  // Initialize PWA features
  public async initialize(): Promise<void> {
    try {
      await this.registerServiceWorker()
    } catch (error) {
    }
  }
}

// Export singleton instance
export const pwaService = PWAService.getInstance()