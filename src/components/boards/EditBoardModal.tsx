import React, { useState, useEffect } from 'react';
import { X, Save, Globe, Lock, Palette } from 'lucide-react';
import type { Board } from '../../types';

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (boardData: { id: string; title: string; description: string; isPublic?: boolean; backgroundColor?: string }) => void;
  board: Board | null;
  loading?: boolean;
}

const backgroundColors = [
  { name: 'Default', value: '', gradient: 'from-gray-900 via-gray-800 to-gray-900' },
  { name: 'Ocean', value: 'ocean', gradient: 'from-blue-900 via-blue-800 to-cyan-900' },
  { name: 'Forest', value: 'forest', gradient: 'from-green-900 via-emerald-800 to-teal-900' },
  { name: 'Sunset', value: 'sunset', gradient: 'from-orange-900 via-red-800 to-pink-900' },
  { name: 'Purple', value: 'purple', gradient: 'from-purple-900 via-violet-800 to-indigo-900' },
  { name: 'Midnight', value: 'midnight', gradient: 'from-slate-900 via-gray-900 to-black' },
];

export const EditBoardModal: React.FC<EditBoardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  board,
  loading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    if (board) {
      setTitle(board.title);
      setDescription(board.description || '');
      setIsPublic(board.isPublic || false);
      setBackgroundColor(board.backgroundColor || '');
    }
  }, [board]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!board || !title.trim()) return;

    onSave({
      id: board.id,
      title: title.trim(),
      description: description.trim(),
      isPublic,
      backgroundColor,
    });
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen || !board) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white">Edit Board</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Board Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter board title"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
              disabled={loading}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter board description (optional)"
              rows={3}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              disabled={loading}
              maxLength={500}
            />
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Palette className="inline w-4 h-4 mr-2" />
              Background Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {backgroundColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setBackgroundColor(color.value)}
                  className={`relative h-16 rounded-lg bg-gradient-to-br ${color.gradient} border-2 transition-all ${
                    backgroundColor === color.value
                      ? 'border-blue-500 ring-2 ring-blue-500/30'
                      : 'border-gray-600/50 hover:border-gray-500'
                  }`}
                  disabled={loading}
                >
                  <span className="absolute bottom-1 left-1 right-1 text-xs text-white/80 text-center truncate">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Setting */}
          <div>
            <label className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className="flex items-center gap-3">
                {isPublic ? (
                  <Globe className="w-5 h-5 text-green-400" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <span className="text-white font-medium">
                    {isPublic ? 'Public Board' : 'Private Board'}
                  </span>
                  <p className="text-sm text-gray-400">
                    {isPublic
                      ? 'Anyone can view this board'
                      : 'Only members can view this board'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={loading}
                className="w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
