import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import type { RootState, AppDispatch } from '../store';
import { fetchLists, createList, moveList } from '../features/lists';
import { fetchCards, createCard, updateCard, deleteCard, moveCard } from '../features/cards';
import { fetchLabels } from '../features/labels';
import { useAuth } from '../hooks/useAuth';
import { useTemplateInitialization } from '../hooks/useTemplateInitialization';
import { Button } from '../components/ui';
import { Header } from '../components/layout';
import { CreateCardModal } from '../components/cards';
import { CardDetailModal } from '../components/cards/CardDetailModal';
import { DraggableList } from '../components/lists';
import { DraggableCard } from '../components/cards/DraggableCard';
import type { Card, List } from '../types';

export const BoardDetailPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { boards } = useSelector((state: RootState) => state.boards);
  const { lists, loading, error } = useSelector((state: RootState) => state.lists);
  const { cards } = useSelector((state: RootState) => state.cards);
  const { labels } = useSelector((state: RootState) => state.labels);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [cardModalState, setCardModalState] = useState<{
    isOpen: boolean;
    listId: string;
    listTitle: string;
  }>({ isOpen: false, listId: '', listTitle: '' });
  const [cardDetailModal, setCardDetailModal] = useState<{
    isOpen: boolean;
    card: Card | null;
  }>({ isOpen: false, card: null });
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const currentBoard = boards.find(board => board.id === boardId);

  // Initialize template if needed
  useTemplateInitialization(boardId, user?.id);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchLists(boardId));
      dispatch(fetchLabels(boardId));
    }
  }, [dispatch, boardId]);

  useEffect(() => {
    // Fetch cards for all lists
    lists.forEach(list => {
      dispatch(fetchCards(list.id));
    });
  }, [dispatch, lists]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim() || !boardId) return;

    try {
      await dispatch(createList({
        title: newListTitle.trim(),
        boardId,
        position: lists.length,
      })).unwrap();
      
      setNewListTitle('');
      setIsCreatingList(false);
    } catch (err) {
      console.error('Failed to create list:', err);
    }
  };

  const handleCancelCreate = () => {
    setNewListTitle('');
    setIsCreatingList(false);
  };

  const handleAddCard = (listId: string, listTitle: string) => {
    setCardModalState({ isOpen: true, listId, listTitle });
  };

  const handleCreateCard = async (cardData: { title: string; description?: string }) => {
    if (!user || !boardId) return;

    try {
      const listCards = cards.filter(card => card.listId === cardModalState.listId);
      
      await dispatch(createCard({
        title: cardData.title,
        description: cardData.description,
        listId: cardModalState.listId,
        boardId,
        position: listCards.length,
        createdBy: user.id,
      })).unwrap();
      
      setCardModalState({ isOpen: false, listId: '', listTitle: '' });
    } catch (err) {
      console.error('Failed to create card:', err);
    }
  };

  const handleCardClick = (card: Card) => {
    setCardDetailModal({ isOpen: true, card });
  };

  const handleUpdateCard = async (cardData: Partial<Card>) => {
    try {
      await dispatch(updateCard(cardData as Partial<Card> & { id: string })).unwrap();
      setCardDetailModal({ isOpen: false, card: null });
    } catch (err) {
      console.error('Failed to update card:', err);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await dispatch(deleteCard(cardId)).unwrap();
      setCardDetailModal({ isOpen: false, card: null });
    } catch (err) {
      console.error('Failed to delete card:', err);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) return;
    
    const activeData = active.data.current;
    const overData = over.data.current;
    
    // Handle card over list (cross-list movement)
    if (activeData?.type === 'card' && overData?.type === 'list') {
      const activeCard = activeData.card as Card;
      const overList = overData.list as List;
      
      if (activeCard.listId !== overList.id) {
        // Move card to different list
        dispatch(moveCard({
          cardId: activeCard.id,
          newListId: overList.id,
          newPosition: 0, // Add to top of the list
        }));
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    if (activeId === overId) return;
    
    const activeData = active.data.current;
    const overData = over.data.current;
    
    console.log('Drag ended:', { activeId, overId, activeData, overData });
    
    // Handle card operations
    if (activeData?.type === 'card') {
      const activeCard = activeData.card as Card;
      
      // If dropping on another card
      if (overData?.type === 'card') {
        const overCard = overData.card as Card;
        
        // Same list reordering
        if (activeCard.listId === overCard.listId) {
          const listCards = cards
            .filter(card => card.listId === activeCard.listId)
            .sort((a, b) => a.position - b.position);
            
          const oldIndex = listCards.findIndex(card => card.id === activeId);
          const newIndex = listCards.findIndex(card => card.id === overId);
          
          console.log('Reordering within list:', { oldIndex, newIndex, listCards });
          
          if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
            dispatch(moveCard({
              cardId: activeCard.id,
              newListId: activeCard.listId,
              newPosition: newIndex,
            }));
          }
        } else {
          // Moving to different list
          const targetListCards = cards
            .filter(card => card.listId === overCard.listId)
            .sort((a, b) => a.position - b.position);
            
          const newIndex = targetListCards.findIndex(card => card.id === overId);
          
          dispatch(moveCard({
            cardId: activeCard.id,
            newListId: overCard.listId,
            newPosition: newIndex,
          }));
        }
      }
      // If dropping on a list (empty area)
      else if (overData?.type === 'list') {
        const targetList = overData.list as List;
        const targetListCards = cards
          .filter(card => card.listId === targetList.id)
          .sort((a, b) => a.position - b.position);
          
        dispatch(moveCard({
          cardId: activeCard.id,
          newListId: targetList.id,
          newPosition: targetListCards.length,
        }));
      }
    }
    
    // Handle list reordering
    if (activeData?.type === 'list' && overData?.type === 'list') {
      const oldIndex = lists.findIndex(list => list.id === activeId);
      const newIndex = lists.findIndex(list => list.id === overId);
      
      if (oldIndex !== newIndex) {
        dispatch(moveList({
          listId: activeId,
          newPosition: newIndex,
        }));
      }
    }
  };

  const getCardsForList = (listId: string) => {
    return cards.filter(card => card.listId === listId);
  };

  const getBackgroundClass = (bgColor?: string) => {
    switch (bgColor) {
      case 'ocean':
        return 'from-blue-900 via-blue-800 to-cyan-900';
      case 'forest':
        return 'from-green-900 via-emerald-800 to-teal-900';
      case 'sunset':
        return 'from-orange-900 via-red-800 to-pink-900';
      case 'purple':
        return 'from-purple-900 via-violet-800 to-indigo-900';
      case 'midnight':
        return 'from-slate-900 via-gray-900 to-black';
      default:
        return 'from-gray-900 via-gray-800 to-gray-900';
    }
  };

  if (!currentBoard) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getBackgroundClass()} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-100 mb-2">Board not found</h2>
          <p className="text-gray-300 mb-4">The board you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/boards')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Boards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundClass(currentBoard.backgroundColor)}`}>
      <Header />
      
      {/* Board Header */}
      <div className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/boards')}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-100">{currentBoard.title}</h1>
                {currentBoard.description && (
                  <p className="text-gray-300">{currentBoard.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsCreatingList(true)}
                disabled={isCreatingList}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add List
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Board Content with Drag and Drop */}
      <div className="flex-1 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="inline-flex space-x-4 p-6 min-h-full">
            <SortableContext items={lists.map(list => list.id)} strategy={horizontalListSortingStrategy}>
              {lists.map((list) => {
                const listCards = getCardsForList(list.id);
                
                return (
                  <DraggableList
                    key={list.id}
                    list={list}
                    cards={listCards}
                    onAddCard={handleAddCard}
                    onCardClick={handleCardClick}
                  />
                );
              })}
            </SortableContext>

            {/* Create New List */}
            {isCreatingList ? (
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 w-72 flex-shrink-0">
                <form onSubmit={handleCreateList}>
                  <input
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Enter list title..."
                    className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <div className="flex space-x-2 mt-2">
                    <Button type="submit" size="sm" disabled={!newListTitle.trim()}>
                      Add List
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelCreate}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingList(true)}
                className="bg-gray-800/40 hover:bg-gray-700/60 text-gray-300 hover:text-gray-100 rounded-lg p-3 w-72 flex-shrink-0 flex items-center justify-center space-x-2 transition-all border-2 border-dashed border-gray-600 hover:border-gray-500 backdrop-blur-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add another list</span>
              </button>
            )}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId && activeId.startsWith('card-') ? (
              <DraggableCard
                card={cards.find(card => `card-${card.id}` === activeId)!}
                onClick={() => {}}
                isDragOverlay
              />
            ) : activeId && activeId.startsWith('list-') ? (
              <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 w-72 shadow-xl">
                <h3 className="font-medium text-gray-100">
                  {lists.find(list => `list-${list.id}` === activeId)?.title}
                </h3>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/80 backdrop-blur-sm border border-red-700/50 text-red-200 px-4 py-3 rounded-md shadow-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      )}

      {/* Create Card Modal */}
      <CreateCardModal
        isOpen={cardModalState.isOpen}
        onClose={() => setCardModalState({ isOpen: false, listId: '', listTitle: '' })}
        onSubmit={handleCreateCard}
        listTitle={cardModalState.listTitle}
      />

      {/* Card Detail Modal */}
      <CardDetailModal
        isOpen={cardDetailModal.isOpen}
        onClose={() => setCardDetailModal({ isOpen: false, card: null })}
        card={cardDetailModal.card}
        onSave={handleUpdateCard}
        onDelete={handleDeleteCard}
        boardLabels={labels}
        boardMembers={[]} // For now, we'll add board members later
        loading={loading}
      />
    </div>
  );
};
