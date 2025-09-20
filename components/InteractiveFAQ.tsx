import React, { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface InteractiveFAQProps {
    faqs: FAQItem[];
}

export const InteractiveFAQ: React.FC<InteractiveFAQProps> = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="bg-gradient-to-r from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-500/40"
                >
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-purple-900/10 transition-colors duration-200"
                    >
                        <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                        <div className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="px-6 pb-4">
                            <p className="text-purple-200/80 leading-relaxed">{faq.answer}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};






