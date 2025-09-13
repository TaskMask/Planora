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
  themeColor?: string;
}

export const DroppableList: React.FC<DroppableListProps> = ({
  list,
  cards,
  onAddCard,
  onCardClick,
  themeColor,
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

  const getListStyle = () => {
    if (themeColor && themeColor.includes('gradient')) {
      return {
        backgroundImage: themeColor,
        opacity: 0.9
      };
    }
    return {};
  };

  return (
    <div 
      className="backdrop-blur-md border border-white/30 rounded-xl p-4 w-72 flex-shrink-0"
      style={getListStyle()}
    >
            <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-gray-900 drop-shadow-sm">{list.title}</h3>
        <button 
          onClick={() => onAddCard(list.id, list.title)}
          className="text-gray-900 hover:text-gray-700 p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      {/* Droppable area for cards */}
      <div 
        ref={setNodeRef}
        className={`space-y-3 min-h-[120px] transition-all duration-200 ${
          isOver ? 'bg-white/30 border-gray-400/50 border-2 border-dashed rounded-xl p-3' : ''
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
            <div className={`text-center text-sm py-8 transition-colors ${
              isOver ? 'text-gray-900' : 'text-gray-900'
            }`}>
              {isOver ? 'Drop card here' : 'No cards yet'}
            </div>
          )}
        </SortableContext>
      </div>
      
      {/* Add Card Button */}
      <button 
        onClick={() => onAddCard(list.id, list.title)}
        className="w-full mt-3 py-2 text-gray-900 hover:text-gray-700 hover:bg-white/20 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add a card
      </button>
    </div>
  );
};
