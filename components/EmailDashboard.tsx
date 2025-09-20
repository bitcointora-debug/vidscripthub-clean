import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient.ts';

interface EmailLog {
  id: string;
  email: string;
  email_type: string;
  status: string;
  sent_at: string;
  delivered_at?: string;
  error_message?: string;
}

interface EmailSequence {
  id: string;
  sequence_type: string;
  current_step: number;
  total_steps: number;
  is_active: boolean;
  started_at: string;
}

export const EmailDashboard: React.FC = () => {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [emailSequences, setEmailSequences] = useState<EmailSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSent: 0,
    totalDelivered: 0,
    totalBounced: 0,
    deliveryRate: 0,
    openRate: 0
  });

  useEffect(() => {
    fetchEmailData();
  }, []);

  const fetchEmailData = async () => {
    try {
      setLoading(true);
      
      // Fetch email logs
      const { data: logs, error: logsError } = await supabase
        .from('email_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      // Fetch email sequences
      const { data: sequences, error: sequencesError } = await supabase
        .from('email_sequences')
        .select('*')
        .order('started_at', { ascending: false });

      if (sequencesError) throw sequencesError;

      setEmailLogs(logs || []);
      setEmailSequences(sequences || []);

      // Calculate stats
      const totalSent = logs?.length || 0;
      const totalDelivered = logs?.filter(log => log.status === 'delivered').length || 0;
      const totalBounced = logs?.filter(log => log.status === 'bounced').length || 0;
      
      setStats({
        totalSent,
        totalDelivered,
        totalBounced,
        deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
        openRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0 // Simplified for demo
      });

    } catch (error) {
      console.error('Error fetching email data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com', // Replace with actual test email
          name: 'Test User',
          type: 'welcome'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Test email sent successfully!');
        fetchEmailData(); // Refresh data
      } else {
        alert('Error sending test email: ' + result.error);
      }
    } catch (error) {
      alert('Error sending test email: ' + error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-blue-400 bg-blue-900/20';
      case 'delivered': return 'text-green-400 bg-green-900/20';
      case 'bounced': return 'text-red-400 bg-red-900/20';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getEmailTypeLabel = (type: string) => {
    switch (type) {
      case 'welcome': return 'Welcome Email';
      case 'nurture1': return 'Nurture #1';
      case 'nurture2': return 'Nurture #2';
      case 'abandoned_cart': return 'Abandoned Cart';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0A2A] text-white p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#DAFF00]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0A2A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#DAFF00] mb-2">Email Marketing Dashboard</h1>
          <p className="text-purple-200/80">Monitor your email campaigns and automation</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-500/20 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-blue-400 mb-2">Total Sent</h3>
            <div className="text-3xl font-bold text-white mb-2">{stats.totalSent}</div>
            <p className="text-blue-200/80 text-sm">Emails sent</p>
          </div>

          <div className="bg-gradient-to-r from-green-900/20 to-transparent border border-green-500/20 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-green-400 mb-2">Delivered</h3>
            <div className="text-3xl font-bold text-white mb-2">{stats.totalDelivered}</div>
            <p className="text-green-200/80 text-sm">Successfully delivered</p>
          </div>

          <div className="bg-gradient-to-r from-red-900/20 to-transparent border border-red-500/20 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-red-400 mb-2">Bounced</h3>
            <div className="text-3xl font-bold text-white mb-2">{stats.totalBounced}</div>
            <p className="text-red-200/80 text-sm">Failed deliveries</p>
          </div>

          <div className="bg-gradient-to-r from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-purple-400 mb-2">Delivery Rate</h3>
            <div className="text-3xl font-bold text-white mb-2">{stats.deliveryRate.toFixed(1)}%</div>
            <p className="text-purple-200/80 text-sm">Success rate</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <button
            onClick={sendTestEmail}
            className="bg-gradient-to-r from-[#DAFF00] to-[#B8E600] text-[#1A0F3C] font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity mr-4"
          >
            📧 Send Test Email
          </button>
          <button
            onClick={fetchEmailData}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Email Sequences */}
        <div className="bg-gradient-to-r from-[#1A0F3C] to-transparent border border-purple-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Active Email Sequences</h2>
          
          {emailSequences.length === 0 ? (
            <p className="text-purple-200/80">No active email sequences</p>
          ) : (
            <div className="space-y-4">
              {emailSequences.map((sequence) => (
                <div key={sequence.id} className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">{sequence.sequence_type}</h3>
                      <p className="text-purple-200/80 text-sm">
                        Step {sequence.current_step} of {sequence.total_steps}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      sequence.is_active ? 'bg-green-900/20 text-green-400' : 'bg-gray-900/20 text-gray-400'
                    }`}>
                      {sequence.is_active ? 'Active' : 'Completed'}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-purple-900/30 rounded-full h-2">
                      <div 
                        className="bg-[#DAFF00] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(sequence.current_step / sequence.total_steps) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Logs */}
        <div className="bg-gradient-to-r from-[#1A0F3C] to-transparent border border-purple-500/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Email Activity</h2>
          
          {emailLogs.length === 0 ? (
            <p className="text-purple-200/80">No email activity yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left py-3 px-4 text-purple-200/80">Email</th>
                    <th className="text-left py-3 px-4 text-purple-200/80">Type</th>
                    <th className="text-left py-3 px-4 text-purple-200/80">Status</th>
                    <th className="text-left py-3 px-4 text-purple-200/80">Sent</th>
                    <th className="text-left py-3 px-4 text-purple-200/80">Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="border-b border-purple-500/10">
                      <td className="py-3 px-4 text-white">{log.email}</td>
                      <td className="py-3 px-4 text-purple-200/80">{getEmailTypeLabel(log.email_type)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-purple-200/80">
                        {new Date(log.sent_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-purple-200/80">
                        {log.delivered_at ? new Date(log.delivered_at).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};






