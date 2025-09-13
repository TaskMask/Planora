import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';
import { User, Mail, Calendar, Camera, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email] = useState(user?.email || '');

  const handleSave = async () => {
    try {
      // In a real app, you would update the user profile here
      // For now, we'll just show a success message
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/50 backdrop-blur-lg rounded-3xl border border-gray-700 shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-700">
              <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
              <p className="text-gray-400">Manage your account information and preferences</p>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || user.email}
                        className="w-32 h-32 rounded-full border-4 border-gray-600"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-4xl">
                        {(user?.displayName || user?.email)?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <button className="absolute bottom-2 right-2 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors text-sm">
                    Change Photo
                  </button>
                </div>

                {/* Profile Information */}
                <div className="flex-1 space-y-6">
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="Enter your display name"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{user?.displayName || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{email}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Account Created */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Member Since
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-white">
                        {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Account Type
                    </label>
                    <div className="p-3 bg-gray-800 rounded-xl">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-600 text-white">
                        {user?.id === 'demo-user-123' ? 'Demo Account' : 'Personal Account'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-2 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setDisplayName(user?.displayName || '');
                          }}
                          className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};
