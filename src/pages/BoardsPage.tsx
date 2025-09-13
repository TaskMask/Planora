import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3 } from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import { fetchBoards, createBoard, updateBoard, deleteBoard, clearBoards } from '../features/boards';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui';
import { BoardCard } from '../components/boards';
import { EditBoardModal } from '../components/modals/EditBoardModal';
import { CreateBoardModal } from '../components/modals/CreateBoardModal';
import { BoardSettingsModal } from '../components/modals/BoardSettingsModal';
import { Layout } from '../components/layout';
import { AnalyticsSummary } from '../components/analytics';
import { resetSampleData } from '../utils/seedData';
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

  const [hasInitialized, setHasInitialized] = useState(false);
  const [lastUserId, setLastUserId] = useState<string | null>(null);

  useEffect(() => {
    // Reset initialization when user changes
    if (user?.id !== lastUserId) {
      console.log('User changed from', lastUserId, 'to', user?.id, '- clearing boards and resetting initialization');
      // Clear current boards when user changes
      dispatch(clearBoards());
      setHasInitialized(false);
      setLastUserId(user?.id || null);
    }
  }, [user?.id, lastUserId, dispatch]);

  useEffect(() => {
    // Load boards from localStorage when user is available and we haven't initialized yet
    if (user && user.id && !hasInitialized) {
      console.log('Loading boards from localStorage for user:', user.id);
      
      // For demo users, always load fresh sample data
      if (user.id === 'demo-user-123') {
        console.log('Demo user detected - loading fresh sample data');
        resetSampleData(user.id, dispatch);
      } else {
        // For personal accounts, just fetch existing data (no sample data loading)
        console.log('Personal account detected - fetching existing user data only');
      }
      
      dispatch(fetchBoards(user.id));
      setHasInitialized(true);
    }
  }, [dispatch, user?.id, hasInitialized]);

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

  const handleEditBoard = (board: Board) => {
    console.log('📝 BoardsPage: Opening edit modal for board:', board);
    console.log('📝 BoardsPage: Setting editingBoard state');
    setEditingBoard(board);
  };

  const handleDeleteBoard = async (boardId: string) => {
    console.log('🗑️ BoardsPage: Delete board called with ID:', boardId);
    try {
      console.log('🗑️ BoardsPage: Dispatching deleteBoard action');
      await dispatch(deleteBoard(boardId)).unwrap();
      console.log('🗑️ BoardsPage: Board deleted successfully');
    } catch (err) {
      console.error('🗑️ BoardsPage: Failed to delete board:', err);
    }
  };

  const handleUpdateBoard = async (updates: Partial<Board>) => {
    const boardToUpdate = settingsBoard || editingBoard;
    console.log('💾 BoardsPage: Update board called with:', { updates, boardToUpdate: boardToUpdate?.title });
    if (!boardToUpdate) return;
    
    try {
      // Extract the fields that updateBoard expects and supports
      const updateData: any = {
        id: boardToUpdate.id,
        title: updates.title || boardToUpdate.title,
        description: updates.description || boardToUpdate.description,
      };
      
      // Add optional fields if provided
      if (updates.isPublic !== undefined) updateData.isPublic = updates.isPublic;
      if (updates.backgroundColor) updateData.backgroundColor = updates.backgroundColor;
      if (updates.style) updateData.style = updates.style;
      if (updates.allowComments !== undefined) updateData.allowComments = updates.allowComments;
      if (updates.allowVoting !== undefined) updateData.allowVoting = updates.allowVoting;
      
      console.log('💾 BoardsPage: Updating board with data:', updateData);
      
      await dispatch(updateBoard(updateData)).unwrap();
      console.log('💾 BoardsPage: Board updated successfully');
      setSettingsBoard(null);
      setEditingBoard(null);
    } catch (err) {
      console.error('💾 BoardsPage: Failed to update board:', err);
    }
  };

  const handleBoardSettings = (board: Board) => {
    console.log('⚙️ BoardsPage: Opening settings for board:', board);
    console.log('⚙️ BoardsPage: Setting settingsBoard state');
    setSettingsBoard(board);
  };

  const handleBoardClick = (boardId: string) => {
    if (user?.id === 'demo-user-123') {
      navigate(`/demo/boards/${boardId}`);
    } else {
      navigate(`/boards/${boardId}`);
    }
  };

  if (loading && boards.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto shadow-lg shadow-violet-500/30"></div>
          <p className="mt-4 text-gray-300 animate-fadeInUp delay-300">Loading your boards...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Darker Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ 
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #111111 50%, #0a0a0a 75%, #000000 100%)',
          opacity: 1
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Animated Header */}
        <div className="flex items-center justify-between mb-8 animate-fadeInUp">
          <div className="animate-slideInFromLeft">
            <h1 className="text-4xl font-bold text-white animate-glow">
              Your Boards
            </h1>
            <p className="mt-3 text-gray-400 animate-fadeIn delay-200 text-lg">
              Organize your projects and collaborate with your team ✨
            </p>
          </div>
          
          <div className="flex items-center space-x-4 animate-slideInFromRight">
            <Button 
              variant="outline"
              onClick={() => navigate(user?.id === 'demo-user-123' ? '/demo/analytics' : '/analytics')}
              className="bg-gray-900 hover:bg-gray-800 border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Analytics
            </Button>
            
            <Button 
              onClick={() => setIsTemplateModalOpen(true)}
              className="bg-violet-700 hover:bg-violet-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Board
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 card-aesthetic bg-gradient-to-r from-red-500/20 to-violet-500/20 border-red-400/30 text-red-200 px-6 py-4 rounded-2xl animate-fadeInUp delay-100 shadow-lg shadow-red-500/20">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Enhanced Analytics Summary */}
        <div className="animate-fadeInUp delay-200 mb-8">
          <div className="card-aesthetic p-6 rounded-3xl">
            <AnalyticsSummary />
          </div>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-16 animate-fadeInUp delay-400">
            <div className="card-aesthetic p-12 rounded-3xl max-w-lg mx-auto">
              <div className="text-8xl mb-6 animate-float">📋</div>
              <h3 className="text-2xl font-bold text-white mb-4 animate-fadeIn delay-500">No boards yet</h3>
              <p className="text-gray-300 mb-8 max-w-sm mx-auto animate-fadeIn delay-600 text-lg leading-relaxed">
                Create your first board to start organizing your projects and unlock your productivity potential.
              </p>
              <Button 
                onClick={() => setIsTemplateModalOpen(true)}
                className="btn-gradient px-8 py-4 rounded-2xl font-semibold text-white shadow-lg animate-scaleIn delay-700 text-lg"
              >
                <Plus className="h-5 w-5 mr-3" />
                Create Your First Board
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fadeInUp delay-300">
            {boards.map((board, index) => (
              <div 
                key={board.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="card-aesthetic p-0 hover:scale-105 transition-all duration-500">
                  <BoardCard
                    board={board}
                    onClick={() => handleBoardClick(board.id)}
                    onEdit={handleEditBoard}
                    onDelete={handleDeleteBoard}
                    onSettings={handleBoardSettings}
                  />
                </div>
              </div>
            ))}
            
            {/* Enhanced Create New Board Card */}
            <div
              onClick={() => setIsTemplateModalOpen(true)}
              className="card-aesthetic border-2 border-dashed border-violet-400/30 hover:border-violet-400/60 p-8 cursor-pointer transition-all duration-500 flex items-center justify-center min-h-[240px] group hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20 animate-fadeInUp"
              style={{ animationDelay: `${400 + boards.length * 100}ms` }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-all duration-300" />
                </div>
                <span className="text-purple-300 group-hover:text-white font-semibold text-lg transition-colors">Create new board</span>
                <p className="text-gray-400 text-sm mt-2 group-hover:text-gray-300">Start organizing your next project</p>
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
          isOpen={editingBoard !== null}
          onClose={() => setEditingBoard(null)}
          board={editingBoard}
          onUpdate={handleUpdateBoard}
          onDelete={(boardId) => {
            console.log('🗑️ EditBoardModal onDelete callback triggered with boardId:', boardId);
            handleDeleteBoard(boardId);
            console.log('🗑️ EditBoardModal closing edit modal after deletion');
            setEditingBoard(null);
          }}
        />

        {settingsBoard && (
          <BoardSettingsModal
            isOpen={!!settingsBoard}
            onClose={() => setSettingsBoard(null)}
            board={settingsBoard}
            onUpdateBoard={handleUpdateBoard}
            onDeleteBoard={() => {
              handleDeleteBoard(settingsBoard.id);
              setSettingsBoard(null);
            }}
            currentUserId={user?.id || 'default-user'}
          />
        )}
      </div>
    </Layout>
  );
};
