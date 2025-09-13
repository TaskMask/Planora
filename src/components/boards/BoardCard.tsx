import React, { useState } from 'react';
import { Calendar, Users, MoreHorizontal, Edit, Trash2, Lock, Globe, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(false);
    console.log('🔄 Edit clicked for board:', board.title);
    console.log('🔄 onEdit function exists:', !!onEdit);
    console.log('🔄 Calling onEdit with board:', board);
    onEdit?.(board);
  };

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(false);
    console.log('⚙️ Settings clicked for board:', board.title);
    console.log('⚙️ onSettings function exists:', !!onSettings);
    console.log('⚙️ Calling onSettings with board:', board);
    onSettings?.(board);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(false);
    console.log('🗑️ Delete clicked for board:', board.title);
    console.log('🗑️ onDelete function exists:', !!onDelete);
    console.log('🗑️ Showing confirmation dialog');
    if (confirm(`Are you sure you want to delete "${board.title}"? This action cannot be undone.`)) {
      console.log('🗑️ User confirmed deletion, calling onDelete');
      onDelete?.(board.id);
    } else {
      console.log('🗑️ User cancelled deletion');
    }
  };

  // Get the background style from the board
  const getBackgroundStyle = () => {
    const backgroundColor = board.style?.backgroundColor || board.backgroundColor;
    
    if (backgroundColor) {
      // Check if it's a gradient
      if (backgroundColor.includes('gradient')) {
        return { backgroundImage: backgroundColor };
      } else {
        return { backgroundColor };
      }
    }
    // Fallback to default gray
    return { backgroundColor: '#374151' }; // gray-700 as fallback
  };

  return (
    <>
      <motion.div 
        className="rounded-2xl overflow-hidden relative cursor-pointer group"
        style={getBackgroundStyle()}
        onClick={onClick}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ 
          scale: 1.05, 
          y: -8,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Enhanced overlay with violet gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-black/50 via-violet-900/20 to-transparent rounded-2xl"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 0.4 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Animated border glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-violet-500/20 blur-lg"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Floating shine effect */}
        <motion.div 
          className="absolute inset-0 rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="absolute top-0 left-[-100%] w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{ left: ["[-100%]", "[100%]"] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.div>
        
        <Card
          className="relative z-10 bg-transparent backdrop-blur-none border-transparent shadow-none hover:shadow-none m-0 p-6"
          padding="none"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <motion.h3 
                className="text-xl font-bold text-white drop-shadow-lg truncate"
                whileHover={{ x: 3, color: "#dbeafe" }}
                transition={{ duration: 0.2 }}
              >
                {board.title}
              </motion.h3>
              {board.description && (
                <motion.p 
                  className="text-sm text-gray-200 drop-shadow-md mt-2 line-clamp-2 leading-relaxed"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1, y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  {board.description}
                </motion.p>
              )}
            </div>
            
            {(onEdit || onDelete || onSettings) && (
              <div className="relative" style={{overflow: 'visible'}}>
                <motion.button
                  aria-label="Board actions"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-3 glass-dark rounded-xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ 
                    scale: 1.1, 
                    opacity: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.2)"
                  }}
                  animate={{ 
                    opacity: showActions ? 1 : 0,
                    scale: showActions ? 1.05 : 0.8
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <MoreHorizontal className="h-5 w-5 text-white drop-shadow-lg" />
                </motion.button>
                
                <AnimatePresence>
                  {showActions && (
                    <>
                      <motion.div
                        className="fixed inset-0 z-[999]"
                        onClick={() => setShowActions(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ pointerEvents: 'auto' }}
                      />
                      <motion.div
                        className="absolute right-0 top-full mt-3 min-w-[240px] glass-dark rounded-2xl shadow-2xl z-[1000] flex flex-col border border-white/20 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        {onEdit && (
                          <motion.button
                            onClick={handleEdit}
                            className="w-full flex items-center gap-4 px-6 py-4 text-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 text-left rounded-t-2xl"
                            whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                          >
                            <Edit size={20} className="text-blue-400" />
                            Edit Board
                          </motion.button>
                        )}
                        {onSettings && (
                          <motion.button
                            onClick={handleSettings}
                            className="w-full flex items-center gap-4 px-6 py-4 text-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 text-left"
                            whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                          >
                            <Settings size={20} className="text-purple-400" />
                            Settings
                          </motion.button>
                        )}
                        {onDelete && (
                          <motion.button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-4 px-6 py-4 text-lg text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all duration-300 text-left rounded-b-2xl"
                            whileHover={{ x: 4, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                          >
                            <Trash2 size={20} className="text-red-400" />
                            Delete Board
                          </motion.button>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <motion.div 
            className="mt-6 flex items-center justify-between text-sm text-gray-200 drop-shadow-md"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="flex items-center space-x-6">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05, color: "#dbeafe" }}
                transition={{ duration: 0.2 }}
              >
                <Users className="h-4 w-4 mr-2" />
                <span className="font-medium">{board.members.length} members</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05, color: "#dbeafe" }}
                transition={{ duration: 0.2 }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span className="font-medium">Updated {formatDate(board.updatedAt)}</span>
              </motion.div>
            </div>
            <div className="flex items-center gap-3">
              {board.isPublic ? (
                <motion.div 
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-100 px-3 py-2 rounded-full text-xs backdrop-blur-sm border border-green-400/20"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundImage: "linear-gradient(to right, rgba(34, 197, 94, 0.4), rgba(16, 185, 129, 0.4))"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Globe className="h-3 w-3" />
                  Public
                </motion.div>
              ) : (
                <motion.div 
                  className="flex items-center gap-2 bg-gradient-to-r from-gray-500/30 to-slate-500/30 text-gray-200 px-3 py-2 rounded-full text-xs backdrop-blur-sm border border-gray-400/20"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundImage: "linear-gradient(to right, rgba(107, 114, 128, 0.4), rgba(100, 116, 139, 0.4))"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Lock className="h-3 w-3" />
                  Private
                </motion.div>
              )}
            </div>
          </motion.div>
        </Card>

        {/* Floating particles on hover */}
        <AnimatePresence>
          {showActions && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 10}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -20, -40],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
