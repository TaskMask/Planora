import React from 'react';
import { 
  MoreHorizontal, 
  Calendar, 
  CheckSquare, 
  Clock, 
  AlertTriangle
} from 'lucide-react';
import type { Card } from '../../types';
import { priorityColors } from '../../data/defaultLabels';

interface CardItemProps {
  card: Card;
  onClick?: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onClick }) => {
  const getCompletedTasks = () => {
    if (!card.checklist || card.checklist.length === 0) return null;
    const completed = card.checklist.filter(item => item.completed).length;
    const total = card.checklist.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const isDueSoon = (dueDate: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    const daysDiff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 3 && daysDiff >= 0;
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  const getDueDateColor = (dueDate: string) => {
    if (isOverdue(dueDate)) return 'text-red-400 bg-red-500/20';
    if (isDueSoon(dueDate)) return 'text-amber-400 bg-amber-500/20';
    return 'text-gray-400 bg-gray-600/30';
  };

  const checklistInfo = getCompletedTasks();

  return (
    <div
      onClick={onClick}
      className="bg-gray-700/60 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-600/50 hover:shadow-lg hover:bg-gray-700/80 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 pr-2">
          <div className="flex items-start gap-2">
            {card.priority && card.priority !== 'medium' && (
              <div 
                className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
                style={{ backgroundColor: priorityColors[card.priority] }}
                title={`${card.priority} priority`}
              />
            )}
            <h4 className="text-sm font-medium text-gray-100 leading-tight">
              {card.title}
            </h4>
          </div>
        </div>
        
        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-200 p-1 rounded hover:bg-gray-600/50 transition-all">
          <MoreHorizontal className="h-3 w-3" />
        </button>
      </div>

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.slice(0, 3).map((label) => (
            <span
              key={label.id}
              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
          {card.labels.length > 3 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium text-gray-400 bg-gray-600/50">
              +{card.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      {card.description && (
        <p className="text-xs text-gray-300 mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Progress bar for checklist */}
      {checklistInfo && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <CheckSquare className="h-3 w-3" />
              <span>{checklistInfo.completed}/{checklistInfo.total}</span>
            </div>
            <span className="text-xs text-gray-400">{checklistInfo.percentage}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all duration-300 ${
                checklistInfo.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${checklistInfo.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Due Date */}
          {card.dueDate && (
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getDueDateColor(card.dueDate)}`}>
              {isOverdue(card.dueDate) && <AlertTriangle className="h-3 w-3" />}
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(card.dueDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          )}
          
          {/* Estimated Hours */}
          {card.estimatedHours && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{card.estimatedHours}h</span>
            </div>
          )}
        </div>

        {/* Assignees */}
        {card.assignees && card.assignees.length > 0 && (
          <div className="flex items-center gap-1">
            {card.assignees.slice(0, 3).map((assigneeId, index) => (
              <div
                key={assigneeId}
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border border-gray-600"
                style={{ zIndex: 3 - index, marginLeft: index > 0 ? '-8px' : '0' }}
              >
                {assigneeId[0]?.toUpperCase()}
              </div>
            ))}
            {card.assignees.length > 3 && (
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs border border-gray-600 ml-1">
                +{card.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
