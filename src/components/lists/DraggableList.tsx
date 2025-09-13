import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DroppableList } from './DroppableList';
import type { List, Card } from '../../types';

interface DraggableListProps {
  list: List;
  cards: Card[];
  onAddCard: (listId: string, listTitle: string) => void;
  onCardClick: (card: Card) => void;
  themeColor?: string;
}

export const DraggableList: React.FC<DraggableListProps> = ({
  list,
  cards,
  onAddCard,
  onCardClick,
  themeColor,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'list',
      list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'z-50 rotate-3 shadow-2xl' : ''}`}
    >
      {/* Drag handle - only the header is draggable for lists */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing mb-1"
      >
        <div className="h-2 bg-gradient-to-r from-transparent via-gray-600 to-transparent rounded-full opacity-0 hover:opacity-100 transition-opacity" />
      </div>
      
      <DroppableList
        list={list}
        cards={cards}
        onAddCard={onAddCard}
        onCardClick={onCardClick}
        themeColor={themeColor}
      />
    </div>
  );
};
