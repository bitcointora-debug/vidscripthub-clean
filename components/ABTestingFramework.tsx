import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for A/B Testing
interface ABTestVariant {
    id: string;
    name: string;
    weight: number; // Percentage of traffic (0-100)
    config: Record<string, any>;
    isControl?: boolean;
}

interface ABTest {
    id: string;
    name: string;
    description: string;
    status: 'draft' | 'running' | 'paused' | 'completed';
    variants: ABTestVariant[];
    startDate?: Date;
    endDate?: Date;
    targetMetric: string;
    minimumSampleSize: number;
    significanceLevel: number; // 0.05 for 95% confidence
}

interface ABTestResult {
    testId: string;
    variantId: string;
    visitors: number;
    conversions: number;
    conversionRate: number;
    confidenceInterval: [number, number];
    isSignificant: boolean;
    pValue: number;
}

interface ABTestContextType {
    tests: ABTest[];
    activeTests: ABTest[];
    results: ABTestResult[];
    getUserVariant: (testId: string) => string | null;
    trackConversion: (testId: string, variantId: string) => void;
    createTest: (test: Omit<ABTest, 'id'>) => string;
    updateTest: (testId: string, updates: Partial<ABTest>) => void;
    startTest: (testId: string) => void;
    stopTest: (testId: string) => void;
    getTestResults: (testId: string) => ABTestResult[];
}

// A/B Testing Context
const ABTestContext = createContext<ABTestContextType | null>(null);

// A/B Testing Provider Component
export const ABTestingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tests, setTests] = useState<ABTest[]>([]);
    const [activeTests, setActiveTests] = useState<ABTest[]>([]);
    const [results, setResults] = useState<ABTestResult[]>([]);
    const [userVariants, setUserVariants] = useState<Record<string, string>>({});

    // Load tests from localStorage on mount
    useEffect(() => {
        const savedTests = localStorage.getItem('ab_tests');
        const savedResults = localStorage.getItem('ab_test_results');
        const savedVariants = localStorage.getItem('ab_user_variants');

        if (savedTests) {
            const parsedTests = JSON.parse(savedTests).map((test: any) => ({
                ...test,
                startDate: test.startDate ? new Date(test.startDate) : undefined,
                endDate: test.endDate ? new Date(test.endDate) : undefined,
            }));
            setTests(parsedTests);
            setActiveTests(parsedTests.filter((test: ABTest) => test.status === 'running'));
        }

        if (savedResults) {
            setResults(JSON.parse(savedResults));
        }

        if (savedVariants) {
            setUserVariants(JSON.parse(savedVariants));
        }
    }, []);

    // Save tests to localStorage when they change
    useEffect(() => {
        localStorage.setItem('ab_tests', JSON.stringify(tests));
    }, [tests]);

    useEffect(() => {
        localStorage.setItem('ab_test_results', JSON.stringify(results));
    }, [results]);

    useEffect(() => {
        localStorage.setItem('ab_user_variants', JSON.stringify(userVariants));
    }, [userVariants]);

    // Get user variant for a test
    const getUserVariant = (testId: string): string | null => {
        const test = tests.find(t => t.id === testId);
        if (!test || test.status !== 'running') return null;

        // Check if user already has a variant assigned
        if (userVariants[testId]) {
            return userVariants[testId];
        }

        // Assign variant based on weights
        const random = Math.random() * 100;
        let cumulativeWeight = 0;
        let selectedVariant = '';

        for (const variant of test.variants) {
            cumulativeWeight += variant.weight;
            if (random <= cumulativeWeight) {
                selectedVariant = variant.id;
                break;
            }
        }

        // Store user's variant
        setUserVariants(prev => ({ ...prev, [testId]: selectedVariant }));
        return selectedVariant;
    };

    // Track conversion for a test variant
    const trackConversion = (testId: string, variantId: string) => {
        const existingResult = results.find(r => r.testId === testId && r.variantId === variantId);
        
        if (existingResult) {
            setResults(prev => prev.map(r => 
                r.testId === testId && r.variantId === variantId
                    ? {
                        ...r,
                        conversions: r.conversions + 1,
                        conversionRate: (r.conversions + 1) / r.visitors
                    }
                    : r
            ));
        } else {
            const newResult: ABTestResult = {
                testId,
                variantId,
                visitors: 0,
                conversions: 1,
                conversionRate: 0,
                confidenceInterval: [0, 0],
                isSignificant: false,
                pValue: 1
            };
            setResults(prev => [...prev, newResult]);
        }

        // Send to Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'ab_test_conversion', {
                test_id: testId,
                variant_id: variantId,
                test_name: tests.find(t => t.id === testId)?.name || 'Unknown Test'
            });
        }
    };

    // Create a new test
    const createTest = (test: Omit<ABTest, 'id'>): string => {
        const id = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newTest: ABTest = { ...test, id };
        setTests(prev => [...prev, newTest]);
        return id;
    };

    // Update a test
    const updateTest = (testId: string, updates: Partial<ABTest>) => {
        setTests(prev => prev.map(test => 
            test.id === testId ? { ...test, ...updates } : test
        ));
    };

    // Start a test
    const startTest = (testId: string) => {
        setTests(prev => prev.map(test => 
            test.id === testId 
                ? { ...test, status: 'running', startDate: new Date() }
                : test
        ));
        setActiveTests(prev => [...prev, tests.find(t => t.id === testId)!]);
    };

    // Stop a test
    const stopTest = (testId: string) => {
        setTests(prev => prev.map(test => 
            test.id === testId 
                ? { ...test, status: 'completed', endDate: new Date() }
                : test
        ));
        setActiveTests(prev => prev.filter(test => test.id !== testId));
    };

    // Get test results
    const getTestResults = (testId: string): ABTestResult[] => {
        return results.filter(r => r.testId === testId);
    };

    const contextValue: ABTestContextType = {
        tests,
        activeTests,
        results,
        getUserVariant,
        trackConversion,
        createTest,
        updateTest,
        startTest,
        stopTest,
        getTestResults
    };

    return (
        <ABTestContext.Provider value={contextValue}>
            {children}
        </ABTestContext.Provider>
    );
};

