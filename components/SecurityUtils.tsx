import React, { useEffect } from 'react';

// Security utility functions
export const securityUtils = {
    // Input sanitization
    sanitizeInput: (input: string): string => {
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .trim();
    },

    // Validate email format
    validateEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate password strength
    validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];
        
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Generate secure random token
    generateSecureToken: (length: number = 32): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            result += chars[array[i] % chars.length];
        }
        
        return result;
    },

    // Hash password (client-side for additional security)
    hashPassword: async (password: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Check for suspicious patterns
    detectSuspiciousActivity: (input: string): boolean => {
        const suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /eval\s*\(/i,
            /document\.cookie/i,
            /window\.location/i,
            /alert\s*\(/i,
            /prompt\s*\(/i,
            /confirm\s*\(/i
        ];
        
        return suspiciousPatterns.some(pattern => pattern.test(input));
    },

    // Rate limiting check
    checkRateLimit: (key: string, limit: number, windowMs: number): boolean => {
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Get existing attempts from localStorage
        const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
        
        // Filter attempts within the current window
        const recentAttempts = attempts.filter((timestamp: number) => timestamp > windowStart);
        
        // Check if limit exceeded
        if (recentAttempts.length >= limit) {
            return false; // Rate limit exceeded
        }
        
        // Add current attempt
        recentAttempts.push(now);
        localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentAttempts));
        
        return true; // Within rate limit
    },

    // Log security event
    logSecurityEvent: (event: string, details: any) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event,
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Store in localStorage for now (in production, send to secure logging service)
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        logs.push(logEntry);
        
        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('security_logs', JSON.stringify(logs));
        
        // Also send to Google Analytics if available
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'security_event', {
                event_category: 'security',
                event_label: event,
                custom_map: {
                    'custom_parameter_1': 'security_event'
                }
            });
        }
    }
};

// Security monitoring component
export const SecurityMonitor: React.FC = () => {
    useEffect(() => {
        // Monitor for suspicious activities
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            // Log page unload
            securityUtils.logSecurityEvent('page_unload', {
                timestamp: Date.now(),
                url: window.location.href
            });
        };

        const handleError = (event: ErrorEvent) => {
            // Log JavaScript errors
            securityUtils.logSecurityEvent('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error?.toString()
            });
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            // Log unhandled promise rejections
            securityUtils.logSecurityEvent('unhandled_rejection', {
                reason: event.reason?.toString(),
                promise: event.promise?.toString()
            });
        };

        // Add event listeners
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        // Log page load
        securityUtils.logSecurityEvent('page_load', {
            timestamp: Date.now(),
            url: window.location.href,
            referrer: document.referrer
        });

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    return null; // This component doesn't render anything
};

// Input validation component
interface SecureInputProps {
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
    className?: string;
    onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export const SecureInput: React.FC<SecureInputProps> = ({
    value,
    onChange,
    type = 'text',
    placeholder,
    className = '',
    onValidationChange
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;
        
        // Sanitize input
        newValue = securityUtils.sanitizeInput(newValue);
        
        // Check for suspicious patterns
        if (securityUtils.detectSuspiciousActivity(newValue)) {
            securityUtils.logSecurityEvent('suspicious_input_detected', {
                input: newValue,
                type,
                timestamp: Date.now()
            });
            
            // Block suspicious input
            return;
        }
        
        onChange(newValue);
        
        // Validate based on type
        if (type === 'email' && onValidationChange) {
            const isValid = securityUtils.validateEmail(newValue);
            onValidationChange(isValid, isValid ? [] : ['Invalid email format']);
        } else if (type === 'password' && onValidationChange) {
            const validation = securityUtils.validatePassword(newValue);
            onValidationChange(validation.isValid, validation.errors);
        }
    };

    return (
        <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`${className} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            autoComplete={type === 'password' ? 'new-password' : 'off'}
        />
    );
};

// Rate limiting hook
export const useRateLimit = (key: string, limit: number = 5, windowMs: number = 60000) => {
    const checkLimit = () => {
        return securityUtils.checkRateLimit(key, limit, windowMs);
    };

    const logAttempt = (success: boolean) => {
        securityUtils.logSecurityEvent('rate_limit_check', {
            key,
            success,
            timestamp: Date.now()
        });
    };

    return { checkLimit, logAttempt };
};






