import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../features/boards';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui';
import { BoardCard } from '../components/boards';
import { EditBoardModal } from '../components/boards/EditBoardModal';
import { CreateBoardModal } from '../components/modals/CreateBoardModal';
import { BoardSettingsModal } from '../components/modals/BoardSettingsModal';
import { Header } from '../components/layout';
import type { Board, BoardStyle } from '../types';
import { boardTemplates } from '../data/boardTemplates';

export const BoardsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { boards, loading, error } = useSelector((state: RootState) => state.boards);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [settingsBoard, setSettingsBoard] = useState<Board | null>(null);

  useEffect(() => {
    console.log('BoardsPage useEffect triggered, user:', user?.id);
    console.log('Current boards count:', boards.length);
    
    // Only fetch boards if user exists and we don't already have boards loaded
    // This prevents refetching and overwriting created boards
    if (user && user.id && boards.length === 0 && !loading) {
      console.log('Dispatching fetchBoards for user:', user.id);
      dispatch(fetchBoards(user.id));
    }
  }, [dispatch, user?.id, boards.length, loading]); // Added boards.length and loading to dependencies

  const handleCreateBoard = async (boardData: {
    title: string;
    description: string;
    templateId?: string;
    style: BoardStyle;
    isPublic: boolean;
  }) => {
    if (!user) return;
    
    try {
      // Find the template if templateId is provided
      const template = boardData.templateId 
        ? boardTemplates.find(t => t.id === boardData.templateId) 
        : undefined;

      console.log('Creating board with data:', { ...boardData, template });

      const result = await dispatch(createBoard({
        title: boardData.title,
        description: boardData.description,
        ownerId: user.id,
        template: template || undefined,
        isPublic: boardData.isPublic,
        style: boardData.style,
      })).unwrap();
      
      console.log('Board creation result:', result);
      
      setIsTemplateModalOpen(false);
      
      // Note: Commenting out navigation to stay on boards page and see the new board
      // Navigate to the board, with template params if a template was used
      // if (result.board) {
      //   if (template) {
      //     navigate(`/boards/${result.board.id}?template=${template.id}&init=true`);
      //   } else {
      //     navigate(`/boards/${result.board.id}`);
      //   }
      // }
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  const handleEditBoard = async (boardData: { id: string; title: string; description: string; isPublic?: boolean; backgroundColor?: string }) => {
    try {
      await dispatch(updateBoard(boardData)).unwrap();
      setEditingBoard(null);
    } catch (err) {
      console.error('Failed to update board:', err);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await dispatch(deleteBoard(boardId)).unwrap();
    } catch (err) {
      console.error('Failed to delete board:', err);
    }
  };

  const handleUpdateBoard = async (updates: Partial<Board>) => {
    if (!settingsBoard) return;
    
    try {
      // Extract only the fields that updateBoard expects
      const updateData: any = {
        id: settingsBoard.id,
        title: updates.title || settingsBoard.title,
        description: updates.description || settingsBoard.description,
      };
      
      if (updates.isPublic !== undefined) updateData.isPublic = updates.isPublic;
      if (updates.backgroundColor) updateData.backgroundColor = updates.backgroundColor;
      
      await dispatch(updateBoard(updateData)).unwrap();
      setSettingsBoard(null);
    } catch (err) {
      console.error('Failed to update board:', err);
    }
  };

  const handleBoardSettings = (board: Board) => {
    setSettingsBoard(board);
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/boards/${boardId}`);
  };

  if (loading && boards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading your boards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Your Boards</h1>
            <p className="mt-2 text-gray-400">
              Organize your projects and collaborate with your team
            </p>
          </div>
          
          <Button onClick={() => setIsTemplateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </Button>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">No boards yet</h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Create your first board to start organizing your projects and tasks.
            </p>
            <Button onClick={() => setIsTemplateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onClick={() => handleBoardClick(board.id)}
                onEdit={(board) => setEditingBoard(board)}
                onDelete={handleDeleteBoard}
                onSettings={handleBoardSettings}
              />
            ))}
            
            {/* Create New Board Card */}
            <div
              onClick={() => setIsTemplateModalOpen(true)}
              className="border-2 border-dashed border-gray-600 rounded-xl p-6 hover:border-gray-500 hover:bg-gray-800/50 cursor-pointer transition-all duration-200 flex items-center justify-center min-h-[200px] group"
            >
              <div className="text-center">
                <Plus className="h-8 w-8 text-gray-500 group-hover:text-gray-400 mx-auto mb-2 transition-colors" />
                <span className="text-gray-400 group-hover:text-gray-300 font-medium transition-colors">Create new board</span>
              </div>
            </div>
          </div>
        )}

        <CreateBoardModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onSubmit={handleCreateBoard}
        />

        <EditBoardModal
          isOpen={!!editingBoard}
          onClose={() => setEditingBoard(null)}
          onSave={handleEditBoard}
          board={editingBoard}
          loading={loading}
        />

        {settingsBoard && user && (
          <BoardSettingsModal
            isOpen={!!settingsBoard}
            onClose={() => setSettingsBoard(null)}
            board={settingsBoard}
            onUpdateBoard={handleUpdateBoard}
            onDeleteBoard={() => {
              handleDeleteBoard(settingsBoard.id);
              setSettingsBoard(null);
            }}
            currentUserId={user.id}
          />
        )}
      </div>
    </div>
  );
};