// Hook to use A/B Testing context
export const useABTesting = (): ABTestContextType => {
    const context = useContext(ABTestContext);
    if (!context) {
        throw new Error('useABTesting must be used within an ABTestingProvider');
    }
    return context;
};

// A/B Test Component
interface ABTestComponentProps {
    testId: string;
    children: ReactNode;
}

export const ABTest: React.FC<ABTestComponentProps> = ({ testId, children }) => {
    const { getUserVariant, trackConversion } = useABTesting();
    const [variantId, setVariantId] = useState<string | null>(null);

    useEffect(() => {
        const variant = getUserVariant(testId);
        setVariantId(variant);
    }, [testId, getUserVariant]);

    if (!variantId) return null;

    return (
        <div data-test-id={testId} data-variant-id={variantId}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child) && child.props.variantId === variantId) {
                    return child;
                }
                return null;
            })}
        </div>
    );
};

// A/B Test Variant Component
interface ABTestVariantProps {
    variantId: string;
    children: ReactNode;
}

export const ABTestVariant: React.FC<ABTestVariantProps> = ({ variantId, children }) => {
    return <div data-variant-id={variantId}>{children}</div>;
};

// A/B Test Conversion Tracker
interface ABTestConversionTrackerProps {
    testId: string;
    variantId: string;
    eventType?: string;
}

export const ABTestConversionTracker: React.FC<ABTestConversionTrackerProps> = ({ 
    testId, 
    variantId, 
    eventType = 'click' 
}) => {
    const { trackConversion } = useABTesting();

    const handleEvent = () => {
        trackConversion(testId, variantId);
    };

    useEffect(() => {
        if (eventType === 'page_view') {
            handleEvent();
        }
    }, [eventType]);

    return null;
};

