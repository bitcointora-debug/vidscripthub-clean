import React, { useState } from 'react';
import { LiveChatWidget } from './LiveChatWidget.tsx';
import { SupportTicketSystem } from './SupportTicketSystem.tsx';
import { KnowledgeBase } from './KnowledgeBase.tsx';
import { trackEngagement } from './AnalyticsTracker.tsx';

interface SupportSystemProps {
  onClose: () => void;
}

export const SupportSystem: React.FC<SupportSystemProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'ticket' | 'knowledge'>('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    trackEngagement('support_tab_change', { tab });
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
    trackEngagement('live_chat_toggle', { isOpen: !isChatOpen });
  };

  const supportStats = {
    responseTime: '2 hours',
    satisfaction: '98%',
    ticketsResolved: '1,247',
    avgResolutionTime: '4.2 hours'
  };

  const quickActions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: '💬',
      action: () => handleChatToggle(),
      color: 'bg-blue-500'
    },
    {
      title: 'Create Ticket',
      description: 'Submit a detailed support request',
      icon: '🎫',
      action: () => setActiveTab('ticket'),
      color: 'bg-green-500'
    },
    {
      title: 'Knowledge Base',
      description: 'Browse our comprehensive help articles',
      icon: '📚',
      action: () => setActiveTab('knowledge'),
      color: 'bg-purple-500'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: '🎥',
      action: () => window.open('https://youtube.com/vidscripthub', '_blank'),
      color: 'bg-red-500'
    }
  ];

  const faqs = [
    {
      question: 'How do I get started with VidScriptHub?',
      answer: 'Simply sign up, verify your email, and start generating viral scripts in seconds!'
    },
    {
      question: 'What platforms does VidScriptHub support?',
      answer: 'We support YouTube, TikTok, Instagram, LinkedIn, and more social media platforms.'
    },
    {
      question: 'Can I customize the generated scripts?',
      answer: 'Absolutely! All scripts are fully editable and customizable to match your style.'
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: 'Yes! We offer a 30-day money-back guarantee if you\'re not satisfied.'
    }
  ];

  if (activeTab === 'chat') {
    return (
      <LiveChatWidget
        isOpen={isChatOpen}
        onToggle={handleChatToggle}
        onClose={() => setActiveTab('overview')}
      />
    );
  }

  if (activeTab === 'ticket') {
    return (
      <SupportTicketSystem
        onClose={() => setActiveTab('overview')}
      />
    );
  }

  if (activeTab === 'knowledge') {
    return (
      <KnowledgeBase
        onClose={() => setActiveTab('overview')}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Support Center
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{supportStats.responseTime}</div>
            <div className="text-sm text-blue-600">Avg Response Time</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{supportStats.satisfaction}</div>
            <div className="text-sm text-green-600">Satisfaction Rate</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{supportStats.ticketsResolved}</div>
            <div className="text-sm text-purple-600">Tickets Resolved</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{supportStats.avgResolutionTime}</div>
            <div className="text-sm text-orange-600">Resolution Time</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-[#DAFF00] hover:shadow-md transition-all text-left"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {action.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#DAFF00] rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-[#1A0F3C] text-xl">📧</span>
              </div>
              <h4 className="font-medium text-gray-900">Email Support</h4>
              <p className="text-sm text-gray-600">support@vidscripthub.com</p>
              <p className="text-xs text-gray-500">24-48 hour response</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-[#DAFF00] rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-[#1A0F3C] text-xl">💬</span>
              </div>
              <h4 className="font-medium text-gray-900">Live Chat</h4>
              <p className="text-sm text-gray-600">Available 9 AM - 6 PM EST</p>
              <p className="text-xs text-gray-500">Instant response</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-[#DAFF00] rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-[#1A0F3C] text-xl">📞</span>
              </div>
              <h4 className="font-medium text-gray-900">Phone Support</h4>
              <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
              <p className="text-xs text-gray-500">Mon-Fri 9 AM - 5 PM EST</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need immediate help? Our support team is here to assist you 24/7.
          </p>
        </div>
      </div>
    </div>
  );
};






