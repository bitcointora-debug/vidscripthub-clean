import React, { useEffect } from 'react';

export const PerformanceOptimizer: React.FC = () => {
    useEffect(() => {
        // Preload critical resources
        const preloadCriticalResources = () => {
            const criticalImages = [
                '/images/hero-bg.jpg',
                '/images/vidscripthub-logo.png',
                '/images/testimonial-01.png',
                '/images/testimonial-02.png',
                '/images/testimonial-03.png'
            ];

            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        };

        // Optimize images with lazy loading
        const optimizeImages = () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
                if (!img.hasAttribute('decoding')) {
                    img.setAttribute('decoding', 'async');
                }
            });
        };

        // Add performance monitoring
        const addPerformanceMonitoring = () => {
            // Monitor Core Web Vitals
            if ('web-vital' in window) {
                // This would be implemented with web-vitals library
                console.log('Performance monitoring initialized');
            }

            // Monitor page load time
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            });
        };

        // Initialize optimizations
        preloadCriticalResources();
        optimizeImages();
        addPerformanceMonitoring();

        // Cleanup function
        return () => {
            // Cleanup if needed
        };
    }, []);

    return null; // This component doesn't render anything
};

// Performance optimization utilities
export const performanceUtils = {
    // Debounce function for performance
    debounce: (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return function executedFunction(...args: any[]) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance
    throttle: (func: Function, limit: number) => {
        let inThrottle: boolean;
        return function executedFunction(...args: any[]) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Image optimization
    optimizeImage: (src: string, width?: number, height?: number) => {
        // This would integrate with an image optimization service
        let optimizedSrc = src;
        
        if (width && height) {
            // Add size parameters for optimization
            optimizedSrc += `?w=${width}&h=${height}&q=80&f=webp`;
        }
        
        return optimizedSrc;
    },

    // Preload critical resources
    preloadResource: (href: string, as: string) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = as;
        link.href = href;
        document.head.appendChild(link);
    },

    // Add critical CSS
    addCriticalCSS: (css: string) => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
};

// SEO optimization utilities
export const seoUtils = {
    // Update page title
    updateTitle: (title: string) => {
        document.title = title;
    },

    // Update meta description
    updateMetaDescription: (description: string) => {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);
    },

    // Update meta keywords
    updateMetaKeywords: (keywords: string) => {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', keywords);
    },

    // Add structured data
    addStructuredData: (data: object) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    },

    // Generate sitemap entry
    generateSitemapEntry: (url: string, lastmod?: string, changefreq?: string, priority?: string) => {
        return {
            url,
            lastmod: lastmod || new Date().toISOString().split('T')[0],
            changefreq: changefreq || 'weekly',
            priority: priority || '0.8'
        };
    }
};






