import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Board } from '../../types';
import { BOARD_THEMES, tailwindToCSSGradient } from '../../data/boardTemplates';

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: Board | null;
  onUpdate: (updates: Partial<Board>) => void;
  onDelete?: (boardId: string) => void;
}

export const EditBoardModal: React.FC<EditBoardModalProps> = ({
  isOpen,
  onClose,
  board,
  onUpdate,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('blue');

  console.log('EditBoardModal render:', { isOpen, board: board?.title });

  useEffect(() => {
    if (board) {
      setTitle(board.title);
      setDescription(board.description || '');
      
      // Try to find the theme that matches the current backgroundColor
      const currentTheme = Object.entries(BOARD_THEMES).find(([_, themeData]) => {
        const themeGradient = tailwindToCSSGradient(themeData.gradient);
        return themeGradient === board.backgroundColor;
      });
      
      if (currentTheme) {
        setSelectedTheme(currentTheme[0]);
      }
    }
  }, [board]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const themeData = BOARD_THEMES[selectedTheme as keyof typeof BOARD_THEMES];
    const backgroundColor = tailwindToCSSGradient(themeData.gradient);

    onUpdate({
      title: title.trim(),
      description: description.trim(),
      backgroundColor,
      style: {
        backgroundColor,
        cardStyle: (board?.style?.cardStyle || 'default') as 'glass' | 'default' | 'colorful' | 'minimal',
        fontSize: (board?.style?.fontSize || 'medium') as 'small' | 'medium' | 'large',
        spacing: (board?.style?.spacing || 'normal') as 'compact' | 'normal' | 'relaxed'
      }
    });
  };

  const handleDelete = () => {
    console.log('🗑️ EditBoardModal: handleDelete called');
    console.log('🗑️ EditBoardModal: board:', board);
    console.log('🗑️ EditBoardModal: onDelete function:', onDelete);
    
    if (!board || !onDelete) {
      console.log('🗑️ EditBoardModal: Missing board or onDelete function');
      return;
    }
    
    console.log('🗑️ EditBoardModal: Showing confirmation dialog for board:', board.title);
    if (confirm(`Are you sure you want to delete "${board.title}"? This action cannot be undone and will delete all lists and cards.`)) {
      console.log('🗑️ EditBoardModal: User confirmed deletion, calling onDelete with boardId:', board.id);
      onDelete(board.id);
      console.log('🗑️ EditBoardModal: onDelete called, closing modal');
      onClose();
    } else {
      console.log('🗑️ EditBoardModal: User cancelled deletion');
    }
  };

  if (!isOpen || !board) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Board</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Board Title */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Board Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-white/50 focus:outline-none focus:ring-2 
                       focus:ring-blue-500/50 focus:border-transparent transition-all"
              placeholder="Enter board title..."
              required
            />
          </div>

          {/* Board Description */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-white/50 focus:outline-none focus:ring-2 
                       focus:ring-blue-500/50 focus:border-transparent transition-all
                       resize-none"
              placeholder="Enter board description..."
              rows={3}
            />
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">
              Color Theme
            </label>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(BOARD_THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedTheme(key)}
                  className={`relative w-full h-12 rounded-lg transition-all duration-200 ${
                    selectedTheme === key
                      ? 'ring-2 ring-white scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background: tailwindToCSSGradient(theme.gradient)
                  }}
                >
                  {selectedTheme === key && (
                    <div className="absolute inset-0 bg-white/20 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 
                       rounded-lg text-white transition-all duration-200"
            >
              Cancel
            </button>
            
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-3 bg-red-600/80 hover:bg-red-600 border border-red-500/50 
                         rounded-lg text-white transition-all duration-200 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
            
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                       hover:from-blue-600 hover:to-purple-700 rounded-lg text-white 
                       font-medium transition-all duration-200 transform hover:scale-105"
            >
              Update Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
