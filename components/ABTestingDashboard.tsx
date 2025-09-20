import React, { useState } from 'react';
import { useABTesting, predefinedTests } from './ABTestingFramework.tsx';

export const ABTestingDashboard: React.FC = () => {
    const { 
        tests, 
        activeTests, 
        results, 
        createTest, 
        updateTest, 
        startTest, 
        stopTest, 
        getTestResults 
    } = useABTesting();

    const [selectedTest, setSelectedTest] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleCreatePredefinedTest = (testType: keyof typeof predefinedTests) => {
        const test = predefinedTests[testType];
        const testId = createTest(test);
        setSelectedTest(testId);
        setShowCreateForm(false);
    };

    const handleStartTest = (testId: string) => {
        startTest(testId);
    };

    const handleStopTest = (testId: string) => {
        stopTest(testId);
    };

    const getTestStatusColor = (status: string) => {
        switch (status) {
            case 'running': return 'text-green-400 bg-green-900/20';
            case 'paused': return 'text-yellow-400 bg-yellow-900/20';
            case 'completed': return 'text-blue-400 bg-blue-900/20';
            default: return 'text-gray-400 bg-gray-900/20';
        }
    };

    const formatPercentage = (value: number) => {
        return `${(value * 100).toFixed(2)}%`;
    };

    return (
        <div className="min-h-screen bg-[#0F0A2A] text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#DAFF00] mb-2">A/B Testing Dashboard</h1>
                    <p className="text-purple-200/80">Manage and monitor your A/B tests for maximum conversion optimization</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-green-900/20 to-transparent border border-green-500/20 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-green-400 mb-2">Active Tests</h3>
                        <div className="text-3xl font-bold text-white mb-2">{activeTests.length}</div>
                        <p className="text-green-200/80 text-sm">Currently running</p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-500/20 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-blue-400 mb-2">Total Tests</h3>
                        <div className="text-3xl font-bold text-white mb-2">{tests.length}</div>
                        <p className="text-blue-200/80 text-sm">All time</p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-purple-400 mb-2">Conversions</h3>
                        <div className="text-3xl font-bold text-white mb-2">
                            {results.reduce((sum, result) => sum + result.conversions, 0)}
                        </div>
                        <p className="text-purple-200/80 text-sm">Total tracked</p>
                    </div>
                </div>

                {/* Create Test Section */}
                <div className="bg-gradient-to-r from-[#1A0F3C] to-transparent border border-[#DAFF00]/20 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-[#DAFF00] mb-4">Create New Test</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => handleCreatePredefinedTest('headlineTest')}
                            className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 rounded-lg p-4 hover:border-blue-500/50 transition-colors"
                        >
                            <h3 className="font-bold text-blue-400 mb-2">Headline Test</h3>
                            <p className="text-blue-200/80 text-sm">Test different hero headlines</p>
                        </button>

                        <button
                            onClick={() => handleCreatePredefinedTest('ctaTest')}
                            className="bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 rounded-lg p-4 hover:border-green-500/50 transition-colors"
                        >
                            <h3 className="font-bold text-green-400 mb-2">CTA Test</h3>
                            <p className="text-green-200/80 text-sm">Test button colors and text</p>
                        </button>

                        <button
                            onClick={() => handleCreatePredefinedTest('priceTest')}
                            className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
                        >
                            <h3 className="font-bold text-purple-400 mb-2">Price Test</h3>
                            <p className="text-purple-200/80 text-sm">Test price presentations</p>
                        </button>
                    </div>
                </div>

                {/* Tests List */}
                <div className="bg-gradient-to-r from-[#1A0F3C] to-transparent border border-purple-500/20 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">All Tests</h2>
                    
                    {tests.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-purple-200/80 mb-4">No tests created yet</p>
                            <p className="text-purple-300/60 text-sm">Create your first A/B test to start optimizing conversions</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tests.map(test => {
                                const testResults = getTestResults(test.id);
                                const totalVisitors = testResults.reduce((sum, result) => sum + result.visitors, 0);
                                const totalConversions = testResults.reduce((sum, result) => sum + result.conversions, 0);
                                const overallConversionRate = totalVisitors > 0 ? totalConversions / totalVisitors : 0;

                                return (
                                    <div
                                        key={test.id}
                                        className="bg-gradient-to-r from-purple-900/20 to-transparent border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors cursor-pointer"
                                        onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4 mb-2">
                                                    <h3 className="text-lg font-bold text-white">{test.name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTestStatusColor(test.status)}`}>
                                                        {test.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-purple-200/80 text-sm mb-2">{test.description}</p>
                                                <div className="flex items-center space-x-6 text-sm">
                                                    <span className="text-purple-300/70">
                                                        Visitors: <span className="text-white font-semibold">{totalVisitors}</span>
                                                    </span>
                                                    <span className="text-purple-300/70">
                                                        Conversions: <span className="text-white font-semibold">{totalConversions}</span>
                                                    </span>
                                                    <span className="text-purple-300/70">
                                                        Rate: <span className="text-white font-semibold">{formatPercentage(overallConversionRate)}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                {test.status === 'running' ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStopTest(test.id);
                                                        }}
                                                        className="bg-red-600/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600/30 transition-colors"
                                                    >
                                                        Stop Test
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStartTest(test.id);
                                                        }}
                                                        className="bg-green-600/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg hover:bg-green-600/30 transition-colors"
                                                    >
                                                        Start Test
                                                    </button>
                                                )}
                                                
                                                <svg 
                                                    className={`w-5 h-5 text-purple-400 transition-transform ${selectedTest === test.id ? 'rotate-180' : ''}`}
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Expanded Test Details */}
                                        {selectedTest === test.id && (
                                            <div className="mt-4 pt-4 border-t border-purple-500/20">
                                                <h4 className="text-lg font-bold text-white mb-4">Test Variants & Results</h4>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {test.variants.map(variant => {
                                                        const variantResult = testResults.find(r => r.variantId === variant.id);
                                                        const visitors = variantResult?.visitors || 0;
                                                        const conversions = variantResult?.conversions || 0;
                                                        const conversionRate = visitors > 0 ? conversions / visitors : 0;

                                                        return (
                                                            <div
                                                                key={variant.id}
                                                                className={`p-4 rounded-lg border ${
                                                                    variant.isControl 
                                                                        ? 'border-blue-500/30 bg-blue-900/10' 
                                                                        : 'border-purple-500/30 bg-purple-900/10'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h5 className="font-bold text-white">{variant.name}</h5>
                                                                    {variant.isControl && (
                                                                        <span className="text-blue-400 text-sm font-semibold">CONTROL</span>
                                                                    )}
                                                                </div>
                                                                
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-purple-300/70">Visitors:</span>
                                                                        <span className="text-white font-semibold">{visitors}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-purple-300/70">Conversions:</span>
                                                                        <span className="text-white font-semibold">{conversions}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-purple-300/70">Conversion Rate:</span>
                                                                        <span className="text-white font-semibold">{formatPercentage(conversionRate)}</span>
                                                                    </div>
                                                                    {variantResult && (
                                                                        <div className="flex justify-between">
                                                                            <span className="text-purple-300/70">Significant:</span>
                                                                            <span className={`font-semibold ${variantResult.isSignificant ? 'text-green-400' : 'text-red-400'}`}>
                                                                                {variantResult.isSignificant ? 'Yes' : 'No'}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};






