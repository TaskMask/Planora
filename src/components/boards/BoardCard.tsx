import React, { useState } from 'react';
import { Calendar, Users, MoreHorizontal, Edit, Trash2, Lock, Globe, Settings } from 'lucide-react';
import { Card } from '../ui';
import type { Board } from '../../types';

interface BoardCardProps {
  board: Board;
  onClick: () => void;
  onEdit?: (board: Board) => void;
  onDelete?: (boardId: string) => void;
  onSettings?: (board: Board) => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({
  board,
  onClick,
  onEdit,
  onDelete,
  onSettings,
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(false);
    onSettings?.(board);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(false);
    onEdit?.(board);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(false);
    if (confirm(`Are you sure you want to delete "${board.title}"? This action cannot be undone.`)) {
      onDelete?.(board.id);
    }
  };

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 group transform hover:scale-105 bg-gray-800/60 border-gray-700/50 relative"
        padding="sm"
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-100 truncate group-hover:text-blue-400 transition-colors">
              {board.title}
            </h3>
            {board.description && (
              <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                {board.description}
              </p>
            )}
          </div>
          
          {(onEdit || onDelete || onSettings) && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700/50 rounded"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>

              {/* Actions dropdown */}
              {showActions && (
                <div className="absolute right-0 top-full mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl z-20 min-w-[160px]">
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200 text-left"
                    >
                      <Edit size={16} />
                      Edit Board
                    </button>
                  )}
                  {onSettings && (
                    <button
                      onClick={handleSettings}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200 text-left"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200 text-left rounded-b-lg"
                    >
                      <Trash2 size={16} />
                      Delete Board
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{board.members.length} members</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Updated {formatDate(board.updatedAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {board.isPublic ? (
              <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                <Globe className="h-3 w-3" />
                Public
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-gray-700/50 text-gray-400 px-2 py-1 rounded-full text-xs">
                <Lock className="h-3 w-3" />
                Private
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Click outside to close actions */}
      {showActions && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowActions(false)}
        />
      )}
    </>
  );
};
