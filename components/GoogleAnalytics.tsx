import React, { useEffect } from 'react';

interface GoogleAnalyticsProps {
    measurementId?: string;
}

export const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ 
    measurementId = 'G-T9R97Q7LD8' // Your actual GA4 Measurement ID
}) => {
    useEffect(() => {
        // Load Google Analytics 4 script
        const loadGA4 = () => {
            // Create script element
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
            document.head.appendChild(script);

            // Initialize gtag
            window.dataLayer = window.dataLayer || [];
            function gtag(...args: any[]) {
                window.dataLayer.push(args);
            }
            window.gtag = gtag;

            // Configure GA4
            gtag('js', new Date());
            gtag('config', measurementId, {
                page_title: document.title,
                page_location: window.location.href,
                custom_map: {
                    'custom_parameter_1': 'vidscripthub_user_type',
                    'custom_parameter_2': 'vidscripthub_plan_type'
                },
                // Enhanced ecommerce
                send_page_view: true,
                // Privacy settings
                anonymize_ip: true,
                allow_google_signals: true,
                allow_ad_personalization_signals: false
            });

            // Enhanced ecommerce configuration
            gtag('config', measurementId, {
                enhanced_ecommerce: true,
                currency: 'USD'
            });
        };

        // Load GA4 when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadGA4);
        } else {
            loadGA4();
        }

        return () => {
            document.removeEventListener('DOMContentLoaded', loadGA4);
        };
    }, [measurementId]);

    return null; // This component doesn't render anything
};

// Enhanced ecommerce tracking functions
export const ecommerceTracking = {
    // Track purchase
    trackPurchase: (transactionId: string, value: number, currency: string = 'USD', items: any[] = []) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'purchase', {
                transaction_id: transactionId,
                value: value,
                currency: currency,
                items: items
            });
        }
    },

    // Track add to cart
    trackAddToCart: (itemId: string, itemName: string, category: string, value: number, quantity: number = 1) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'add_to_cart', {
                currency: 'USD',
                value: value,
                items: [{
                    item_id: itemId,
                    item_name: itemName,
                    item_category: category,
                    quantity: quantity,
                    price: value
                }]
            });
        }
    },

    // Track begin checkout
    trackBeginCheckout: (value: number, currency: string = 'USD', items: any[] = []) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'begin_checkout', {
                currency: currency,
                value: value,
                items: items
            });
        }
    },

    // Track view item
    trackViewItem: (itemId: string, itemName: string, category: string, value: number) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'view_item', {
                currency: 'USD',
                value: value,
                items: [{
                    item_id: itemId,
                    item_name: itemName,
                    item_category: category,
                    price: value
                }]
            });
        }
    }
};

// Custom event tracking
export const customEventTracking = {
    // Track video engagement
    trackVideoEngagement: (videoTitle: string, action: 'play' | 'pause' | 'complete', progress: number) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'video_engagement', {
                video_title: videoTitle,
                video_action: action,
                video_progress: progress,
                page_location: window.location.href
            });
        }
    },

    // Track scroll depth
    trackScrollDepth: (depth: number) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'scroll_depth', {
                scroll_depth: depth,
                page_location: window.location.href
            });
        }
    },

    // Track time on page
    trackTimeOnPage: (timeInSeconds: number) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'time_on_page', {
                time_on_page: timeInSeconds,
                page_location: window.location.href
            });
        }
    },

    // Track CTA clicks
    trackCTAClick: (ctaName: string, ctaLocation: string, ctaValue?: number) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'cta_click', {
                cta_name: ctaName,
                cta_location: ctaLocation,
                cta_value: ctaValue || 0,
                page_location: window.location.href
            });
        }
    },

    // Track form interactions
    trackFormInteraction: (formName: string, action: 'start' | 'complete' | 'abandon', step?: string) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'form_interaction', {
                form_name: formName,
                form_action: action,
                form_step: step || '',
                page_location: window.location.href
            });
        }
    },

    // Track exit intent
    trackExitIntent: () => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'exit_intent', {
                page_location: window.location.href
            });
        }
    }
};

// Performance tracking
export const performanceTracking = {
    // Track page load performance
    trackPageLoad: () => {
        if (typeof window !== 'undefined' && window.performance) {
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'page_load_performance', {
                        load_time_ms: Math.round(loadTime),
                        page_location: window.location.href
                    });
                }
            });
        }
    },

    // Track Core Web Vitals
    trackCoreWebVitals: () => {
        // This would integrate with web-vitals library
        if (typeof window !== 'undefined' && window.gtag) {
            // Track Largest Contentful Paint
            window.gtag('event', 'core_web_vitals', {
                metric_name: 'LCP',
                metric_value: 0, // Would be populated by web-vitals library
                page_location: window.location.href
            });
        }
    }
};

// User behavior tracking
export const userBehaviorTracking = {
    // Track user engagement
    trackEngagement: (engagementType: string, engagementValue: number) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'user_engagement', {
                engagement_type: engagementType,
                engagement_value: engagementValue,
                page_location: window.location.href
            });
        }
    },

    // Track user journey
    trackUserJourney: (step: string, stepValue?: number) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'user_journey', {
                journey_step: step,
                step_value: stepValue || 0,
                page_location: window.location.href
            });
        }
    }
};
