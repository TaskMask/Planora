import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Bell, Shield, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    boardUpdates: true,
    comments: true
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    boardsPublic: false,
    analytics: true
  });

  const handleSaveSettings = () => {
    // In a real app, you would save these settings to the backend
    toast.success('Settings saved successfully!');
  };

  const SettingSection: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ 
    title, 
    children, 
    icon 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
    >
      <div className="flex items-center space-x-3 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ 
    enabled, 
    onChange 
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
        enabled ? 'bg-violet-600' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Customize your Planora experience</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
              {/* Notifications */}
              <SettingSection 
                title="Notifications" 
                icon={<Bell className="w-5 h-5 text-violet-400" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive updates via email</p>
                    </div>
                    <ToggleSwitch 
                      enabled={notifications.email} 
                      onChange={(enabled) => setNotifications({...notifications, email: enabled})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-400">Browser push notifications</p>
                    </div>
                    <ToggleSwitch 
                      enabled={notifications.push} 
                      onChange={(enabled) => setNotifications({...notifications, push: enabled})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Board Updates</p>
                      <p className="text-sm text-gray-400">Notify when boards are updated</p>
                    </div>
                    <ToggleSwitch 
                      enabled={notifications.boardUpdates} 
                      onChange={(enabled) => setNotifications({...notifications, boardUpdates: enabled})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Comments</p>
                      <p className="text-sm text-gray-400">Notify when someone comments</p>
                    </div>
                    <ToggleSwitch 
                      enabled={notifications.comments} 
                      onChange={(enabled) => setNotifications({...notifications, comments: enabled})}
                    />
                  </div>
                </div>
              </SettingSection>

              {/* Privacy */}
              <SettingSection 
                title="Privacy & Security" 
                icon={<Shield className="w-5 h-5 text-green-400" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Profile Visibility</p>
                      <p className="text-sm text-gray-400">Make your profile visible to others</p>
                    </div>
                    <ToggleSwitch 
                      enabled={privacy.profileVisible} 
                      onChange={(enabled) => setPrivacy({...privacy, profileVisible: enabled})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Public Boards</p>
                      <p className="text-sm text-gray-400">Allow others to view your public boards</p>
                    </div>
                    <ToggleSwitch 
                      enabled={privacy.boardsPublic} 
                      onChange={(enabled) => setPrivacy({...privacy, boardsPublic: enabled})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Analytics</p>
                      <p className="text-sm text-gray-400">Help improve Planora with usage analytics</p>
                    </div>
                    <ToggleSwitch 
                      enabled={privacy.analytics} 
                      onChange={(enabled) => setPrivacy({...privacy, analytics: enabled})}
                    />
                  </div>
                </div>
              </SettingSection>

              {/* Save Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex justify-end pt-4"
              >
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center space-x-2 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};
