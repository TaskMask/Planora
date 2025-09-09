import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { DraggableCard } from '../cards/DraggableCard';
import type { List, Card } from '../../types';

interface DroppableListProps {
  list: List;
  cards: Card[];
  onAddCard: (listId: string, listTitle: string) => void;
  onCardClick: (card: Card) => void;
}

export const DroppableList: React.FC<DroppableListProps> = ({
  list,
  cards,
  onAddCard,
  onCardClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: {
      type: 'list',
      list,
    },
  });

  const sortedCards = cards
    .filter(card => card.listId === list.id)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-100">{list.title}</h3>
        <button 
          onClick={() => onAddCard(list.id, list.title)}
          className="text-gray-400 hover:text-gray-200 p-1 rounded hover:bg-gray-700/50 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      {/* Droppable area for cards */}
      <div 
        ref={setNodeRef}
        className={`space-y-2 min-h-[100px] transition-colors ${
          isOver ? 'bg-blue-500/10 border-blue-500/30 border-2 border-dashed rounded-lg p-2' : ''
        }`}
      >
        <SortableContext items={sortedCards.map(card => card.id)} strategy={verticalListSortingStrategy}>
          {sortedCards.length > 0 ? (
            sortedCards.map((card) => (
              <DraggableCard
                key={card.id}
                card={card}
                onClick={() => onCardClick(card)}
              />
            ))
          ) : (
            <div className={`text-center text-gray-400 text-sm py-8 transition-colors ${
              isOver ? 'text-blue-400' : ''
            }`}>
              {isOver ? 'Drop card here' : 'No cards yet'}
            </div>
          )}
        </SortableContext>
      </div>
      
      {/* Add Card Button */}
      <button 
        onClick={() => onAddCard(list.id, list.title)}
        className="w-full mt-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add a card
      </button>
    </div>
  );
};
