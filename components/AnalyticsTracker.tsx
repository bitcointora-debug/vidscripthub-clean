import React, { useEffect, useCallback } from 'react';

interface AnalyticsEvent {
    event: string;
    parameters?: Record<string, any>;
}

interface ConversionEvent {
    event: 'purchase' | 'cta_click' | 'scroll' | 'time_on_page' | 'exit_intent' | 'video_play' | 'form_submit';
    value?: number;
    currency?: string;
    item_id?: string;
    item_name?: string;
    item_category?: string;
    custom_parameters?: Record<string, any>;
}

export const AnalyticsTracker: React.FC = () => {
    // Initialize Google Analytics 4
    useEffect(() => {
        const initGA4 = () => {
            // Google Analytics 4 initialization
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('config', 'GA_MEASUREMENT_ID', {
                    page_title: document.title,
                    page_location: window.location.href,
                    custom_map: {
                        'custom_parameter_1': 'vidscripthub_user_type',
                        'custom_parameter_2': 'vidscripthub_plan_type'
                    }
                });
            }
        };

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initGA4);
        } else {
            initGA4();
        }

        return () => {
            document.removeEventListener('DOMContentLoaded', initGA4);
        };
    }, []);

    // Track page views
    useEffect(() => {
        const trackPageView = () => {
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'page_view', {
                    page_title: document.title,
                    page_location: window.location.href,
                    page_path: window.location.pathname,
                    timestamp: Date.now()
                });
            }
        };

        trackPageView();
    }, []);

    // Track scroll depth
    useEffect(() => {
        let maxScroll = 0;
        const trackScrollDepth = () => {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                maxScroll = scrollPercent;
                trackEvent('scroll_depth', {
                    scroll_percentage: scrollPercent,
                    page_location: window.location.href
                });
            }
        };

        const throttledScroll = throttle(trackScrollDepth, 100);
        window.addEventListener('scroll', throttledScroll);

        return () => {
            window.removeEventListener('scroll', throttledScroll);
        };
    }, []);

    // Track time on page
    useEffect(() => {
        const startTime = Date.now();
        
        const trackTimeOnPage = () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            
            // Track every 30 seconds
            if (timeOnPage % 30 === 0 && timeOnPage > 0) {
                trackEvent('time_on_page', {
                    time_seconds: timeOnPage,
                    page_location: window.location.href
                });
            }
        };

        const timeInterval = setInterval(trackTimeOnPage, 1000);

        return () => {
            clearInterval(timeInterval);
            // Track final time on page
            const finalTime = Math.round((Date.now() - startTime) / 1000);
            trackEvent('page_exit', {
                time_seconds: finalTime,
                page_location: window.location.href
            });
        };
    }, []);

    return null; // This component doesn't render anything
};

// Analytics utility functions
export const analyticsUtils = {
    // Track custom events
    trackEvent: (eventName: string, parameters: Record<string, any> = {}) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', eventName, {
                ...parameters,
                timestamp: Date.now()
            });
        }
        
        // Also log to console for development
        if (process.env.NODE_ENV === 'development') {
            console.log('Analytics Event:', eventName, parameters);
        }
    },

    // Track conversions
    trackConversion: (event: ConversionEvent) => {
        if (typeof window !== 'undefined' && window.gtag) {
            const eventData: any = {
                event_category: 'conversion',
                event_label: event.event,
                timestamp: Date.now()
            };

            if (event.value) {
                eventData.value = event.value;
            }
            if (event.currency) {
                eventData.currency = event.currency;
            }
            if (event.item_id) {
                eventData.item_id = event.item_id;
            }
            if (event.item_name) {
                eventData.item_name = event.item_name;
            }
            if (event.item_category) {
                eventData.item_category = event.item_category;
            }
            if (event.custom_parameters) {
                Object.assign(eventData, event.custom_parameters);
            }

            window.gtag('event', event.event, eventData);
        }
    },

    // Track CTA clicks
    trackCTAClick: (ctaName: string, location: string, value?: number) => {
        analyticsUtils.trackEvent('cta_click', {
            cta_name: ctaName,
            cta_location: location,
            value: value || 0,
            page_location: window.location.href
        });
    },

    // Track purchases
    trackPurchase: (transactionId: string, value: number, currency: string = 'USD', items: any[] = []) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'purchase', {
                transaction_id: transactionId,
                value: value,
                currency: currency,
                items: items,
                timestamp: Date.now()
            });
        }
    },

    // Track video engagement
    trackVideoPlay: (videoTitle: string, videoDuration: number, playTime: number) => {
        analyticsUtils.trackEvent('video_play', {
            video_title: videoTitle,
            video_duration: videoDuration,
            play_time: playTime,
            engagement_rate: (playTime / videoDuration) * 100,
            page_location: window.location.href
        });
    },

    // Track form submissions
    trackFormSubmit: (formName: string, formData: Record<string, any>) => {
        analyticsUtils.trackEvent('form_submit', {
            form_name: formName,
            form_data: formData,
            page_location: window.location.href,
            timestamp: Date.now()
        });
    },

    // Track exit intent
    trackExitIntent: () => {
        analyticsUtils.trackEvent('exit_intent', {
            page_location: window.location.href,
            timestamp: Date.now()
        });
    },

    // Track user engagement
    trackEngagement: (engagementType: string, engagementValue: number) => {
        analyticsUtils.trackEvent('user_engagement', {
            engagement_type: engagementType,
            engagement_value: engagementValue,
            page_location: window.location.href,
            timestamp: Date.now()
        });
    }
};

// Performance monitoring utilities
export const performanceUtils = {
    // Track Core Web Vitals
    trackCoreWebVitals: () => {
        if (typeof window !== 'undefined' && 'web-vital' in window) {
            // This would be implemented with web-vitals library
            console.log('Core Web Vitals tracking initialized');
        }
    },

    // Track page load performance
    trackPageLoadPerformance: () => {
        if (typeof window !== 'undefined' && window.performance) {
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                analyticsUtils.trackEvent('page_load_performance', {
                    load_time_ms: Math.round(loadTime),
                    page_location: window.location.href,
                    timestamp: Date.now()
                });
            });
        }
    },

    // Track errors
    trackError: (error: Error, errorInfo?: any) => {
        analyticsUtils.trackEvent('error', {
            error_message: error.message,
            error_stack: error.stack,
            error_info: errorInfo,
            page_location: window.location.href,
            timestamp: Date.now()
        });
    }
};

// Utility functions
function throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function executedFunction(...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Global analytics functions for easy access
export const trackEvent = analyticsUtils.trackEvent;
export const trackConversion = analyticsUtils.trackConversion;
export const trackCTAClick = analyticsUtils.trackCTAClick;
export const trackPurchase = analyticsUtils.trackPurchase;
export const trackVideoPlay = analyticsUtils.trackVideoPlay;
export const trackFormSubmit = analyticsUtils.trackFormSubmit;
export const trackExitIntent = analyticsUtils.trackExitIntent;
export const trackEngagement = analyticsUtils.trackEngagement;






