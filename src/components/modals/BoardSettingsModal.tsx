    import React, { useState } from 'react';
import { X, Users, Lock, Globe, Settings, Trash2, Eye, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { BOARD_THEMES, type ThemeKey } from '../../data/boardTemplates';
import type { Board, BoardPermission } from '../../types';

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
  const [activeTab, setActiveTab] = useState<'general' | 'permissions' | 'appearance' | 'danger'>('general');
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description);
  const [isPublic, setIsPublic] = useState(board.isPublic);
  const [allowComments, setAllowComments] = useState(board.allowComments || false);
  const [allowVoting, setAllowVoting] = useState(board.allowVoting || false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>(
    (board.style?.backgroundColor as ThemeKey) || 'gradient-blue'
  );
  const [cardStyle, setCardStyle] = useState(board.style?.cardStyle || 'default');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  if (!isOpen) return null;

  const isOwner = board.ownerId === currentUserId;
  const userPermission = board.permissions?.find(p => p.userId === currentUserId);
  const canEdit = isOwner || userPermission?.role === 'admin';

  const handleSave = () => {
    onUpdateBoard({
      title,
      description,
      isPublic,
      allowComments,
      allowVoting,
      style: {
        ...board.style,
        backgroundColor: selectedTheme,
        cardStyle
      }
    });
    onClose();
  };

  const handleAddMember = () => {
    if (!newMemberEmail.trim() || !canEdit) return;
    
    // In a real app, this would validate the email and add the user
    const newPermission: BoardPermission = {
      userId: `user-${Date.now()}`, // Would be actual user ID
      role: 'member',
      addedAt: new Date().toISOString(),
      addedBy: currentUserId
    };

    onUpdateBoard({
      permissions: [...(board.permissions || []), newPermission],
      members: [...board.members, newPermission.userId]
    });
    setNewMemberEmail('');
  };

  const handleRemoveMember = (userId: string) => {
    if (!canEdit || userId === board.ownerId) return;
    
    onUpdateBoard({
      permissions: board.permissions?.filter(p => p.userId !== userId) || [],
      members: board.members.filter(id => id !== userId)
    });
  };

  const handleRoleChange = (userId: string, newRole: 'admin' | 'member' | 'viewer') => {
    if (!canEdit || userId === board.ownerId) return;
    
    onUpdateBoard({
      permissions: board.permissions?.map(p => 
        p.userId === userId ? { ...p, role: newRole } : p
      ) || []
    });
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
            <Eye className="h-5 w-5 text-gray-400" />
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
      {canEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Add Member</label>
          <div className="flex space-x-2">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter email address..."
              className="flex-1 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleAddMember} disabled={!newMemberEmail.trim()}>
              Add
            </Button>
          </div>
        </div>
      )}

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
                {canEdit ? (
                  <select
                    value={permission.role}
                    onChange={(e) => handleRoleChange(permission.userId, e.target.value as any)}
                    className="bg-gray-700 text-gray-100 text-sm rounded px-2 py-1 border border-gray-600"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    permission.role === 'admin' ? 'bg-orange-600 text-white' :
                    permission.role === 'member' ? 'bg-green-600 text-white' :
                    'bg-gray-600 text-gray-300'
                  }`}>
                    {permission.role.charAt(0).toUpperCase() + permission.role.slice(1)}
                  </span>
                )}
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(permission.userId)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Background Theme</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(BOARD_THEMES).map(([key, theme]) => (
            <div
              key={key}
              onClick={() => canEdit && setSelectedTheme(key as ThemeKey)}
              className={`relative p-3 rounded-lg transition-all ${
                canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              } ${
                selectedTheme === key
                  ? 'ring-2 ring-blue-500'
                  : canEdit ? 'hover:scale-105' : ''
              }`}
            >
              <div className={`w-full h-12 bg-gradient-to-r ${theme.gradient} rounded-md mb-2`} />
              <p className="text-xs text-gray-300 text-center">{theme.name}</p>
              {selectedTheme === key && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Card Style</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'default', name: 'Default', desc: 'Clean and simple' },
            { id: 'minimal', name: 'Minimal', desc: 'Less visual clutter' },
            { id: 'colorful', name: 'Colorful', desc: 'Vibrant and bright' },
            { id: 'glass', name: 'Glass', desc: 'Modern glassmorphism' }
          ].map(style => (
            <div
              key={style.id}
              onClick={() => canEdit && setCardStyle(style.id as any)}
              className={`p-3 rounded-lg border transition-all ${
                canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              } ${
                cardStyle === style.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 bg-gray-800/50' + (canEdit ? ' hover:border-gray-500' : '')
              }`}
            >
              <div className="text-sm font-medium text-gray-100">{style.name}</div>
              <div className="text-xs text-gray-400">{style.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-800/30 rounded-lg">
        <h4 className="font-medium text-gray-100 mb-2">Preview</h4>
        <div className={`w-full h-24 bg-gradient-to-r ${BOARD_THEMES[selectedTheme].gradient} rounded-lg flex items-center justify-center`}>
          <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="text-white font-medium">{title}</div>
            <div className="text-white/70 text-sm">{cardStyle.charAt(0).toUpperCase() + cardStyle.slice(1)} style</div>
          </div>
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
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
                { id: 'appearance', label: 'Appearance', icon: Eye },
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
            {activeTab === 'appearance' && renderAppearanceTab()}
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
