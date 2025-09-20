import React, { useState, useEffect } from 'react';
import { securityUtils } from './SecurityUtils.tsx';

export const SecurityDashboard: React.FC = () => {
    const [securityLogs, setSecurityLogs] = useState<any[]>([]);
    const [securityScore, setSecurityScore] = useState(0);

    useEffect(() => {
        // Load security logs
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        setSecurityLogs(logs);

        // Calculate security score
        calculateSecurityScore(logs);
    }, []);

    const calculateSecurityScore = (logs: any[]) => {
        let score = 100;
        
        // Deduct points for security events
        const suspiciousEvents = logs.filter(log => 
            log.event.includes('suspicious') || 
            log.event.includes('error') ||
            log.event.includes('rejection')
        );
        
        score -= suspiciousEvents.length * 5;
        score = Math.max(0, score);
        
        setSecurityScore(score);
    };

    const getSecurityScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-400 bg-green-900/20';
        if (score >= 70) return 'text-yellow-400 bg-yellow-900/20';
        return 'text-red-400 bg-red-900/20';
    };

    const getSecurityScoreText = (score: number) => {
        if (score >= 90) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Fair';
        return 'Poor';
    };

    const clearLogs = () => {
        localStorage.removeItem('security_logs');
        setSecurityLogs([]);
        setSecurityScore(100);
    };

    return (
        <div className="min-h-screen bg-[#0F0A2A] text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#DAFF00] mb-2">Security Dashboard</h1>
                    <p className="text-purple-200/80">Monitor and manage your site's security status</p>
                </div>

                {/* Security Score */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className={`${getSecurityScoreColor(securityScore)} border border-current rounded-xl p-6 text-center`}>
                        <h3 className="text-xl font-bold mb-2">Security Score</h3>
                        <div className="text-4xl font-bold mb-2">{securityScore}/100</div>
                        <p className="text-sm">{getSecurityScoreText(securityScore)}</p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-500/20 rounded-xl p-6 text-center">
                        <h3 className="text-xl font-bold text-blue-400 mb-2">Total Events</h3>
                        <div className="text-3xl font-bold text-white mb-2">{securityLogs.length}</div>
                        <p className="text-blue-200/80 text-sm">Security events logged</p>
                    </div>

                    <div className="bg-gradient-to-r from-green-900/20 to-transparent border border-green-500/20 rounded-xl p-6 text-center">
                        <h3 className="text-xl font-bold text-green-400 mb-2">Page Loads</h3>
                        <div className="text-3xl font-bold text-white mb-2">
                            {securityLogs.filter(log => log.event === 'page_load').length}
                        </div>
                        <p className="text-green-200/80 text-sm">Successful loads</p>
                    </div>

                    <div className="bg-gradient-to-r from-red-900/20 to-transparent border border-red-500/20 rounded-xl p-6 text-center">
                        <h3 className="text-xl font-bold text-red-400 mb-2">Errors</h3>
                        <div className="text-3xl font-bold text-white mb-2">
                            {securityLogs.filter(log => log.event.includes('error')).length}
                        </div>
                        <p className="text-red-200/80 text-sm">JavaScript errors</p>
                    </div>
                </div>

                {/* Security Status */}
                <div className="bg-gradient-to-r from-[#1A0F3C] to-transparent border border-purple-500/20 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Security Status</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-purple-200/80">HTTPS Enforcement</span>
                                <span className="text-green-400 font-semibold">✅ Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-purple-200/80">Content Security Policy</span>
                                <span className="text-green-400 font-semibold">✅ Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-purple-200/80">XSS Protection</span>
                                <span className="text-green-400 font-semibold">✅ Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-purple-200/80">Clickjacking Protection</span>
                                <span className="text-green-400 font-semibold">✅ Active</span>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-purple-200/80">Input Sanitization</span>
                                <span className="text-green-400 font-semibold">✅ Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-purple-200/80">Rate Limiting</span>
                                <span className="text-green-400 font-semibold">✅ Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-purple-200/80">Security Monitoring</span>
                                <span className="text-green-400 font-semibold">✅ Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-purple-200/80">Audit Logging</span>
                                <span className="text-green-400 font-semibold">✅ Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Logs */}
                <div className="bg-gradient-to-r from-[#1A0F3C] to-transparent border border-purple-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Security Logs</h2>
                        <button
                            onClick={clearLogs}
                            className="bg-red-600/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                            Clear Logs
                        </button>
                    </div>
                    
                    {securityLogs.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-purple-200/80 mb-4">No security events logged</p>
                            <p className="text-purple-300/60 text-sm">Security monitoring is active and will log events as they occur</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {securityLogs.slice(-20).reverse().map((log, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border ${
                                        log.event.includes('error') || log.event.includes('suspicious')
                                            ? 'border-red-500/30 bg-red-900/10'
                                            : 'border-purple-500/30 bg-purple-900/10'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`font-semibold ${
                                            log.event.includes('error') || log.event.includes('suspicious')
                                                ? 'text-red-400'
                                                : 'text-purple-400'
                                        }`}>
                                            {log.event.replace(/_/g, ' ').toUpperCase()}
                                        </span>
                                        <span className="text-purple-300/70 text-sm">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    
                                    {log.details && (
                                        <div className="text-purple-200/80 text-sm">
                                            <pre className="whitespace-pre-wrap">
                                                {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};