// Statistical Analysis Utilities
export const statisticalUtils = {
    // Calculate confidence interval for conversion rate
    calculateConfidenceInterval: (conversions: number, visitors: number, confidenceLevel: number = 0.95): [number, number] => {
        if (visitors === 0) return [0, 0];
        
        const p = conversions / visitors;
        const z = confidenceLevel === 0.95 ? 1.96 : 2.576; // 95% or 99% confidence
        const margin = z * Math.sqrt((p * (1 - p)) / visitors);
        
        return [
            Math.max(0, p - margin),
            Math.min(1, p + margin)
        ];
    },

    // Calculate p-value for statistical significance
    calculatePValue: (controlConversions: number, controlVisitors: number, variantConversions: number, variantVisitors: number): number => {
        if (controlVisitors === 0 || variantVisitors === 0) return 1;
        
        const p1 = controlConversions / controlVisitors;
        const p2 = variantConversions / variantVisitors;
        const pooledP = (controlConversions + variantConversions) / (controlVisitors + variantVisitors);
        
        const se = Math.sqrt(pooledP * (1 - pooledP) * (1/controlVisitors + 1/variantVisitors));
        const z = Math.abs(p1 - p2) / se;
        
        // Approximate p-value using normal distribution
        return 2 * (1 - this.normalCDF(z));
    },

    // Normal CDF approximation
    normalCDF: (x: number): number => {
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    },

    // Error function approximation
    erf: (x: number): number => {
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;
        
        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);
        
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        
        return sign * y;
    },

    // Check if test has reached statistical significance
    isStatisticallySignificant: (pValue: number, significanceLevel: number = 0.05): boolean => {
        return pValue < significanceLevel;
    },

    // Calculate minimum sample size for test
    calculateMinimumSampleSize: (baselineRate: number, minimumDetectableEffect: number, power: number = 0.8, alpha: number = 0.05): number => {
        const zAlpha = 1.96; // 95% confidence
        const zBeta = 0.84; // 80% power
        
        const p1 = baselineRate;
        const p2 = baselineRate + minimumDetectableEffect;
        const pooledP = (p1 + p2) / 2;
        
        const numerator = Math.pow(zAlpha * Math.sqrt(2 * pooledP * (1 - pooledP)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
        const denominator = Math.pow(p2 - p1, 2);
        
        return Math.ceil(numerator / denominator);
    }
};

// Predefined A/B Tests for VidScriptHub
export const predefinedTests = {
    // Headline Test
    headlineTest: {
        name: 'Hero Headline Test',
        description: 'Test different hero headlines to improve conversion',
        variants: [
            {
                id: 'control',
                name: 'Control',
                weight: 50,
                config: {
                    headline: 'Generate Unlimited Viral Video Scripts with AI',
                    subheadline: 'Create engaging content for YouTube, TikTok, Instagram, and more in under 40 seconds'
                },
                isControl: true
            },
            {
                id: 'variant_a',
                name: 'Variant A',
                weight: 50,
                config: {
                    headline: 'AI-Powered Viral Script Generator That Actually Works',
                    subheadline: 'Join 10,000+ creators getting millions of views with our Google-powered AI'
                }
            }
        ],
        targetMetric: 'conversion_rate',
        minimumSampleSize: 1000,
        significanceLevel: 0.05
    },

    // CTA Button Test
    ctaTest: {
        name: 'CTA Button Test',
        description: 'Test different CTA button colors and text',
        variants: [
            {
                id: 'control',
                name: 'Control',
                weight: 50,
                config: {
                    buttonText: 'YES! I Want To Go Viral Today!',
                    buttonColor: 'from-[#DAFF00] to-[#B8E600]'
                },
                isControl: true
            },
            {
                id: 'variant_a',
                name: 'Variant A',
                weight: 50,
                config: {
                    buttonText: 'Get Instant Access Now!',
                    buttonColor: 'from-red-500 to-red-600'
                }
            }
        ],
        targetMetric: 'conversion_rate',
        minimumSampleSize: 1000,
        significanceLevel: 0.05
    },

    // Price Test
    priceTest: {
        name: 'Price Display Test',
        description: 'Test different price presentations',
        variants: [
            {
                id: 'control',
                name: 'Control',
                weight: 50,
                config: {
                    price: 27,
                    originalPrice: 497,
                    priceText: 'Just $27 Today!'
                },
                isControl: true
            },
            {
                id: 'variant_a',
                name: 'Variant A',
                weight: 50,
                config: {
                    price: 27,
                    originalPrice: 497,
                    priceText: 'Only $27 - Save $470!'
                }
            }
        ],
        targetMetric: 'conversion_rate',
        minimumSampleSize: 1000,
        significanceLevel: 0.05
    }
};






