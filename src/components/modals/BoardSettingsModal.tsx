import React, { useState } from 'react';
import { X, Users, Lock, Globe, Settings, Trash2, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Board } from '../../types';

interface BoardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: Board;
  onUpdateBoard: (updates: Partial<Board>) => void;
  onDeleteBoard: () => void;
  currentUserId: string;
}

export const BoardSettingsModal: React.FC<BoardSettingsModalProps> = ({
  isOpen,
  onClose,
  board,
  onUpdateBoard,
  onDeleteBoard,
  currentUserId
}) => {
  console.log('BoardSettingsModal render:', { isOpen, board: board?.title });
  
  const [activeTab, setActiveTab] = useState<'general' | 'permissions' | 'danger'>('general');
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description);
  const [isPublic, setIsPublic] = useState(board.isPublic);
  const [allowComments, setAllowComments] = useState(board.allowComments || false);
  const [allowVoting, setAllowVoting] = useState(board.allowVoting || false);

  if (!isOpen) return null;

  const isOwner = board.ownerId === currentUserId;
  const userPermission = board.permissions?.find(p => p.userId === currentUserId);
  const canEdit = isOwner || userPermission?.role === 'admin';

    const handleSave = async () => {
    try {
      const updates = {
        title,
        description,
        isPublic,
        allowComments,
        allowVoting,
        updatedAt: new Date().toISOString()
      };
      
      onUpdateBoard(updates);
      onClose();
    } catch (error) {
      console.error('Failed to save board settings:', error);
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Board Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!canEdit}
          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!canEdit}
          rows={3}
          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-gray-400" />
            <div>
              <div className="font-medium text-gray-100">Public Board</div>
              <div className="text-sm text-gray-400">Anyone with the link can view this board</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={!canEdit}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-gray-400" />
            <div>
              <div className="font-medium text-gray-100">Allow Comments</div>
              <div className="text-sm text-gray-400">Members can comment on cards</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowComments}
              onChange={(e) => setAllowComments(e.target.checked)}
              disabled={!canEdit}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-gray-400" />
            <div>
              <div className="font-medium text-gray-100">Allow Voting</div>
              <div className="text-sm text-gray-400">Members can vote on cards and ideas</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowVoting}
              onChange={(e) => setAllowVoting(e.target.checked)}
              disabled={!canEdit}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPermissionsTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-100 mb-4">Current Members</h4>
        <div className="space-y-3">
          {/* Owner */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">O</span>
              </div>
              <div>
                <div className="font-medium text-gray-100">Board Owner</div>
                <div className="text-sm text-gray-400">Full access to all board features</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">Owner</span>
              <Shield className="h-4 w-4 text-blue-400" />
            </div>
          </div>

          {/* Other Members */}
          {board.permissions?.filter(p => p.userId !== board.ownerId).map(permission => (
            <div key={permission.userId} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">M</span>
                </div>
                <div>
                  <div className="font-medium text-gray-100">Team Member</div>
                  <div className="text-sm text-gray-400">Added {new Date(permission.addedAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  permission.role === 'admin' ? 'bg-orange-600 text-white' :
                  permission.role === 'member' ? 'bg-green-600 text-white' :
                  'bg-gray-600 text-gray-300'
                }`}>
                  {permission.role.charAt(0).toUpperCase() + permission.role.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDangerTab = () => (
    <div className="space-y-6">
      <div className="p-4 border border-red-600/50 bg-red-900/20 rounded-lg">
        <h4 className="font-medium text-red-400 mb-2 flex items-center">
          <Trash2 className="h-4 w-4 mr-2" />
          Danger Zone
        </h4>
        <p className="text-sm text-gray-300 mb-4">
          These actions cannot be undone. Please be careful.
        </p>
        
        {isOwner && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-900/30 rounded-lg">
              <div>
                <div className="font-medium text-gray-100">Delete Board</div>
                <div className="text-sm text-gray-400">Permanently delete this board and all its content</div>
              </div>
              <Button
                variant="outline"
                onClick={onDeleteBoard}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                Delete Board
              </Button>
            </div>
          </div>
        )}

        {!isOwner && (
          <div className="text-center py-8 text-gray-400">
            <Lock className="h-8 w-8 mx-auto mb-2" />
            <p>Only the board owner can delete this board.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-gray-600 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-200 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-gray-100">Board Settings</h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-700 p-4">
            <nav className="space-y-2">
              {[
                { id: 'general', label: 'General', icon: Settings },
                { id: 'permissions', label: 'Permissions', icon: Users },
                { id: 'danger', label: 'Danger Zone', icon: Trash2 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'permissions' && renderPermissionsTab()}
            {activeTab === 'danger' && renderDangerTab()}
          </div>
        </div>

        {/* Footer */}
        {activeTab !== 'danger' && (
          <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800/50">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!canEdit}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
