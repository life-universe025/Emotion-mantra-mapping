// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Record<string, number> = {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Mark performance timing
  mark(name: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name)
    }
  }

  // Measure performance between two marks
  measure(name: string, startMark: string, endMark?: string): void {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        if (endMark) {
          performance.measure(name, startMark, endMark)
        } else {
          performance.measure(name, startMark)
        }
        
        const entries = performance.getEntriesByName(name, 'measure')
        if (entries.length > 0) {
          this.metrics[name] = entries[entries.length - 1].duration
        }
      } catch (error) {
      }
    }
  }

  // Get performance metrics
  getMetrics(): Record<string, number> {
    return { ...this.metrics }
  }

  // Clear performance marks and measures
  clear(): void {
    if (typeof performance !== 'undefined') {
      performance.clearMarks()
      performance.clearMeasures()
    }
    this.metrics = {}
  }

  // Report Core Web Vitals
  reportWebVitals(): void {
    if (typeof window === 'undefined') return

    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
        }
      }
    }).observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    new PerformanceObserver((_list) => {
      // const entries = list.getEntries()
      // const lastEntry = entries[entries.length - 1]
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // Cumulative Layout Shift
    let clsValue = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

// Initialize performance monitoring
export const perfMonitor = PerformanceMonitor.getInstance()

// Report Web Vitals on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    perfMonitor.reportWebVitals()
  })
}
